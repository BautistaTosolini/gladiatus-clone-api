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
import { ItemInterface } from 'lib/interfaces/item.interface';
import { ModuleGuard } from '../auth/module.guard';

@Controller('api/characters')
export class CharactersController {
  constructor(private characterService: CharactersService) {}

  @Post()
  async create(@Body('user') user: UserInterface) {
    try {
      const character = await this.characterService.create(user);

      return character;
    } catch (error) {
      console.log(error);
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
      console.log(error);
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
      console.log(error);
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Post('battle/:id')
  async battleCharacter(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    try {
      const attacker = request.user.character;

      const result = await this.characterService.battleCharacter({
        attacker,
        defenderId: id,
      });

      return result;
    } catch (error) {
      console.log(error);
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
      console.log(error);
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Post('/arena/:id')
  async arenaBattle(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    try {
      const character = request.user.character;

      const battleReportId = await this.characterService.arenaBattle({
        attacker: character,
        defenderId: id,
      });

      return { battleReportId };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('/arena')
  async findArenaRivals(@Req() request: AuthenticatedRequest) {
    try {
      const character = request.user.character;

      const rivals = await this.characterService.findArenaRivals(character._id);

      return rivals;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('/highscore')
  async findHighscore() {
    return this.characterService.findHighscore();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const character = await this.characterService.findOne(id);

      return character;
    } catch (error) {
      console.log(error);
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
      console.log(error);
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Put('/equipment')
  async equipItem(
    @Body('item') item: ItemInterface,
    @Req() request: AuthenticatedRequest,
  ) {
    try {
      const character = request.user.character;

      const updatedCharacter = await this.characterService.equipItem(
        character,
        item,
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
  @Put('/train')
  async train(
    @Body('stat') stat: string,
    @Req() request: AuthenticatedRequest,
  ) {
    try {
      const character = request.user.character;

      const result = await this.characterService.train({ stat, character });

      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(ModuleGuard)
  @Put('/:id')
  async updateCharacter(
    @Body('payload') payload: any,
    @Param('id') id: string,
  ) {
    try {
      const updatedCharacter = await this.characterService.updateCharacter({
        payload,
        id,
      });

      return updatedCharacter;
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
