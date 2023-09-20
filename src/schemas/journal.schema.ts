import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Journal {
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Character',
  })
  character: string;

  @Prop({
    type: Object,
    default: {
      grimwood: {
        rat: {
          knowledge: 0,
          timesFought: 0,
          wins: 0,
          losses: 0,
        },
        lynx: {
          knowledge: 0,
          timesFought: 0,
          wins: 0,
          losses: 0,
        },
        wolf: {
          knowledge: 0,
          timesFought: 0,
          wins: 0,
          losses: 0,
        },
        bear: {
          knowledge: 0,
          timesFought: 0,
          wins: 0,
          losses: 0,
        },
      },
      bandit: {
        slave: {
          knowledge: 0,
          timesFought: 0,
          wins: 0,
          losses: 0,
        },
        mercenary: {
          knowledge: 0,
          timesFought: 0,
          wins: 0,
          losses: 0,
        },
        berserker: {
          knowledge: 0,
          timesFought: 0,
          wins: 0,
          losses: 0,
        },
        chief: {
          knowledge: 0,
          timesFought: 0,
          wins: 0,
          losses: 0,
        },
      },
    },
  })
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
    bandit: {
      slave: {
        knowledge: number;
        timesFought: number;
        wins: number;
        losses: number;
      };
      mercenary: {
        knowledge: number;
        timesFought: number;
        wins: number;
        losses: number;
      };
      berserker: {
        knowledge: number;
        timesFought: number;
        wins: number;
        losses: number;
      };
      chief: {
        knowledge: number;
        timesFought: number;
        wins: number;
        losses: number;
      };
    };
  };
}

export const JournalSchema = SchemaFactory.createForClass(Journal);
