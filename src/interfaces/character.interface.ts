import { UserInterface } from 'src/interfaces/user.interface';

export interface CharacterInterface {
  _id: string;
  name: string;
  owner: UserInterface | string;
  crowns: number;
  experience: number;
  level: number;
  dexterity: number;
  agility: number;
  endurance: number;
  strength: number;
  onboarded: boolean;
  gender: 'male' | 'female';
}
