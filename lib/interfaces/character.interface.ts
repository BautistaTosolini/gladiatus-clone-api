import { UserInterface } from 'lib/interfaces/user.interface';
import { JournalInterface } from './journal.interface';
import { Result, Round } from './battle.interface';
import { Types } from 'mongoose';

export interface CharacterInterface {
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
}

export interface BattleReport {
  result: Result;
  rounds: Round[];
}
