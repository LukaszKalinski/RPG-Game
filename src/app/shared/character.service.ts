import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Character } from '../classes/character.model';
import { CharacterSkills } from '../classes/character-skills.model';
import { CharacterInventory } from '../classes/character-inventory.model';
import { CharacterGamePlayInfo } from '../classes/character-gameplay.model';
import { CharacterEquippedInv } from '../classes/character-equipped.model';
import { CurrentDungeonInfo } from '../classes/dungeon-current.model';
import { CurrentDungeonStats } from '../classes/dungeon-stats.model';
import { Equipment } from '../classes/equipment.model';
import { Dungeon } from '../classes/dungeon.model';
import { Creation } from '../classes/creation.model';
import { CurrentCreationInfo } from '../classes/creation-current.model';
import { Creature } from '../classes/creature.model';

import { EquipmentService } from './equipment.service';
import { QuestService } from './quest.service';
import { CreationService } from './creation.service';

@Injectable()
export class CharacterService {
  characterInfoChanged = new Subject<Character>();
  private characterInfo: Character;

  constructor(
    private eqService: EquipmentService,
    private creationService: CreationService,
    private questService: QuestService,
    ) {}

  updateCharacterData(charData: Character) {
    this.characterInfo = charData;
    this.characterInfoChanged.next(this.characterInfo);
  }

  getCharacterInfo() {
    return this.characterInfo;
  }

  setCharEquipped(charEquipped: CharacterEquippedInv) {
    this.characterInfo.equipped = charEquipped;
    this.deleteStartingItemsFromInventory();
    this.characterInfo.gamePlayInfo.currHealth =
      Math.min(this.characterInfo.gamePlayInfo.currHealth, this.characterInfo.attributes.hp + this.characterInfo.gamePlayInfo.extraHP);
    this.characterInfoChanged.next(this.characterInfo);
  }

  getCharEquipped() {
    return this.characterInfo.equipped;
  }

  setCharInventory(charInventory: CharacterInventory) {
    this.characterInfo.inventory = charInventory;
    this.stackItemInInvetory(this.characterInfo.inventory);
    this.characterInfoChanged.next(this.characterInfo);
  }

  setCharDungInventory(charInventory: CharacterInventory) {
    this.characterInfo.currentDungeonInventory = charInventory;
    this.stackItemInDungInvetory(this.characterInfo.currentDungeonInventory);
    this.characterInfoChanged.next(this.characterInfo);
  }

  getCharInventory() {
    return this.characterInfo.inventory;
  }

  getEquipmentStats() {
    return this.eqService.calculateEquipmentStats(this.characterInfo);
  }

  charCreate(charData: Character) {
    if (charData === null) {
      return;
    }
    const fd = charData;
    fd.attributes = new CharacterSkills();
    fd.equipped = this.eqService.createTemplateEquipment().equipped;
    fd.inventory = this.eqService.createTemplateEquipment().inventory;
    fd.gamePlayInfo = new CharacterGamePlayInfo(charData.attributes.hp, charData.attributes.mana, 0, new Date().getTime());
    fd.currentDungeon = new CurrentDungeonInfo(null, null);
    fd.currentCreation = new CurrentCreationInfo(null, null, null, null);
    fd.currentDungeonStats = new CurrentDungeonStats(null, null, null, null, null);
    fd.currentDungeonInventory = this.eqService.createTemplateEquipment().currentDungeonInventory;
    fd.creationStatus = this.creationService.getAllCreationStatusList();
    fd.questsInfo = this.questService.createQuestsStatusList();
    this.updateCharacterData(fd);
    return fd;
  }

  charRaiseLevel(charData: Character) {
    if (charData === null) {
      return;
    }
    const newCharData = charData;
    let i = null;
    const prof = ['knight', 'archer', 'wizard'];
    const health = profDescription[0];
    const mana = profDescription[1];
    const capacity = profDescription[2];
    const speed = 10;
    const strength = profDescription[4];
    const accuracy = profDescription[5];
    const magic = profDescription[6];
    if (charData.generalInfo.profession === 'knight') {
      i = 0;
    } else if (charData.generalInfo.profession === 'archer') {
      i = 1;
    } else if (charData.generalInfo.profession === 'wizard') {
      i = 2;
    }
    charData.attributes.hp += health[i];
    charData.attributes.mana += mana[i];
    charData.attributes.capacity += capacity[i];
    charData.attributes.speed += speed;
    charData.attributes.strength += strength[i];
    charData.attributes.accuracy += accuracy[i];
    charData.attributes.magic += magic[i];
    charData.attributes.level += 1;
    return newCharData;
  }

  getProfTable() {
    return profDescription;
  }

  getLevel(points: number) {
    let level = 1;
    for (let i = 1; i < 1000; i ++) {
      if (points > this.getHowManyTotalPointsOnNextLevel(i)) {
        level += 1;
      } else {
        return level;
      }
    }
    return level;
  }

  getSkillLevel(points: number) {
    let level = 1;
    for (let i = 1; i < 1000; i ++) {
      if (points > this.getHowManyTotalPointsOnNextLevel(i)) {
        level += 1;
      } else {
        return level;
      }
    }
    return level;
  }

  getPercToNextLevel(points: number) {
    const up = Math.max(points - this.getHowManyTotalPointsOnLevel(this.getSkillLevel(points)), 0);
    const down = this.getHowManyPointsToNextLevel(this.getSkillLevel(points));
    const perc = up / down * 100;
    return perc;
  }

  getHowManyTotalPointsOnLevel(lev: number) {
    const x = (100 * Math.pow(1.15, lev - 1));
    return x;
  }

  getHowManyTotalPointsOnNextLevel(lev: number) {
    const x = (this.getHowManyTotalPointsOnLevel(lev + 1));
    return x;
  }

  getHowManyPointsToNextLevel(lev: number) {
    const x = (this.getHowManyTotalPointsOnNextLevel(lev) - this.getHowManyTotalPointsOnLevel(lev));
    return x;
  }

  checkLevel(charData: Character) {
    const currLevel = charData.attributes.level;
    const shouldLevel = this.getLevel(charData.attributes.exp);
    if (currLevel === shouldLevel) {} else {
      for (let i = 0; i < (shouldLevel - currLevel); i++) {
        this.charRaiseLevel(charData);
      }
    }
    this.updateCharacterData(charData);
  }

  sendItemTodungeonInventory(item: Equipment) {
    if (this.characterInfo.currentDungeonInventory) {
      if (item.stackable) {
        this.stackItemInDungeonInventory(item);
      } else {
        this.characterInfo.currentDungeonInventory.eq.push(item);
      }
    } else {
      const dungeonInventory: CharacterInventory = {eq: null};
      dungeonInventory.eq = [item];
      this.characterInfo.currentDungeonInventory = dungeonInventory;
    }
  }

  stackItemInDungeonInventory(item: Equipment) {
    let lootAdded = false;
    this.characterInfo.currentDungeonInventory.eq.forEach((data) => {
      if (data.name === item.name) {
        data.amount += item.amount;
        lootAdded = true;
      }
    });
    if (!lootAdded) {
      this.characterInfo.currentDungeonInventory.eq.push(item);
    }
  }

  stackItemInInvetory(charInventory: CharacterInventory) {
    const inventory: CharacterInventory = charInventory;
    inventory.eq.forEach((data, dindex) => {
      inventory.eq.forEach((reducing, rindex) => {
        if (data.name === reducing.name && reducing.stackable && rindex !== dindex) {
          data.amount += reducing.amount;
          data.weight = data.amount * this.eqService.getEquipment(data.name).weight;
          inventory.eq.splice(rindex, 1);
        }
      });
    });
    this.characterInfo.inventory = inventory;
  }

  stackItemInDungInvetory(charInventory: CharacterInventory) {
    const inventory: CharacterInventory = charInventory;
    inventory.eq.forEach((data, dindex) => {
      inventory.eq.forEach((reducing, rindex) => {
        if (data.name === reducing.name && reducing.stackable && rindex !== dindex) {
          data.amount += reducing.amount;
          data.weight = data.amount * this.eqService.getEquipment(data.name).weight;
          inventory.eq.splice(rindex, 1);
        }
      });
    });
    this.characterInfo.currentDungeonInventory = inventory;
  }

  setCharacterDungeonInfo(loadedDungeon: Dungeon) {
    const c = this.characterInfo.currentDungeonStats;
    if (this.characterInfo.currentDungeon.location) {} else {
      this.characterInfo.currentDungeon.location = loadedDungeon.name;
      this.characterInfo.currentDungeon.returnsTime = new Date().getTime() + loadedDungeon.travelingTime;
      c.charStats = JSON.parse(JSON.stringify(this.characterInfo.attributes));
      c.eqStats = JSON.parse(JSON.stringify(this.characterInfo.gamePlayInfo));
      c.equipment = JSON.parse(JSON.stringify(this.characterInfo.equipped));
      c.inventory = JSON.parse(JSON.stringify(this.characterInfo.inventory));
      c.charStats.hp = this.characterInfo.gamePlayInfo.currHealth;
      c.charStats.mana = this.characterInfo.gamePlayInfo.currMana;
    }
    setTimeout(() => {
      this.characterInfo.currentDungeon.location = null;
      this.characterInfo.currentDungeon.returnsTime = null;
    }, loadedDungeon.travelingTime + 100);
  }

  setCharacterCollectionInfo(collection: Creation, amount: number) {
    const c = this.characterInfo.currentCreation;
    const time = collection.baseTime * amount * 1000;
    if (c.element) {} else {
      c.element = collection.name;
      c.returnsTime = new Date().getTime() + time;
      c.item = collection.product;
      c.amount = amount;
      if (collection.type === 'Carpentry' || collection.type === 'Blacksmithing' ||
        collection.type === 'Alchemy' || collection.type === 'Rune Crafting') {
          const needs = collection.needs;
          if (needs) {
            needs.forEach(data => {
              if (data && data.name !== '') {
                const deletingAmount = amount * data.amount;
                const item = this.eqService.getEquipment(data.name);
                this.deleteSingleItemFromInventory(item, deletingAmount);
              }
            });
          }
        }
    }
  }

  clearDungInventoryOnLoose() {
    this.characterInfo.currentDungeonInventory = this.eqService.createTemplateEquipment().currentDungeonInventory;
  }

  useSingleItem(itemName: string, isDungInv: boolean) {
    let tempAmount = 0;
    const playerMaxHp = this.characterInfo.gamePlayInfo.extraHP + this.characterInfo.attributes.hp;
    let charHp = this.characterInfo.gamePlayInfo.currHealth;
    let hp = 0;
    let mana = 0;
    const playerMaxMana = this.characterInfo.gamePlayInfo.extraMana + this.characterInfo.attributes.mana;
    let charMana = this.characterInfo.gamePlayInfo.currMana;

    const inventory = isDungInv ? this.characterInfo.currentDungeonInventory.eq : this.characterInfo.inventory.eq;
    inventory.forEach((record, index) => {
      if (itemName === record.name) {
        if (record.amount > 1 && record.type !== 'Event') {
          record.amount -= 1;
          record.weight = record.amount * this.eqService.getEquipment(record.name).weight;
        } else {
          tempAmount = record.amount;
          inventory.splice(index, 1);
        }
      }
    });
    switch (itemName) {
      case 'HP Potion':
      case 'HP Medium Potion':
      case 'HP Large Potion':
        if (itemName === 'HP Potion') {
          hp = 50;
        } else if (itemName === 'HP Medium Potion') {
          hp = 100;
        } else if (itemName === 'HP Large Potion') {
          hp = 250;
        }
        charHp = charHp + hp > playerMaxHp ? playerMaxHp : charHp + hp;
        this.characterInfo.gamePlayInfo.currHealth = charHp;
        this.updateCharacterData(this.characterInfo);
        break;
      case 'Mana Potion':
        if (itemName === 'Mana Potion') {
          mana = 50;
        }
        charMana = charMana + mana > playerMaxMana ? playerMaxMana : charMana + mana;
        this.characterInfo.gamePlayInfo.currMana = charMana;
        this.updateCharacterData(this.characterInfo);
        break;
      case 'Experience':
        this.characterInfo.attributes.exp += tempAmount;
        this.updateCharacterData(this.characterInfo);
        break;
      default:
        break;
    }
  }

  deleteStartingItemsFromInventory() {
    this.characterInfo.inventory.eq.forEach((data, index) => {
      if (data.name.includes('Starting')) {
        this.characterInfo.inventory.eq.splice(index, 1);
      }
    });
  }

  deleteSingleItemFromInventory(item: Equipment, amount: number) {
    let action = 0;
    this.characterInfo.inventory.eq.forEach((data, index) => {
      if (data.name === item.name && action === 0) {
        if (data.amount > amount) {
          data.amount -= amount;
          action += 1;
        } else {
          this.characterInfo.inventory.eq.splice(index, 1);
          action += 1;
        }
        this.updateCharacterData(this.characterInfo);
        return;
      }
    });
  }

  buyEquipment(item: Equipment) {
    let singleItem: Equipment = null;
    singleItem = item;
    this.setCharacterBalance(true, singleItem.buyValue);
    this.characterInfo.inventory.eq.push(item);
    this.stackItemInInvetory(this.characterInfo.inventory);
    this.updateCharacterData(this.characterInfo);
  }

  sellEquipment(item: Equipment, amount: number) {
    const singleItem = item;
    this.setCharacterBalance(false, singleItem.sellValue * amount);
    this.deleteSingleItemFromInventory(item, amount);
  }

  getCharacterBalance() {
    let balance = 0;
    this.characterInfo.inventory.eq.forEach((data) => {
      if (data.name === 'Gold Coin') {
        balance = data.amount;
      }
    });
    return balance;
  }

  setCharacterBalance(isBuying: boolean, amount: number) {
    if (isBuying) {
      this.characterInfo.inventory.eq.forEach((data) => {
        if (data.name === 'Gold Coin') {
          data.amount -= amount;
        }
      });
    } else {
      this.characterInfo.inventory.eq.forEach((data) => {
        if (data.name === 'Gold Coin') {
          data.amount += amount;
        }
      });
    }
    this.updateCharacterData(this.characterInfo);
  }

  regeneratingHPandMana() {
  }

  addCreatedProduct(collection: Creation, amount: number) {
    const c = this.characterInfo.currentCreation;
    const item = this.eqService.getEquipment(collection.product);
    if (item) {
      if (item.stackable) {
        item.amount = amount;
        this.characterInfo.inventory.eq.push(item);
      } else {
        for (let i = 0; i < amount; i++) {
          this.characterInfo.inventory.eq.push(item);
        }
      }
    }
    this.stackItemInInvetory(this.characterInfo.inventory);
    c.element = null;
    c.item = null;
    c.amount = null;
    c.returnsTime = null;
    this.updateCharacterData(this.characterInfo);
  }

  addEquipmentToInv(eq: Equipment) {
    if (eq) {
      if (eq.stackable) {
        this.characterInfo.inventory.eq.push(eq);
      } else {
        for (let i = 0; i < eq.amount; i++) {
          this.characterInfo.inventory.eq.push(eq);
        }
      }
    }
    this.stackItemInInvetory(this.characterInfo.inventory);
    this.updateCharacterData(this.characterInfo);
  }

  updateCreationSkills(collection: Creation, amount: number) {
    const a = this.characterInfo.attributes;
    const exp = collection.exp * amount;
    switch (collection.type) {
      case 'Woodcutting':
        a.woodcuttingXP += exp;
        break;
      case 'Mining':
        a.miningXP += exp;
        break;
      case 'Herbology':
        a.herbologyXP += exp;
        break;
      case 'Sorcery':
        a.sorceryXP += exp;
        break;
      case 'Carpentry':
        a.carpentryXP += exp;
        break;
      case 'Blacksmithing':
        a.blacksmithingXP += exp;
        break;
      case 'Alchemy':
        a.alchemyXP += exp;
        break;
      case 'Rune Crafting':
        a.runeXP += exp;
        break;
      default:
        break;
    }
    this.updateCharacterData(this.characterInfo);
  }

  updateCharacterQuestsStatusOnLoad() {
    const currQuestsStatus = this.characterInfo.questsInfo ? this.characterInfo.questsInfo : [];
    const newQuestsStatus = this.questService.createQuestsStatusList();
    newQuestsStatus.forEach(data => {
      let push = true;
      data.toDoCurrent.forEach(rec => {
        rec.amount = 0;
      });
      if (data) {
        if (currQuestsStatus) {
          currQuestsStatus.forEach(data2 => {
            if (data2) {
              if (data.questName === data2.questName) {
                push = false;
              }
            }
          });
        }
        if (push) {
          currQuestsStatus.push(data);
        }
      }
    });
    this.characterInfo.questsInfo = currQuestsStatus;
    this.verifyQuestsStatus();
    this.updateCharacterData(this.characterInfo);
  }

  updateCharacterCreationStatusOnLoad() {
    const currCreationStatus = this.characterInfo.creationStatus ? this.characterInfo.creationStatus : [];
    const newCreationStatus = this.creationService.getAllCreationStatusList();
    newCreationStatus.forEach(data => {
      let push = true;
      if (data) {
        if (currCreationStatus) {
          currCreationStatus.forEach(data2 => {
            if (data2) {
              if (data.name === data2.name) {
                push = false;
              }
            }
          });
        }
        if (push) {
          currCreationStatus.push(data);
        }
      }
    });
    this.characterInfo.creationStatus = currCreationStatus;
    this.verifyCollectionStatus();
    this.updateCharacterData(this.characterInfo);
  }

  verifyQuestsStatus() {
    const charLev = this.characterInfo.attributes.level;
    this.characterInfo.questsInfo.forEach(data => {
      const quest = this.questService.getQuest(data.questName);
      if (quest.reqLevel) {
        data.isUnlocked = charLev >= quest.reqLevel ? true : false;
      }
    });
  }

  verifyCollectionStatus() {
    const a = this.characterInfo.attributes;
    const woodcuttingLvl = this.getSkillLevel(a.woodcuttingXP);
    const miningLvl = this.getSkillLevel(a.miningXP);
    const herbologyLvl = this.getSkillLevel(a.herbologyXP);
    const sorceryLvl = this.getSkillLevel(a.sorceryXP);
    const carpentryLvl = this.getSkillLevel(a.carpentryXP);
    const blacksmithingLvl = this.getSkillLevel(a.blacksmithingXP);
    const alchemyLvl = this.getSkillLevel(a.alchemyXP);
    const runeCraftingLvl = this.getSkillLevel(a.runeXP);
    this.characterInfo.creationStatus.forEach(data => {
      const creation = this.creationService.getDirectCreation(data.creationName);
      switch (creation.type) {
        case 'Woodcutting':
          data.isUnlocked = creation.reqLv > woodcuttingLvl ? false : true;
          break;
        case 'Mining':
          data.isUnlocked = creation.reqLv > miningLvl ? false : true;
          break;
        case 'Herbology':
          data.isUnlocked = creation.reqLv > herbologyLvl ? false : true;
          break;
        case 'Sorcery':
          data.isUnlocked = creation.reqLv > sorceryLvl ? false : true;
          break;
        case 'Carpentry':
          data.isUnlocked = creation.reqLv > carpentryLvl ? false : true;
          break;
        case 'Blacksmithing':
          data.isUnlocked = creation.reqLv > blacksmithingLvl ? false : true;
          break;
        case 'Alchemy':
          data.isUnlocked = creation.reqLv > alchemyLvl ? false : true;
          break;
        case 'Rune Crafting':
          data.isUnlocked = creation.reqLv > runeCraftingLvl ? false : true;
          break;
        default:
          break;
      }
    });
  }

  getAmountOfItemInInventory(name: string) {
    let x = 0;
    this.characterInfo.inventory.eq.forEach(data => {
      if (data.name === name) {
        x = data.amount;
        return x;
      }
    });
    return x;
  }

  updateQuestLog(creature: Creature) {
    let updatedRecord = false;
    this.characterInfo.questsInfo.forEach((quest) => {
      if (quest.isOpened) {
        quest.toDoCurrent.forEach((rec, index) => {
          const maxAmount = this.questService.getQuest(quest.questName).toDo[index].amount;
          if (rec.name === creature.name && rec.amount < maxAmount && updatedRecord === false) {
            updatedRecord = true;
            rec.amount += 1;
            this.updateCharacterData(this.characterInfo);
            return;
          }
        });
      }
    });
    this.updateCharacterData(this.characterInfo);
  }

  displayValue(value: number) {
    const valueStr = value.toString();
    let result = valueStr;
    const valueStrL = valueStr.length;
    const times = Math.min(Math.floor(valueStrL / 3), 3);
    const sufix = ['', 'k', 'M', 'B'];
    let x1;
    let x2;
    if (valueStrL > 3) {
      x1 = valueStr.substring(0, valueStrL - 3 * times) || '0';
      x2 = valueStr.substring(valueStrL - 3 * times, 3) || '0';
      result = x1 + ',' + x2 + ' ' + sufix[times];
    }
    return result;
  }
}


const profDescription = [
  // ['knight', 'archer', 'wizard']
  [15, 10, 5], // health
  [5, 10, 15], // mana
  [25, 15, 5], // capacity
  10, // speed
  [5, 1, 3], // strength
  [3, 5, 1], // accuracy
  [1, 3, 5], // magic
  ['Sword, Axe, Hammer', 'Bow, Crossbow', 'Wand, Rod'] // weapons
];
