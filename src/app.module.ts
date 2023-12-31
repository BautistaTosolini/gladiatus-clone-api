import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CharactersModule } from 'src/modules/characters/characters.module';
import { ItemsModule } from './modules/items/items.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UsersModule,
    CharactersModule,
    ItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
