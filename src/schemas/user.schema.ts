import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
  })
  character: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
