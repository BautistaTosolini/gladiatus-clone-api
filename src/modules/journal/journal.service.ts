import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CharacterInterface } from 'lib/interfaces/character.interface';
import { Model } from 'mongoose';
import { Journal } from 'src/schemas/journal.schema';

@Injectable()
export class JournalService {
  constructor(
    @InjectModel(Journal.name) private journalModel: Model<Journal>,
  ) {}

  async create(character: CharacterInterface) {
    const journal = await this.journalModel.create({
      character: character._id,
    });

    return journal;
  }
}
