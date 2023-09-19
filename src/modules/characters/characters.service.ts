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
import { battleZone } from 'lib/utils/battleUtils';
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

    const { battleResults, pickedEnemy } = battleZone({ character, enemy });

    if (battleResults.result.winner === character.name) {
      journal.zones[zone][enemyName].wins++;
    } else {
      journal.zones[zone][enemyName].losses++;
    }

    if (journal.zones[zone][enemyName].knowledge < 2 && randomBoolean(30)) {
      journal.zones[zone][enemyName].knowledge++;
    }

    await this.journalModel.findByIdAndUpdate(journal._id, journal);

    const savedBattleReport = await this.battleModel.create({
      result: battleResults.result,
      rounds: battleResults.rounds,
      zone,
      enemy: pickedEnemy,
      fighter: character._id,
    });

    await this.battleModel.findByIdAndDelete(character.battleReport);

    character.battleReport = savedBattleReport._id;

    if (
      character.experience + battleResults.result.xpDrop >=
      calculateExperience(character.level)
    ) {
      character.experience =
        character.experience +
        battleResults.result.xpDrop -
        calculateExperience(character.level);
      character.level++;
    } else {
      character.experience += battleResults.result.xpDrop;
    }

    await this.characterModel.findByIdAndUpdate(character._id, {
      crowns: (character.crowns += battleResults.result.crownsDrop),
      experience: character.experience,
      level: character.level,
      battleReport: character.battleReport,
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

        if (enemyKnowledge >= 0) {
          enemyInfo['level'] = enemy.level;
        }

        if (enemyKnowledge >= 1) {
          enemyInfo['crowns'] = enemy.crowns;
          enemyInfo['xp'] = enemy.xp;
        }

        if (enemyKnowledge >= 2) {
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
      .populate({ path: 'fighter' });

    if (!battleReport) {
      throw new HttpException('Battle Report not found', 404);
    }

    return battleReport;
  }
}
