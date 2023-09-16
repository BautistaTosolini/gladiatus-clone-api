import {
  Body,
  Controller,
  Post,
  Put,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Param,
} from '@nestjs/common';
import { CharactersService } from 'src/modules/characters/characters.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from 'src/interfaces/user.interface';
import { OnboardCharacterDto } from 'src/dto/onboard-character.dto';

@Controller('characters')
export class CharactersController {
  constructor(
    private characterService: CharactersService,
    private jwtService: JwtService,
  ) {}

  @Post()
  async create(@Body('user') user: UserInterface) {
    try {
      const character = await this.characterService.create(user);

      return character;
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const character = await this.characterService.findOne(id);

      return character;
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put()
  async onboard(
    @Body() userData: OnboardCharacterDto,
    @Req() request: Request,
  ) {
    try {
      const token = request.cookies.AuthToken;

      const { id } = await this.jwtService.verifyAsync<{ id: string }>(token, {
        secret: process.env.JWT_SECRET,
      });

      const character = this.characterService.onboard(userData, id);

      return character;
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
