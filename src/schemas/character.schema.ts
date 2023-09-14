import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    default: 0,
  })
  crowns: number;

  @Prop({
    default: 1,
  })
  level: number;

  @Prop({
    default: 0,
  })
  experience: number;

  @Prop({
    default: 3,
  })
  strength: number;

  @Prop({
    default: 3,
  })
  dexterity: number;

  @Prop({
    default: 3,
  })
  endurance: number;

  @Prop({
    default: 3,
  })
  agility: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
