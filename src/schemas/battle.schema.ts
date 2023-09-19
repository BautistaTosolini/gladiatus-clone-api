import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Result, Round } from 'lib/interfaces/battle.interface';
import { EnemyInterface } from 'lib/interfaces/enemy.interface';
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
}

export const BattleSchema = SchemaFactory.createForClass(Battle);
