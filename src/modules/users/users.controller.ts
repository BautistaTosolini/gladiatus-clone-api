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
  Req,
  Headers,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticateUserDto } from 'src/dto/authenticate-user.dto';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { UserInterface } from 'lib/interfaces/user.interface';

export interface AuthenticatedRequest extends Request {
  user?: UserInterface;
}

@Controller('api/users')
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
  @Get()
  async authenticate(@Req() request: AuthenticatedRequest) {
    return request.user;
  }

  @Post('session')
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

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('journal') journalHeader: string,
    @Headers('battle') battleReportHeader: string,
  ) {
    try {
      const user = await this.userService.findOne({
        id,
        journal: journalHeader === 'true' ? true : false,
        battleReport: battleReportHeader === 'true' ? true : false,
      });

      return user;
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.NOT_FOUND);
    }
  }
}
