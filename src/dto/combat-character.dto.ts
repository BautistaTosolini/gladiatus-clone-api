import { IsString, IsNotEmpty } from 'class-validator';

export class BattleCharacterDto {
  @IsString()
  @IsNotEmpty()
  enemyName: string;

  @IsString()
  @IsNotEmpty()
  zone: string;
}
