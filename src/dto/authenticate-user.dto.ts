import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class AuthenticateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class FindOneUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  journal: boolean;

  @IsBoolean()
  battleReport: boolean;
}
