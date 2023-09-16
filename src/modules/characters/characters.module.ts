import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Character, CharacterSchema } from 'src/schemas/character.schema';
import { CharactersController } from 'src/modules/characters/characters.controller';
import { CharactersService } from 'src/modules/characters/characters.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Character.name,
        schema: CharacterSchema,
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class CharactersModule {}
