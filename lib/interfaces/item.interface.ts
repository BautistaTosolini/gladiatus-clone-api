import { Document } from 'mongoose';

export interface ItemInterface extends Document {
  _id: string;
  name: string;
  image: string;
  type: 'mainHand' | 'offHand' | 'head' | 'chest' | 'legs';
  damage?: number[];
  armor?: number;
  strength?: number;
  endurance?: number;
  agility?: number;
  dexterity?: number;
  charisma?: number;
  intelligence?: number;
  power: number;
  probability: number;
  level: number;
}
