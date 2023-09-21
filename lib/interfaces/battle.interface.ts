import { CharacterInterface } from 'lib/interfaces/character.interface';
import { EnemyInterface } from 'lib/interfaces/enemy.interface';

export interface CalculateHPParams {
  level: number;
  endurance: number;
}

export interface CalculateDoubleHitChanceParams {
  attackerCharisma: number;
  attackerDexterity: number;
  defenderIntelligence: number;
  defenderAgility: number;
}

export interface CalculateHitChanceParams {
  attackerDexterity: number;
  defenderAgility: number;
}

export interface FightParams {
  attacker: CharacterInterface;
  defender: EnemyInterface | CharacterInterface;
}

export interface BattleCreatureParams {
  character: CharacterInterface;
  enemy: EnemyInterface;
}

export interface Round {
  roundNumber: number;
  attackerHP: number;
  defenderHP: number;
  events: string[];
}

export interface Result {
  attackerFinalHealth: number;
  defenderFinalHealth: number;
  attackerHealth: number;
  defenderHealth: number;
  attackerTotalDamage: number;
  defenderTotalDamage: number;
  winner: string;
  xpDrop?: number;
  crownsDrop?: number;
}
