import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Character {
  @Prop({
    type: mongoose.Types.ObjectId,
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
    default: 3,
  })
  strength: number;

  @Prop({
    type: Number,
    default: 3,
  })
  dexterity: number;

  @Prop({
    type: Number,
    default: 3,
  })
  endurance: number;

  @Prop({
    type: Number,
    default: 3,
  })
  agility: number;

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
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
