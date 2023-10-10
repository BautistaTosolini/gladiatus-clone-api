import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Result, Round } from 'lib/interfaces/battle.interface';
import { CharacterInterface } from 'lib/interfaces/character.interface';
import { EnemyInterface } from 'lib/interfaces/enemy.interface';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type BattleDocument = Battle & Document;

@Schema({
  timestamps: true,
})
export class Battle {
  @Prop({
    type: {
      winner: String,
      attackerFinalHealth: Number,
      defenderFinalHealth: Number,
      attackerTotalDamage: Number,
      defenderTotalDamage: Number,
      attackerHealth: Number,
      defenderHealth: Number,
      honourEarned: Number,
      honourLost: Number,
      experienceDrop: Number,
      crownsDrop: Number,
    },
  })
  result: Result;

  @Prop({
    type: Object,
  })
  rounds: Round[];

  @Prop({
    type: String,
  })
  zone?: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Character',
  })
  defender: EnemyInterface | mongoose.Types.ObjectId | CharacterInterface;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Character',
  })
  attacker: mongoose.Types.ObjectId;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    required: false,
  })
  items: string[];
}

export const BattleSchema = SchemaFactory.createForClass(Battle);
