import { ItemInterface } from './item.interface';

export interface EnemyInterface {
  name: string;
  image: string;
  level: number;
  strength: number;
  endurance: number;
  dexterity: number;
  agility: number;
  intelligence: number;
  charisma: number;
  experience: number[];
  crowns: number[];
  items: string[];
  boss?: boolean;
  id: number;
  power?: number;
  mainHand?: ItemInterface;
  head?: ItemInterface;
  legs?: ItemInterface;
  chest?: ItemInterface;
}
