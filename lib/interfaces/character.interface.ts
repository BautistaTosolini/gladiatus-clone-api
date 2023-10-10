import { UserInterface } from 'lib/interfaces/user.interface';
import { JournalInterface } from './journal.interface';
import { Result, Round } from './battle.interface';
import { Document, Types } from 'mongoose';
import { ItemInterface } from './item.interface';

export interface CharacterInterface extends Document {
  _id: string;
  name: string;
  owner: UserInterface | string;
  journal: JournalInterface;
  crowns: number;
  experience: number;
  level: number;
  dexterity: number;
  agility: number;
  endurance: number;
  strength: number;
  intelligence: number;
  charisma: number;
  onboarded: boolean;
  gender: 'male' | 'female';
  battleReport: Types.ObjectId;
  honour: number;
  power?: number;
  rank?: number;
  inventory: null[][] | ItemInterface[][] | string[][];
  mainHand: string | ItemInterface;
  offHand: string | ItemInterface;
  chest: string | ItemInterface;
  head: string | ItemInterface;
  legs: string | ItemInterface;
}

export interface BattleReport {
  result: Result;
  rounds: Round[];
}
