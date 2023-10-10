import { CharacterInterface } from 'lib/interfaces/character.interface';
import { Document } from 'mongoose';

export interface UserInterface extends Document {
  _id: string;
  name: string;
  email: string;
  username: string;
  character: CharacterInterface;
}
