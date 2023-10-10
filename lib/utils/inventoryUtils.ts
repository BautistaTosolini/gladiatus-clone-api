export function insertInventoryId(inventory, itemId) {
  for (let i = 0; i < inventory.length; i++) {
    for (let j = 0; j < inventory[i].length; j++) {
      if (inventory[i][j] === null) {
        inventory[i][j] = itemId;
        return inventory;
      }
    }
  }
  throw new Error('Not enough space');
}

export function emptySlotExists(inventory) {
  for (let i = 0; i < inventory.length; i++) {
    for (let j = 0; j < inventory[i].length; j++) {
      if (inventory[i][j] === null) {
        return true;
      }
    }
  }

  return false;
}
