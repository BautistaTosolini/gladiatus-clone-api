import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CharactersController } from './characters/characters.controller';
import { CharactersService } from './characters/characters.service';
import { CharactersModule } from './characters/characters.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UsersModule,
    CharactersModule,
  ],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class AppModule {}
