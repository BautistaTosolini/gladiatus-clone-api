import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Character {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: string;

  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: Number,
    default: 0,
  })
  crowns: number;

  @Prop({
    type: Number,
    default: 1,
  })
  level: number;

  @Prop({
    type: Number,
    default: 0,
  })
  experience: number;

  @Prop({
    type: Number,
    default: 5,
  })
  strength: number;

  @Prop({
    type: Number,
    default: 5,
  })
  dexterity: number;

  @Prop({
    type: Number,
    default: 5,
  })
  endurance: number;

  @Prop({
    type: Number,
    default: 5,
  })
  agility: number;

  @Prop({
    type: Number,
    default: 5,
  })
  intelligence: number;

  @Prop({
    type: Number,
    default: 5,
  })
  charisma: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  onboarded: boolean;

  @Prop({
    type: String,
    enum: ['male', 'female'],
  })
  gender: 'male' | 'female';

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Journal',
  })
  journal: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Battle',
  })
  battleReport: string;

  @Prop({
    type: Number,
    default: 0,
  })
  honour: number;

  @Prop({
    type: [[{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]],
    default: [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
    ],
  })
  inventory: string[][];

  @Prop({
    type: [[{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]],
    default: [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
    ],
  })
  shop: string[][];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null,
  })
  mainHand: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null,
  })
  offHand: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null,
  })
  head: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null,
  })
  chest: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null,
  })
  legs: string;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
