import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CharacterInterface } from 'lib/interfaces/character.interface';
import { ItemInterface } from 'lib/interfaces/item.interface';
import { insertInventoryId } from 'lib/utils/inventoryUtils';
import { Model } from 'mongoose';
import { Item } from 'src/schemas/item.schema';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}

  async create({
    character,
    item,
  }: {
    character: CharacterInterface;
    item: ItemInterface;
  }) {
    const createdItem = await this.itemModel.create({
      owner: character._id,
      ...item,
    });

    if (!createdItem) {
      throw new HttpException('Something went wrong', 500);
    }

    return createdItem;
  }

  async populateItems({
    character,
    inventoryHeader,
  }: {
    character: CharacterInterface;
    inventoryHeader: boolean;
  }) {
    const { offHand, mainHand, legs, chest, head } = character;
    const itemIdsToPopulate = [offHand, mainHand, legs, chest, head].filter(
      Boolean,
    );

    const items = await this.itemModel.find<ItemInterface>({
      _id: { $in: itemIdsToPopulate },
    });

    character.offHand = items.find((item) => item._id.toString() === offHand);
    character.mainHand = items.find((item) => item._id.toString() === mainHand);
    character.legs = items.find((item) => item._id.toString() === legs);
    character.chest = items.find((item) => item._id.toString() === chest);
    character.head = items.find((item) => item._id.toString() === head);

    if (inventoryHeader) {
      const promises = [];

      for (let i = 0; i < character.inventory.length; i++) {
        for (let j = 0; j < character.inventory[i].length; j++) {
          if (character.inventory[i][j] !== null) {
            promises.push(this.itemModel.findById(character.inventory[i][j]));
          }
        }
      }

      const items = await Promise.all(promises);

      let itemIndex = 0;
      for (let i = 0; i < character.inventory.length; i++) {
        for (let j = 0; j < character.inventory[i].length; j++) {
          if (character.inventory[i][j] !== null) {
            character.inventory[i][j] = items[itemIndex++];
          }
        }
      }
    }

    return character;
  }

  async equipItem({
    character,
    item,
  }: {
    character: CharacterInterface;
    item: ItemInterface;
  }) {
    if (!character[item.type]) {
      for (let i = 0; i < character.inventory.length; i++) {
        for (let j = 0; j < character.inventory[i].length; j++) {
          if (character.inventory[i][j] === item._id) {
            character[item.type] = item._id;
            character.inventory[i][j] = null;

            const promises = [];

            for (let i = 0; i < character.inventory.length; i++) {
              for (let j = 0; j < character.inventory[i].length; j++) {
                if (character.inventory[i][j] !== null) {
                  promises.push(
                    this.itemModel.findById(character.inventory[i][j]),
                  );
                }
              }
            }

            const items = await Promise.all(promises);

            let itemIndex = 0;
            for (let i = 0; i < character.inventory.length; i++) {
              for (let j = 0; j < character.inventory[i].length; j++) {
                if (character.inventory[i][j] !== null) {
                  character.inventory[i][j] = items[itemIndex++];
                }
              }
            }

            return character;
          }
        }
      }
    }

    for (let i = 0; i < character.inventory.length; i++) {
      for (let j = 0; j < character.inventory[i].length; j++) {
        if (character.inventory[i][j] === item._id) {
          const equippedItem = character[item.type];
          character[item.type] = item._id;
          character.inventory[i][j] = equippedItem;

          const promises = [];

          for (let i = 0; i < character.inventory.length; i++) {
            for (let j = 0; j < character.inventory[i].length; j++) {
              if (character.inventory[i][j] !== null) {
                promises.push(
                  this.itemModel.findById(character.inventory[i][j]),
                );
              }
            }
          }

          const items = await Promise.all(promises);

          let itemIndex = 0;
          for (let i = 0; i < character.inventory.length; i++) {
            for (let j = 0; j < character.inventory[i].length; j++) {
              if (character.inventory[i][j] !== null) {
                character.inventory[i][j] = items[itemIndex++];
              }
            }
          }

          return character;
        }
      }
    }
  }

  async unequipItem({
    character,
    type,
  }: {
    character: CharacterInterface;
    type: string;
  }) {
    if (!character[type]) {
      throw new HttpException('No longer equipped', 400);
    }

    const updatedInventory = insertInventoryId(
      character.inventory,
      character[type],
    );

    if (updatedInventory) {
      character[type] = null;
      character.inventory = updatedInventory;
    }

    const promises = [];

    for (let i = 0; i < character.inventory.length; i++) {
      for (let j = 0; j < character.inventory[i].length; j++) {
        if (character.inventory[i][j] !== null) {
          promises.push(this.itemModel.findById(character.inventory[i][j]));
        }
      }
    }

    const items = await Promise.all(promises);

    let itemIndex = 0;
    for (let i = 0; i < character.inventory.length; i++) {
      for (let j = 0; j < character.inventory[i].length; j++) {
        if (character.inventory[i][j] !== null) {
          character.inventory[i][j] = items[itemIndex++];
        }
      }
    }

    return character;
  }
}
