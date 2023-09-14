import { IsString, IsNotEmpty } from 'class-validator';

export class AuthenticateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
