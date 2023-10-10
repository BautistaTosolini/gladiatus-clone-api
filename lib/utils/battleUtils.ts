import {
  BattleCreatureParams,
  CalculateDoubleHitChanceParams,
  CalculateHPParams,
  CalculateHitChanceParams,
  FightParams,
  Result,
  Round,
} from 'lib/interfaces/battle.interface';
import { CharacterInterface } from 'lib/interfaces/character.interface';
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
    power:
      stats.strength +
      stats.endurance +
      stats.dexterity +
      stats.agility +
      stats.intelligence +
      stats.charisma +
      selectedLevel * 10,
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
      const damage = calculateDamage(attacker, defender);
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
      const damage = calculateDamage(defender, defender);
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

    const result: Result = {
      winner,
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
    // If defender has id field its a creature
    if ('id' in defender) {
      winner = defender.id.toString();

      // If it doesn't its a character
    } else {
      winner = defender._id;
    }

    const result: Result = {
      winner,
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
    winner = attacker._id;

    const result: Result = {
      winner,
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

function calculateDamage(
  attacker: CharacterInterface | EnemyInterface,
  defender: CharacterInterface | EnemyInterface,
) {
  let minDamage = attacker.strength * 0.1;
  let maxDamage = attacker.strength * 0.2;

  if (
    attacker.mainHand &&
    typeof attacker.mainHand === 'object' &&
    'damage' in attacker.mainHand
  ) {
    const { damage } = attacker.mainHand;
    if (Array.isArray(damage) && damage.length === 2) {
      minDamage += damage[0];
      maxDamage += damage[1];
    }
  }

  let defenderArmor = 0;

  if (
    defender.head &&
    typeof defender.head === 'object' &&
    'armor' in defender.head
  ) {
    defenderArmor += defender.head.armor;
  }

  if (
    defender.chest &&
    typeof defender.chest === 'object' &&
    'armor' in defender.chest
  ) {
    defenderArmor += defender.chest.armor;
  }

  if (
    defender.legs &&
    typeof defender.legs === 'object' &&
    'armor' in defender.legs
  ) {
    defenderArmor += defender.legs.armor;
  }

  minDamage -= defenderArmor * 0.3;
  maxDamage -= defenderArmor * 0.3;

  const damage = Math.random() * (maxDamage - minDamage) + minDamage;

  return parseInt(Math.max(damage, 1).toFixed(0));
}

function calculateCriticalDamage(
  attacker: CharacterInterface | EnemyInterface,
) {
  let minDamage = attacker.strength * 0.3;
  let maxDamage = attacker.strength * 0.6;

  if (
    attacker.mainHand &&
    typeof attacker.mainHand === 'object' &&
    'damage' in attacker.mainHand
  ) {
    const { damage } = attacker.mainHand;
    if (Array.isArray(damage) && damage.length === 2) {
      minDamage += damage[0] * 1.3;
      maxDamage += damage[1] * 1.3;
    }
  }

  const damage = Math.random() * (maxDamage - minDamage) + minDamage;

  return parseInt(Math.max(damage, 1).toFixed(0));
}

export function battleCreature({ character, enemy }: BattleCreatureParams): {
  battle: { rounds: Round[]; result: Result };
  pickedEnemy: EnemyInterface;
} {
  const pickedEnemy = getRandomEnemyStats(enemy);

  const battle = fight({ attacker: character, defender: pickedEnemy });

  if (battle.result.winner === 'Draw') {
    const experienceDrop = parseInt(
      (
        getRandomNumber(pickedEnemy.experience[0], pickedEnemy.experience[1]) *
        0.5
      ).toFixed(0),
    );
    const crownsDrop = parseInt(
      getRandomNumber(
        pickedEnemy.crowns[0],
        pickedEnemy.crowns[1] * 0.3,
      ).toFixed(0),
    );

    battle.result.experienceDrop = experienceDrop;
    battle.result.crownsDrop = crownsDrop;
  }

  if (battle.result.winner === character._id) {
    const experienceDrop = getRandomNumber(
      pickedEnemy.experience[0],
      pickedEnemy.experience[1],
    );
    const crownsDrop = getRandomNumber(
      pickedEnemy.crowns[0],
      pickedEnemy.crowns[1],
    );

    battle.result.experienceDrop = experienceDrop;
    battle.result.crownsDrop = crownsDrop;
  }

  if (battle.result.winner === pickedEnemy.id.toString()) {
    const experienceDrop = parseInt(
      (
        getRandomNumber(pickedEnemy.experience[0], pickedEnemy.experience[1]) *
        0.3
      ).toFixed(0),
    );
    const crownsDrop = 0;

    battle.result.experienceDrop = experienceDrop;
    battle.result.crownsDrop = crownsDrop;
  }

  return { battle, pickedEnemy };
}

export function calculateHonour(
  attacker: CharacterInterface,
  defender: CharacterInterface,
  attackerWin: boolean,
) {
  const K = 40;
  const expectedResult =
    1 / (1 + 10 ** ((defender.honour - attacker.honour) / 400));
  const realResult = attackerWin ? 1 : 0;

  const winLoss = K * (realResult - expectedResult);

  return parseInt(winLoss.toFixed(0));
}
