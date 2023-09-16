import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OnboardCharacterDto } from 'src/dto/onboard-character.dto';
import { UserInterface } from 'src/interfaces/user.interface';
import { Character } from 'src/schemas/character.schema';

@Injectable()
export class CharactersService {
  constructor(
    @InjectModel(Character.name) private characterModel: Model<Character>,
  ) {}

  async create(user: UserInterface) {
    const character = await this.characterModel.create({ owner: user._id });

    return character;
  }

  async findOne(id: string) {
    const character = await this.characterModel.findById(id);

    if (!character) {
      throw new HttpException('Character not found', 404);
    }

    return character;
  }

  async onboard(userData: OnboardCharacterDto, id: string) {
    const { gender, name } = userData;

    const character = await this.characterModel.findOne({ owner: id });

    if (!character) {
      throw new HttpException('Character not found', 404);
    }

    if (character.onboarded) {
      throw new HttpException('Already onboarded', 401);
    }

    character.gender = gender;
    character.name = name;
    character.onboarded = true;

    await character.save();

    return character;
  }
}
