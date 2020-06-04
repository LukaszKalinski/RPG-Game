import { Injectable } from '@angular/core';
import { Equipment } from '../classes/equipment.model';
import { Character } from '../classes/character.model';
import { CharacterEquippedInv } from '../classes/character-equipped.model';
import { CharacterInventory } from '../classes/character-inventory.model';

const eq = new Map<string, Equipment>();

@Injectable()
export class EquipmentService {

  constructor() {}

  setEqFromServer(newEq: Equipment[]) {
    newEq.forEach(data => {
      eq.set(data.name, data);
    });
  }

  createTemplateEquipment() {
      const partialCharData = new Character(null, null, null, null, null);
      const leftHandSlot: Equipment = this.getEquipment('Starting Sword');
      const rightHandSlot: Equipment = this.getEquipment('Starting Shield');
      const armorSlot: Equipment = this.getEquipment('Starting Armor');
      const helmetSlot: Equipment = this.getEquipment('Starting Helmet');
      const bootsSlot: Equipment = this.getEquipment('Starting Boots');
      const beltSlot: Equipment = this.getEquipment('Starting Belt');
      const necklaceSlot: Equipment = this.getEquipment('Starting Necklace');
      const ringSlot: Equipment = this.getEquipment('Starting Ring');
      const glovesSlot: Equipment = this.getEquipment('Starting Gloves');
      const legsSlot: Equipment = this.getEquipment('Starting Legs');
      const padsSlot: Equipment = this.getEquipment('Starting Pads');
      const horseSlot: Equipment = this.getEquipment('Starting Horse');
      const potionSlot: Equipment = this.getEquipment('Starting Potion');

      const firstSword: Equipment = this.getEquipment('Knife');
      const firstShield: Equipment = this.getEquipment('Wooden Shield');
      const firstGold: Equipment = this.getEquipment('Gold Coin');
      const firstHPPotion: Equipment = this.getEquipment('HP Potion');
      const firstManaPotion: Equipment = this.getEquipment('Mana Potion');
      const firstRune: Equipment = this.getEquipment('Fire Rune');
      const firstWand: Equipment = this.getEquipment('Wand');
      const firstSpear: Equipment = this.getEquipment('Spear');

      partialCharData.equipped = new CharacterEquippedInv(leftHandSlot, rightHandSlot, armorSlot, helmetSlot,
        bootsSlot, beltSlot, necklaceSlot, ringSlot, ringSlot, ringSlot, ringSlot, glovesSlot, legsSlot,
        padsSlot, horseSlot, potionSlot, null, null, null);
      partialCharData.inventory = new CharacterInventory([firstGold, firstSword, firstSpear, firstWand,
        firstShield, firstHPPotion, firstManaPotion, firstRune]);
      partialCharData.currentDungeonInventory = new CharacterInventory([potionSlot]);

      return partialCharData;
    }

  getAllEquipment() {
    const allEq: Equipment[] = [];
    eq.forEach((data) => {
      allEq.push(data);
    });
    return allEq;
  }

  getAllEquipmentToShop() {
    const allEq: Equipment[] = [];
    eq.forEach((data) => {
      if (!data.name.includes('Starting') && data.name !== 'Gold Coin' && data.buyValue !== 0) {
        allEq.push(data);
      }
    });
    return allEq;
  }

  getEquipment(name: string) {
    const eqItem: Equipment = Object.assign({}, eq.get(name));
    const item = eqItem;
    return item;
  }

  calculateEquipmentStats(charData: Character) {
    const currCharacter = charData;
    const newCharacterData: Character = currCharacter;
    const ncd = newCharacterData.gamePlayInfo;

    const leftHandSlot = charData.equipped.leftHandSlot;
    const rightHandSlot = charData.equipped.rightHandSlot;
    const armorSlot = charData.equipped.armorSlot;
    const helmetSlot = charData.equipped.helmetSlot;
    const bootsSlot = charData.equipped.bootsSlot;
    const beltSlot = charData.equipped.beltSlot;
    const necklaceSlot = charData.equipped.necklaceSlot;
    const ringSlotOne = charData.equipped.ringSlotOne;
    const ringSlotTwo = charData.equipped.ringSlotTwo;
    const ringSlotThree = charData.equipped.ringSlotThree;
    const ringSlotFour = charData.equipped.ringSlotFour;
    const glovesSlot = charData.equipped.glovesSlot;
    const legsSlot = charData.equipped.legsSlot;
    const padsSlot = charData.equipped.padsSlot;
    const horseSlot = charData.equipped.horseSlot;

    ncd.currCap = this.calculateTravellingBackpackWeight(charData);
    ncd.eqDefence = 0;
    ncd.eqMagicAttack = 0;
    ncd.eqMeleeAttack = 0;
    ncd.eqRangeAttack = 0;
    ncd.eqShielding = 0;
    ncd.eqSpeed = 0;
    ncd.extraHP = 0;
    ncd.extraMana = 0;
    ncd.extraStrength = 0;
    ncd.extraAccuracy = 0;
    ncd.extraMagic = 0;
    ncd.extraSwordSkill = 0;
    ncd.extraAxeSkill = 0;
    ncd.extraHammerSkill = 0;
    ncd.extraShieldingSkill = 0;
    ncd.extraBowSkill = 0;
    ncd.extraCrossbowSkill = 0;
    ncd.extraWandSkill = 0;
    ncd.extraRodSkill = 0;
    ncd.extraWoodcuttingSkill = 0;
    ncd.extraCarpentrySkill = 0;
    ncd.extraMiningSkill = 0;
    ncd.extraBlackSmithingSkill = 0;
    ncd.extraHerbologySkill = 0;
    ncd.extraAlchemySkill = 0;
    ncd.extraSorcerySkill = 0;
    ncd.extraRuneCraftingSkill = 0;

    const arr: Array<Equipment> = [
      leftHandSlot, rightHandSlot, armorSlot, helmetSlot, bootsSlot, beltSlot, necklaceSlot, ringSlotOne, ringSlotTwo, ringSlotThree,
      ringSlotFour, glovesSlot, legsSlot, padsSlot, horseSlot,
    ];
    arr.forEach((item) => {
      if (item) {
        if (item.name) {
          ncd.currCap += item.weight;
          ncd.eqDefence += item.defence;
          ncd.eqMagicAttack += item.magic;
          ncd.eqMeleeAttack += item.meleeAttack;
          ncd.eqRangeAttack += item.rangeAttack;
          ncd.eqShielding += item.shielding;
          ncd.eqSpeed += item.speed;
          ncd.extraHP += item.extraHP;
          ncd.extraMana += item.extraMana;
          ncd.extraStrength += item.extraStrength;
          ncd.extraAccuracy += item.extraAccuracy;
          ncd.extraMagic += item.extraMagic;
          ncd.extraSwordSkill += item.extraSwordSkill;
          ncd.extraAxeSkill += item.extraAxeSkill;
          ncd.extraHammerSkill += item.extraHammerSkill;
          ncd.extraShieldingSkill += item.extraShieldingSkill;
          ncd.extraBowSkill += item.extraBowSkill;
          ncd.extraCrossbowSkill += item.extraCrossbowSkill;
          ncd.extraWandSkill += item.extraWandSkill;
          ncd.extraRodSkill += item.extraRodSkill;
          ncd.extraWoodcuttingSkill += item.extraWoodcuttingSkill;
          ncd.extraCarpentrySkill += item.extraCarpentrySkill;
          ncd.extraMiningSkill += item.extraMiningSkill;
          ncd.extraBlackSmithingSkill += item.extraBlackSmithingSkill;
          ncd.extraHerbologySkill += item.extraHerbologySkill;
          ncd.extraAlchemySkill += item.extraAlchemySkill;
          ncd.extraSorcerySkill += item.extraSorcerySkill;
          ncd.extraRuneCraftingSkill += item.extraRuneCraftingSkill;
        } else {
          ncd.currCap += item[0].weight;
          ncd.eqDefence += item[0].defence;
          ncd.eqMagicAttack += item[0].magic;
          ncd.eqMeleeAttack += item[0].meleeAttack;
          ncd.eqRangeAttack += item[0].rangeAttack;
          ncd.eqShielding += item[0].shielding;
          ncd.eqSpeed += item[0].speed;
          ncd.extraHP += item[0].extraHP;
          ncd.extraMana += item[0].extraMana;
          ncd.extraStrength += item[0].extraStrength;
          ncd.extraAccuracy += item[0].extraAccuracy;
          ncd.extraMagic += item[0].extraMagic;
          ncd.extraSwordSkill += item[0].extraSwordSkill;
          ncd.extraAxeSkill += item[0].extraAxeSkill;
          ncd.extraHammerSkill += item[0].extraHammerSkill;
          ncd.extraShieldingSkill += item[0].extraShieldingSkill;
          ncd.extraBowSkill += item[0].extraBowSkill;
          ncd.extraCrossbowSkill += item[0].extraCrossbowSkill;
          ncd.extraWandSkill += item[0].extraWandSkill;
          ncd.extraRodSkill += item[0].extraRodSkill;
          ncd.extraWoodcuttingSkill += item[0].extraWoodcuttingSkill;
          ncd.extraCarpentrySkill += item[0].extraCarpentrySkill;
          ncd.extraMiningSkill += item[0].extraMiningSkill;
          ncd.extraBlackSmithingSkill += item[0].extraBlackSmithingSkill;
          ncd.extraHerbologySkill += item[0].extraHerbologySkill;
          ncd.extraAlchemySkill += item[0].extraAlchemySkill;
          ncd.extraSorcerySkill += item[0].extraSorcerySkill;
          ncd.extraRuneCraftingSkill += item[0].extraRuneCraftingSkill;
        }
      }
    });
    return newCharacterData;
  }

  calculateTravellingBackpackWeight(charData: Character) {
    const travBp = charData.currentDungeonInventory.eq;
    let weight = 0;
    travBp.forEach(data => {
      weight += data.weight;
    });
    return weight;
  }

  convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, initialValue);
  }
}
