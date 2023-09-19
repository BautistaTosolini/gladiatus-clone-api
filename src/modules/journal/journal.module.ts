import { Module } from '@nestjs/common';
import { JournalService } from 'src/modules/journal/journal.service';
import { Journal, JournalSchema } from 'src/schemas/journal.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JournalController } from 'src/modules/journal/journal.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Journal.name,
        schema: JournalSchema,
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [JournalController],
  providers: [JournalService],
})
export class JournalModule {}
