import { Types } from 'mongoose';
import { CharacterInterface } from 'src/interfaces/character.interface';

export interface UserInterface {
  _id: string;
  name: string;
  email: string;
  username: string;
  character: CharacterInterface | string | Types.ObjectId;
}
