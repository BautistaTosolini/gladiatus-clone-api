import { CharacterInterface } from './character.interface';

export interface JournalInterface {
  _id: string;
  character: CharacterInterface;
  zones: {
    grimwood: {
      rat: {
        knowledge: number;
        timesFought: number;
        wins: number;
        losses: number;
      };
      lynx: {
        knowledge: number;
        timesFought: number;
        wins: number;
        losses: number;
      };
      wolf: {
        knowledge: number;
        timesFought: number;
        wins: number;
        losses: number;
      };
      bear: {
        knowledge: number;
        timesFought: number;
        wins: number;
        losses: number;
      };
    };
  };
}
