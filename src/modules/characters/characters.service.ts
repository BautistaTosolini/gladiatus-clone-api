import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OnboardCharacterDto } from 'src/dto/onboard-character.dto';
import { UserInterface } from 'lib/interfaces/user.interface';
import { Character } from 'src/schemas/character.schema';
import { JwtService } from '@nestjs/jwt';
import { CharacterInterface } from 'lib/interfaces/character.interface';
import { BattleCharacterDto } from 'src/dto/combat-character.dto';
import { zones } from 'data/enemies';
import { battleCreature, fight } from 'lib/utils/battleUtils';
import { randomBoolean } from 'lib/utils/randomUtils';
import { Battle } from 'src/schemas/battle.schema';
import { Journal } from 'src/schemas/journal.schema';
import { calculateExperience } from 'lib/utils/characterUtils';

@Injectable()
export class CharactersService {
  constructor(
    @InjectModel(Character.name) private characterModel: Model<Character>,
    @InjectModel(Battle.name) private battleModel: Model<Battle>,
    @InjectModel(Journal.name) private journalModel: Model<Journal>,
    private jwtService: JwtService,
  ) {}

  async create(user: UserInterface) {
    const character = await this.characterModel.create({ owner: user._id });

    const journal = await this.journalModel.create({
      character: character._id,
    });

    character.journal = journal._id.toString();

    await character.save();

    return character;
  }

  async findOne(id: string) {
    const character = await this.characterModel.findById(id);

    if (!character) {
      throw new HttpException('Character not found', 404);
    }

    return character;
  }

  async onboard(userData: OnboardCharacterDto, character: CharacterInterface) {
    const { gender, name } = userData;

    if (character.onboarded) {
      throw new HttpException('Already onboarded', 401);
    }

    const updatedCharacter = await this.characterModel.findByIdAndUpdate(
      character._id,
      {
        gender,
        name,
        onboarded: true,
      },
    );

    if (!updatedCharacter) {
      throw new HttpException('Something went wrong', 500);
    }

    return updatedCharacter;
  }

  async battle(battleData: BattleCharacterDto, character: CharacterInterface) {
    if (!character.onboarded) {
      throw new HttpException('Character not onboarded', 401);
    }

    const { zone, enemyName } = battleData;

    const journal = character.journal;

    const enemy = zones[zone][enemyName];

    const { battle, pickedEnemy } = battleCreature({ character, enemy });

    // Update journal logs
    journal.zones[zone][enemyName].battles++;

    if (battle.result.winner === character.name) {
      journal.world.battles++;
      journal.world.wins++;
      journal.world.crownsEarned += battle.result.crownsDrop;
      journal.zones[zone][enemyName].wins++;

      if (journal.zones[zone][enemyName].knowledge < 3 && randomBoolean(30)) {
        journal.zones[zone][enemyName].knowledge++;
      }
    }

    if (battle.result.winner === pickedEnemy.name) {
      journal.world.battles++;
      journal.world.defeats++;
      journal.zones[zone][enemyName].defeats++;
    }

    if (battle.result.winner === 'Draw') {
      journal.world.battles++;
      journal.world.draws++;
      journal.zones[zone][enemyName].draws++;
    }

    await this.journalModel.findByIdAndUpdate(journal._id, journal);

    // Create the battle report and save in the character
    const savedBattleReport = await this.battleModel.create({
      result: battle.result,
      rounds: battle.rounds,
      zone,
      defender: pickedEnemy,
      attacker: character._id,
    });

    await this.battleModel.findByIdAndDelete(character.battleReport);

    character.battleReport = savedBattleReport._id;

    // Calculates experience and leveling up
    if (
      character.experience + battle.result.xpDrop >=
      calculateExperience(character.level)
    ) {
      character.experience =
        character.experience +
        battle.result.xpDrop -
        calculateExperience(character.level);
      character.level++;
    } else {
      character.experience += battle.result.xpDrop;
    }

    // Save the changes in the character model
    await this.characterModel.findByIdAndUpdate(character._id, {
      crowns: (character.crowns += battle.result.crownsDrop),
      experience: character.experience,
      level: character.level,
      battleReport: character.battleReport,
    });

    return savedBattleReport;
  }

  async battleCharacter({
    attacker,
    defenderId,
  }: {
    attacker: CharacterInterface;
    defenderId: string;
  }) {
    if (!attacker.onboarded) {
      throw new HttpException('Character not onboarded', 401);
    }

    const journal = attacker.journal;

    const defender =
      await this.characterModel.findById<CharacterInterface>(defenderId);

    if (!defender) {
      throw new HttpException('Defender not found', 404);
    }

    const battle = fight({ attacker, defender });

    // Update journal logs
    journal.arena.battles++;

    if (battle.result.winner === attacker.name) {
      journal.arena.wins++;
    }

    if (battle.result.winner === defender.name) {
      journal.arena.defeats++;
    }

    if (battle.result.winner === 'Draw') {
      journal.arena.draws++;
    }

    await this.journalModel.findByIdAndUpdate(journal._id, journal);

    // Create the battle report and save in the character
    const savedBattleReport = await this.battleModel.create({
      result: battle.result,
      rounds: battle.rounds,
      defender: defender,
      attacker: attacker._id,
    });

    await this.battleModel.findByIdAndDelete(attacker.battleReport);

    attacker.battleReport = savedBattleReport._id;

    // Save the changes in the character model
    await this.characterModel.findByIdAndUpdate(attacker._id, {
      battleReport: attacker.battleReport,
    });

    return savedBattleReport;
  }

  async findEnemies({ character, zoneName }) {
    const zone = zones[zoneName];

    const enemiesInfo = [];

    for (const enemyName in zone) {
      if (zone.hasOwnProperty(enemyName)) {
        const enemy = zone[enemyName];

        const enemyKnowledge =
          character.journal.zones[zoneName][enemyName]?.knowledge || 0;

        const enemyInfo = {
          name: enemy.name,
          image: enemy.image,
          id: enemy.id,
        };

        if (enemyKnowledge > 0) {
          enemyInfo['level'] = enemy.level;
        }

        if (enemyKnowledge > 1) {
          enemyInfo['crowns'] = enemy.crowns;
          enemyInfo['xp'] = enemy.xp;
        }

        if (enemyKnowledge > 2) {
          enemyInfo['strength'] = enemy.strength;
          enemyInfo['endurance'] = enemy.endurance;
          enemyInfo['agility'] = enemy.agility;
          enemyInfo['dexterity'] = enemy.dexterity;
          enemyInfo['intelligence'] = enemy.intelligence;
          enemyInfo['charisma'] = enemy.charisma;
        }

        enemiesInfo.push(enemyInfo);
      }
    }

    return enemiesInfo;
  }

  async findBattleReport(id: string) {
    const battleReport = await this.battleModel
      .findById(id)
      .populate({ path: 'attacker' });

    if (!battleReport) {
      throw new HttpException('Battle Report not found', 404);
    }

    if (battleReport.defender && 'name' in battleReport.defender) {
      return battleReport;
    }

    await battleReport.populate({ path: 'defender' });

    return battleReport;
  }

  async train({
    stat,
    character,
  }: {
    stat: string;
    character: CharacterInterface;
  }) {
    const statsList = [
      'strength',
      'endurance',
      'agility',
      'dexterity',
      'intelligence',
      'charisma',
    ];

    const requiredCrowns = Math.pow(character[stat], 2) + character[stat] + 1;

    if (!statsList.includes(stat)) {
      throw new HttpException('Stat not found', 404);
    }

    if (character.crowns < requiredCrowns) {
      throw new HttpException('Not enough crowns', 400);
    }

    character.crowns -= requiredCrowns;
    character[stat]++;

    try {
      await this.characterModel.findByIdAndUpdate(character._id, character);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }

    return character;
  }
}
