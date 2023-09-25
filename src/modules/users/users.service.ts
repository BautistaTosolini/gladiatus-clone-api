import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { User } from 'src/schemas/user.schema';
import { genSalt, hash, compare } from 'bcryptjs';
import {
  AuthenticateUserDto,
  FindOneUserDto,
} from 'src/dto/authenticate-user.dto';
import { JwtService } from '@nestjs/jwt';
// import { OnboardUserDto } from 'src/dto/onboard-user.dto';
import axios from 'axios';
import { BASE_API_URL } from 'lib/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(userData: CreateUserDto) {
    const { name, email, password } = userData;

    const isNameTaken = await this.userModel.findOne({
      username: name.toLowerCase(),
    });

    if (isNameTaken) {
      throw new HttpException('Name is already taken', 400);
    }

    const isEmailTaken = await this.userModel.findOne({ email: email });

    if (isEmailTaken) {
      throw new HttpException('Email is already taken', 400);
    }

    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);

    const user = await this.userModel.create({
      name,
      username: name.toLowerCase(),
      email,
      password: hashedPassword,
    });

    if (!user) {
      throw new HttpException('Something went wrong', 500);
    }

    const result = await axios.post(`${BASE_API_URL}/characters`, {
      user,
    });

    const character = result.data;

    user.character = character;

    await user.save();

    user.password = undefined;

    const token = this.jwtService.sign({ id: user._id });

    const data = {
      user,
      token,
    };

    return data;
  }

  async findOne({ id, journal, battleReport }: FindOneUserDto) {
    if (journal && battleReport) {
      const user = await this.userModel.findById(id).populate({
        path: 'character',
        populate: { path: 'journal battleReport' },
      });

      return user;
    }

    if (journal) {
      const user = await this.userModel
        .findById(id)
        .populate({ path: 'character', populate: { path: 'journal' } });

      return user;
    }

    if (battleReport) {
      const user = await this.userModel
        .findById(id)
        .populate({ path: 'character', populate: { path: 'battleReport' } });

      return user;
    }

    const user = await this.userModel
      .findById(id)
      .populate({ path: 'character' });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  async login(userData: AuthenticateUserDto) {
    const { email, password } = userData;

    const user = await this.userModel
      .findOne({ email })
      .select('password name username email _id'); // password is not selected by default

    if (!user) {
      throw new HttpException('Invalid password or email', 401);
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid password or email', 401);
    }

    user.password = undefined; // remove password before sending to the client

    const token = this.jwtService.sign({ id: user._id });

    const data = {
      user,
      token,
    };

    return data;
  }
}
