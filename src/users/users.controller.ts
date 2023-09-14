import {
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticateUserDto } from 'src/dto/authenticate-user.dto';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from 'src/users/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async create(
    @Res({ passthrough: true }) response: Response,
    @Body() userData: CreateUserDto,
  ) {
    try {
      const { token, user } = await this.userService.create(userData);

      response.cookie('AuthToken', token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      });

      return user;
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
      const user = await this.userService.findOne(id);

      return user;
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.NOT_FOUND);
    }
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() userData: AuthenticateUserDto,
  ) {
    try {
      const { token, user } = await this.userService.login(userData);

      response.cookie('AuthToken', token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      });

      return user;
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
