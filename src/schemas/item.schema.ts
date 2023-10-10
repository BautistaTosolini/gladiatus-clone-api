import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Item {
  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  image: string;

  @Prop({
    type: String,
    enum: ['mainHand', 'offHand', 'head', 'chest', 'legs'],
  })
  type: 'mainHand' | 'offHand' | 'head' | 'chest' | 'legs';

  @Prop({
    type: Number,
  })
  level: number;

  @Prop({
    required: false,
    type: [],
  })
  damage?: number[];

  @Prop({
    required: false,
    type: Number,
  })
  armor?: number;

  @Prop({
    type: Number,
  })
  power: number;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Character',
  })
  owner: string;

  @Prop({
    type: Number,
  })
  sellPrice: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
