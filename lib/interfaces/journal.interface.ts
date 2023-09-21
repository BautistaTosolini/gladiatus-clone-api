import { CharacterInterface } from './character.interface';

export interface JournalInterface {
  _id: string;
  character: CharacterInterface;
  arena: {
    battles: number;
    wins: number;
    defeats: number;
    draws: number;
    damageInflicted: number;
    damageReceived: number;
    honorEarned: number;
  };
  world: {
    battles: number;
    wins: number;
    defeats: number;
    draws: number;
    damageInflicted: number;
    damageReceived: number;
    crownsEarned: number;
  };
  zones: {
    grimwood: {
      rat: {
        knowledge: number;
        battles: number;
        wins: number;
        defeats: number;
        draws: number;
      };
      lynx: {
        knowledge: number;
        battles: number;
        wins: number;
        defeats: number;
        draws: number;
      };
      wolf: {
        knowledge: number;
        battles: number;
        wins: number;
        defeats: number;
        draws: number;
      };
      bear: {
        knowledge: number;
        battles: number;
        wins: number;
        defeats: number;
        draws: number;
      };
    };
    bandit: {
      slave: {
        knowledge: number;
        battles: number;
        wins: number;
        defeats: number;
        draws: number;
      };
      mercenary: {
        knowledge: number;
        battles: number;
        wins: number;
        defeats: number;
        draws: number;
      };
      berserker: {
        knowledge: number;
        battles: number;
        wins: number;
        defeats: number;
        draws: number;
      };
      chief: {
        knowledge: number;
        battles: number;
        wins: number;
        defeats: number;
        draws: number;
      };
    };
    crypt: {
      draug: {
        knowledge: number;
        battles: number;
        wins: number;
        defeats: number;
        draws: number;
      };
      drowned: {
        knowledge: number;
        battles: number;
        wins: number;
        defeats: number;
        draws: number;
      };
      ancient: {
        knowledge: number;
        battles: number;
        wins: number;
        defeats: number;
        draws: number;
      };
      soulles: {
        knowledge: number;
        battles: number;
        wins: number;
        defeats: number;
        draws: number;
      };
    };
  };
}
