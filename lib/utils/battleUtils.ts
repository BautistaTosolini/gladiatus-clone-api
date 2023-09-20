import {
  BattleZoneParams,
  CalculateDoubleHitChanceParams,
  CalculateHPParams,
  CalculateHitChanceParams,
  FightParams,
  Result,
  Round,
} from 'lib/interfaces/battle.interface';
import { EnemyInterface } from 'lib/interfaces/enemy.interface';
import { getRandomNumber, randomBoolean } from 'lib/utils/randomUtils';

export function getRandomEnemyStats(enemy: EnemyInterface) {
  const levels = enemy.level;

  // If the level is a single value, there are no options, use that level.
  if (!Array.isArray(levels)) {
    return {
      ...enemy,
    };
  }

  // If the level has multiple options, choose a random one.
  const randomIndex = Math.floor(Math.random() * levels.length);
  const selectedLevel = levels[randomIndex];

  // Get the statistics corresponding to the selected level.
  const stats = {
    strength: enemy.strength[randomIndex],
    endurance: enemy.endurance[randomIndex],
    dexterity: enemy.dexterity[randomIndex],
    agility: enemy.agility[randomIndex],
    intelligence: enemy.intelligence[randomIndex],
    charisma: enemy.charisma[randomIndex],
  };

  return {
    ...enemy,
    level: selectedLevel,
    strength: stats.strength,
    endurance: stats.endurance,
    dexterity: stats.dexterity,
    agility: stats.agility,
    intelligence: stats.intelligence,
    charisma: stats.charisma,
  };
}

export function calculateHP({ level, endurance }: CalculateHPParams): number {
  return level * 25 + (endurance * 2 - 10);
}

export function calculateHitChance({
  attackerDexterity,
  defenderAgility,
}: CalculateHitChanceParams): number {
  return (attackerDexterity / (attackerDexterity + defenderAgility)) * 100;
}

export function calculateCriticalHitChance({
  attackerCharisma,
  attackerDexterity,
  defenderIntelligence,
  defenderAgility,
}: CalculateDoubleHitChanceParams): number {
  return (
    (attackerCharisma * attackerDexterity) /
    defenderIntelligence /
    (defenderAgility * 10)
  );
}

export function fight({ attacker, defender }: FightParams): {
  rounds: Round[];
  result: Result;
} {
  let attackerHP = calculateHP({
    level: attacker.level,
    endurance: attacker.endurance,
  });

  let defenderHP = calculateHP({
    level: defender.level,
    endurance: defender.endurance,
  });

  const attackerHitChance = calculateHitChance({
    attackerDexterity: attacker.dexterity,
    defenderAgility: defender.agility,
  });

  const defenderHitChance = calculateHitChance({
    attackerDexterity: defender.dexterity,
    defenderAgility: attacker.agility,
  });

  const attackerCriticalHitChance = calculateCriticalHitChance({
    attackerCharisma: attacker.charisma,
    attackerDexterity: attacker.dexterity,
    defenderIntelligence: defender.intelligence,
    defenderAgility: defender.agility,
  });

  const defenderCriticalHitChance = calculateCriticalHitChance({
    attackerCharisma: defender.charisma,
    attackerDexterity: defender.dexterity,
    defenderIntelligence: attacker.intelligence,
    defenderAgility: attacker.agility,
  });

  // rounds calculations
  const rounds: Round[] = [];
  let roundNumber = 1;

  let attackerTotalDamage = 0;
  let defenderTotalDamage = 0;

  while (attackerHP > 0 && defenderHP > 0) {
    const round: Round = {
      roundNumber,
      attackerHP: parseFloat(attackerHP.toFixed(2)),
      defenderHP: parseFloat(defenderHP.toFixed(2)),
      events: [],
    };

    if (randomBoolean(attackerHitChance)) {
      const damage = calculateDamage(attacker);
      attackerTotalDamage += damage;
      defenderHP -= damage;
      round.events.push(
        `${attacker.name} hits ${defender.name} for ${parseFloat(
          damage.toFixed(2),
        )} points.`,
      );
    } else {
      round.events.push(`${attacker.name} misses their attack.`);
    }

    if (randomBoolean(defenderHitChance)) {
      const damage = calculateDamage(defender);
      defenderTotalDamage += damage;
      attackerHP -= damage;
      round.events.push(
        `${defender.name} hits ${attacker.name} for ${parseFloat(
          damage.toFixed(2),
        )} points.`,
      );
    } else {
      round.events.push(`${defender.name} misses their attack.`);
    }

    if (randomBoolean(attackerCriticalHitChance)) {
      const criticalDamage = calculateCriticalDamage(attacker);
      attackerTotalDamage += criticalDamage;
      defenderHP -= criticalDamage;
      round.events.push(
        `${attacker.name} lands a critical hit on ${
          defender.name
        } for ${parseFloat(criticalDamage.toFixed(2))} points.`,
      );
    }

    if (randomBoolean(defenderCriticalHitChance)) {
      const criticalDamage = calculateCriticalDamage(defender);
      defenderTotalDamage += criticalDamage;
      attackerHP -= criticalDamage;
      round.events.push(
        `${defender.name} lands a critical hit on ${
          attacker.name
        } for ${parseFloat(criticalDamage.toFixed(2))} points.`,
      );
    }

    rounds.push(round);
    roundNumber++;
  }

  // results calculations
  let winner: string;

  const attackerFinalHealth = parseFloat(attackerHP.toFixed(2));
  const defenderFinalHealth = parseFloat(defenderHP.toFixed(2));

  const roundedAttackerTotalDamage = parseInt(attackerTotalDamage.toFixed(2));
  const roundedDefenderTotalDamage = parseInt(defenderTotalDamage.toFixed(2));

  if (attackerHP <= 0 && defenderHP <= 0) {
    winner = 'Draw';
    const xpDrop = parseInt(
      (getRandomNumber(defender.xp[0], defender.xp[1]) * 0.5).toFixed(0),
    );
    const crownsDrop = parseInt(
      getRandomNumber(defender.crowns[0], defender.crowns[1] * 0.3).toFixed(0),
    );

    const result: Result = {
      winner,
      xpDrop,
      crownsDrop,
      attackerFinalHealth,
      defenderFinalHealth,
      attackerTotalDamage: roundedAttackerTotalDamage,
      defenderTotalDamage: roundedDefenderTotalDamage,
      attackerHealth: calculateHP({
        level: attacker.level,
        endurance: attacker.endurance,
      }),
      defenderHealth: calculateHP({
        level: defender.level,
        endurance: defender.endurance,
      }),
    };

    return { rounds, result };
  } else if (attackerHP <= 0) {
    winner = defender.name;
    const xpDrop = parseInt(
      (getRandomNumber(defender.xp[0], defender.xp[1]) * 0.3).toFixed(0),
    );
    const crownsDrop = 0;

    const result: Result = {
      winner,
      xpDrop,
      crownsDrop,
      attackerFinalHealth,
      defenderFinalHealth,
      attackerTotalDamage: roundedAttackerTotalDamage,
      defenderTotalDamage: roundedDefenderTotalDamage,
      attackerHealth: calculateHP({
        level: attacker.level,
        endurance: attacker.endurance,
      }),
      defenderHealth: calculateHP({
        level: defender.level,
        endurance: defender.endurance,
      }),
    };

    return { rounds, result };
  } else {
    winner = attacker.name;
    const xpDrop = getRandomNumber(defender.xp[0], defender.xp[1]);
    const crownsDrop = getRandomNumber(defender.crowns[0], defender.crowns[1]);

    const result: Result = {
      winner,
      xpDrop,
      crownsDrop,
      attackerFinalHealth,
      defenderFinalHealth,
      attackerTotalDamage: roundedAttackerTotalDamage,
      defenderTotalDamage: roundedDefenderTotalDamage,
      attackerHealth: calculateHP({
        level: attacker.level,
        endurance: attacker.endurance,
      }),
      defenderHealth: calculateHP({
        level: defender.level,
        endurance: defender.endurance,
      }),
    };

    return { rounds, result };
  }
}

function calculateDamage(attacker) {
  const minDamage = attacker.strength * 0.1;
  const maxDamage = attacker.strength * 0.2;
  const damage = Math.random() * (maxDamage - minDamage) + minDamage;

  return Math.max(damage, 1);
}

function calculateCriticalDamage(attacker) {
  const minCriticalDamage = attacker.strength * 0.2;
  const maxCriticalDamage = attacker.strength * 0.3;
  const criticalDamage =
    Math.random() * (maxCriticalDamage - minCriticalDamage) + minCriticalDamage;

  return Math.max(criticalDamage, 1);
}

export function battleZone({ character, enemy }: BattleZoneParams): {
  battleResults: { rounds: Round[]; result: Result };
  pickedEnemy: EnemyInterface;
} {
  const pickedEnemy = getRandomEnemyStats(enemy);

  const battleResults = fight({ attacker: character, defender: pickedEnemy });

  return { battleResults, pickedEnemy };
}
