import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { User } from 'src/schemas/user.schema';
import { genSalt, hash, compare } from 'bcryptjs';
import { AuthenticateUserDto } from 'src/dto/authenticate-user.dto';
import { JwtService } from '@nestjs/jwt';

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

    user.password = undefined;

    const token = this.jwtService.sign({ id: user._id });

    const data = {
      user,
      token,
    };

    return data;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  update(id: string, user: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, user);
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
