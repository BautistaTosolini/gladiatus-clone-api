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
  xp: number[];
  crowns: number[];
  boss?: boolean;
  id: number;
  power?: number;
}
