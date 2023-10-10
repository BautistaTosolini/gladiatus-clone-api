import {
  Body,
  Controller,
  Delete,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CharacterInterface } from 'lib/interfaces/character.interface';
import { ItemInterface } from 'lib/interfaces/item.interface';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from '../users/users.controller';
import axios from 'axios';
import { BASE_API_URL } from 'lib/constants';
import { JwtService } from '@nestjs/jwt';

@Controller('api/items')
export class ItemsController {
  constructor(
    private itemService: ItemsService,
    private jwtService: JwtService,
  ) {}

  @Post()
  async create(
    @Body('character') character: CharacterInterface,
    @Body('item') item: ItemInterface,
  ) {
    try {
      const createdItem = await this.itemService.create({ character, item });

      return createdItem;
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put()
  async populateItems(
    @Body('character') character: CharacterInterface,
    @Headers('inventory') inventoryHeader: string,
  ) {
    try {
      const populatedCharacter = await this.itemService.populateItems({
        character,
        inventoryHeader: inventoryHeader === 'true' ? true : false,
      });

      return populatedCharacter;
    } catch (error) {
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

      const updatedCharacter = await this.itemService.equipItem({
        character,
        item,
      });

      const password = process.env.MODULE_PASSWORD;

      const token = this.jwtService.sign({ password: password });

      await axios.put(
        `${BASE_API_URL}/characters/${character._id}`,
        {
          payload: updatedCharacter,
        },
        { headers: { authorization: `Bearer ${token}` } },
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
  @Delete('/equipment/:type')
  async unequipItem(
    @Req() request: AuthenticatedRequest,
    @Param('type') type: 'mainHand' | 'offHand' | 'head' | 'chest' | 'leg',
  ) {
    try {
      const character = request.user.character;

      const updatedCharacter = await this.itemService.unequipItem({
        character,
        type,
      });

      const password = process.env.MODULE_PASSWORD;

      const token = this.jwtService.sign({ password: password });

      await axios.put(
        `${BASE_API_URL}/characters/${character._id}`,
        {
          payload: updatedCharacter,
        },
        { headers: { authorization: `Bearer ${token}` } },
      );

      return updatedCharacter;
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
