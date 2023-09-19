import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Result, Round } from 'lib/interfaces/battle.interface';
import { EnemyInterface } from 'lib/interfaces/enemy.interface';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type BattleDocument = Battle & Document;

@Schema({
  timestamps: true,
})
export class Battle {
  @Prop({
    type: Object,
  })
  result: Result;

  @Prop({
    type: Object,
  })
  rounds: Round[];

  @Prop({
    type: Object,
  })
  enemy: EnemyInterface;

  @Prop({
    type: String,
  })
  zone: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Character',
  })
  fighter: mongoose.Types.ObjectId;
}

export const BattleSchema = SchemaFactory.createForClass(Battle);
