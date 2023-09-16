import { IsString, IsNotEmpty } from 'class-validator';

export class OnboardCharacterDto {
  @IsString()
  @IsNotEmpty()
  gender: 'male' | 'female';

  @IsString()
  @IsNotEmpty()
  name: string;
}
