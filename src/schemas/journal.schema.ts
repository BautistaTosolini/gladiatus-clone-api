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
      battles: 0,
      wins: 0,
      defeats: 0,
      draws: 0,
      damageInflicted: 0,
      damageReceived: 0,
      honourEarned: 0,
    },
  })
  arena: {
    battles: number;
    wins: number;
    defeats: number;
    draws: number;
    damageInflicted: number;
    damageReceived: number;
    honourEarned: number;
  };

  @Prop({
    type: Object,
    default: {
      battles: 0,
      wins: 0,
      defeats: 0,
      draws: 0,
      damageInflicted: 0,
      damageReceived: 0,
      crownsEarned: 0,
    },
  })
  world: {
    battles: number;
    wins: number;
    defeats: number;
    draws: number;
    damageInflicted: number;
    damageReceived: number;
    crownsEarned: number;
  };

  @Prop({
    type: Object,
    default: {
      grimwood: {
        rat: {
          knowledge: 0,
          battles: 0,
          wins: 0,
          defeats: 0,
          draws: 0,
        },
        lynx: {
          knowledge: 0,
          battles: 0,
          wins: 0,
          defeats: 0,
          draws: 0,
        },
        wolf: {
          knowledge: 0,
          battles: 0,
          wins: 0,
          defeats: 0,
          draws: 0,
        },
        bear: {
          knowledge: 0,
          battles: 0,
          wins: 0,
          defeats: 0,
          draws: 0,
        },
      },
      bandit: {
        slave: {
          knowledge: 0,
          battles: 0,
          wins: 0,
          defeats: 0,
          draws: 0,
        },
        mercenary: {
          knowledge: 0,
          battles: 0,
          wins: 0,
          defeats: 0,
          draws: 0,
        },
        berserker: {
          knowledge: 0,
          battles: 0,
          wins: 0,
          defeats: 0,
          draws: 0,
        },
        chief: {
          knowledge: 0,
          battles: 0,
          wins: 0,
          defeats: 0,
          draws: 0,
        },
      },
      crypt: {
        draug: {
          knowledge: 0,
          battles: 0,
          wins: 0,
          defeats: 0,
          draws: 0,
        },
        drowned: {
          knowledge: 0,
          battles: 0,
          wins: 0,
          defeats: 0,
          draws: 0,
        },
        ancient: {
          knowledge: 0,
          battles: 0,
          wins: 0,
          defeats: 0,
          draws: 0,
        },
        soulless: {
          knowledge: 0,
          battles: 0,
          wins: 0,
          defeats: 0,
          draws: 0,
        },
      },
    },
  })
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

export const JournalSchema = SchemaFactory.createForClass(Journal);
