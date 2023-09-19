import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CharacterInterface } from 'lib/interfaces/character.interface';
import { JournalService } from 'src/modules/journal/journal.service';
@Controller('api/journal')
export class JournalController {
  constructor(private journalService: JournalService) {}

  @Post()
  async create(@Body('character') character: CharacterInterface) {
    try {
      const journal = await this.journalService.create(character);

      return journal;
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
