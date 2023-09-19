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
  UseGuards,
  Query,
} from '@nestjs/common';
import { CharactersService } from 'src/modules/characters/characters.service';
import { UserInterface } from 'lib/interfaces/user.interface';
import { OnboardCharacterDto } from 'src/dto/onboard-character.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { AuthenticatedRequest } from 'src/modules/users/users.controller';

@Controller('api/characters')
export class CharactersController {
  constructor(private characterService: CharactersService) {}

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

  @UseGuards(AuthGuard)
  @Put()
  async onboard(
    @Body() userData: OnboardCharacterDto,
    @Req() request: AuthenticatedRequest,
  ) {
    try {
      const character = request.user.character;

      const updatedCharacter = this.characterService.onboard(
        userData,
        character,
      );

      return updatedCharacter;
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Post('battle')
  async battle(
    @Query('zone') zone: string,
    @Query('enemy') enemy: string,
    @Req() request: AuthenticatedRequest,
  ) {
    try {
      const character = request.user.character;

      const battleData = {
        zone,
        enemyName: enemy,
      };

      const result = await this.characterService.battle(battleData, character);

      return result;
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('enemy')
  async findEnemies(
    @Query('zone') zone: string,
    @Req() request: AuthenticatedRequest,
  ) {
    try {
      const character = request.user.character;

      const zoneInfo = this.characterService.findEnemies({
        character,
        zoneName: zone,
      });

      return zoneInfo;
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Get('/battle/:id')
  async findBattleReport(@Param('id') id: string) {
    try {
      const battleReport = await this.characterService.findBattleReport(id);

      return battleReport;
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
