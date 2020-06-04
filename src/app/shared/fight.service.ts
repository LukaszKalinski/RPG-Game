import { Injectable } from '@angular/core';

import { Character } from '../classes/character.model';
import { Creature } from '../classes/creature.model';
import { Spell } from '../classes/spell.model';

import { CharacterService } from './character.service';
import { EquipmentService } from './equipment.service';

const spellArray = new Map<string, Spell>();

@Injectable()
export class FightService {

  constructor(
    private characterService: CharacterService,
    private eqService: EquipmentService,
  ) {}

  onAction(actionName: string, isPlayer: boolean, charData: Character, itemName: string) {
    const newCharData: Character = Object.assign({}, charData);
    const chatMessagesPlayer: string[] = [];
    const chatMessagesEnemy: string[] = [];

    const c = newCharData.currentDungeonStats;
    const a = newCharData.attributes;

    let playerHP = c.charStats.hp;
    const playerMaxHp = c.eqStats.extraHP + a.hp;
    const playerMana = c.charStats.mana;
    const playerMaxMana = c.eqStats.extraMana + a.mana;
    const playerStrength = c.charStats.strength + c.eqStats.extraStrength;
    const playerAccuracy = c.charStats.accuracy + c.eqStats.extraAccuracy;
    const playerMagic = c.charStats.magic + c.eqStats.extraMagic;
    const playerShielding = c.eqStats.eqShielding;
    const playerAttackWeaponType = c.equipment.leftHandSlot.type ? c.equipment.leftHandSlot.type : c.equipment.leftHandSlot[0].type;
    const playerMeleeAttack = c.eqStats.eqMeleeAttack;
    const playerRangeAttack = c.eqStats.eqRangeAttack;
    const playerMageAttack = c.eqStats.eqMagicAttack;
    const isShieldOn = (playerShielding > 0) ? true : false;
    const playerSwordSkill = this.characterService.getSkillLevel(c.charStats.swordXP) + c.eqStats.extraSwordSkill;
    const playerAxeSkill = this.characterService.getSkillLevel(c.charStats.axeXP) + c.eqStats.extraAxeSkill;
    const playerHammerSkill = this.characterService.getSkillLevel(c.charStats.hammerXP) + c.eqStats.extraHammerSkill;
    const playerBowSkill = this.characterService.getSkillLevel(c.charStats.bowXP) + c.eqStats.extraBowSkill;
    const playerCrossbowSkill = this.characterService.getSkillLevel(c.charStats.crossbowXP) + c.eqStats.extraCrossbowSkill;
    const playerWandSkill = this.characterService.getSkillLevel(c.charStats.wandXP) + c.eqStats.extraWandSkill;
    const playerRodSkill = this.characterService.getSkillLevel(c.charStats.rodXP) + c.eqStats.extraRodSkill;
    const playerDefence = c.eqStats.eqDefence;
    const playerShieldingSkill = this.characterService.getSkillLevel(c.charStats.shieldingXP) + c.eqStats.extraShieldingSkill;

    const creatureHP = c.currCreature.hp;
    const creatureMana = c.currCreature.mana;
    const creatureMeleeAttack = c.currCreature.attack;
    const creatureDefence = c.currCreature.defence;

    let damageByPlayer = [0, 0];
    let finalDamageByPlayer = 0;
    let damageBlockedByPlayer = 0;
    let damageByCreature = [0, 0];
    let finalDamageByCreature = 0;
    switch (actionName) {
      case 'Melee':
        const meleeAttackInfo: {mainAttribute: number; skill: number, attack: number} = {mainAttribute: 0, skill: 0, attack: 0};
        switch (playerAttackWeaponType) {
          case 'Sword':
            meleeAttackInfo.attack = playerMeleeAttack;
            meleeAttackInfo.mainAttribute = playerStrength;
            meleeAttackInfo.skill = playerSwordSkill;
            break;
          case 'Axe':
            meleeAttackInfo.attack = playerMeleeAttack;
            meleeAttackInfo.mainAttribute = playerStrength;
            meleeAttackInfo.skill = playerAxeSkill;
            break;
          case 'Hammer':
            meleeAttackInfo.attack = playerMeleeAttack;
            meleeAttackInfo.mainAttribute = playerStrength;
            meleeAttackInfo.skill = playerHammerSkill;
            break;
          case 'Bow':
            meleeAttackInfo.attack = playerRangeAttack;
            meleeAttackInfo.mainAttribute = playerAccuracy;
            meleeAttackInfo.skill = playerBowSkill;
            break;
          case 'Crossbow':
            meleeAttackInfo.attack = playerRangeAttack;
            meleeAttackInfo.mainAttribute = playerAccuracy;
            meleeAttackInfo.skill = playerCrossbowSkill;
            break;
          case 'Wand':
            meleeAttackInfo.attack = playerMeleeAttack;
            meleeAttackInfo.mainAttribute = playerStrength;
            meleeAttackInfo.skill = playerWandSkill;
            break;
          case 'Rod':
            meleeAttackInfo.attack = playerMeleeAttack;
            meleeAttackInfo.mainAttribute = playerStrength;
            meleeAttackInfo.skill = playerRodSkill;
            break;
          default:
            damageByPlayer = [0, 0];
            break;
        }
        damageByPlayer =
          this.onMeleeAttack(meleeAttackInfo.mainAttribute, meleeAttackInfo.attack, meleeAttackInfo.skill, 200,
            creatureDefence, creatureDefence, creatureDefence);
        finalDamageByPlayer = this.maximumDamage(isPlayer, damageByPlayer[0], newCharData);
        chatMessagesPlayer.push('Your enemy has lost ' + finalDamageByPlayer + ' hitpoints.');
        break;
      case 'Rune':
        if (isPlayer) {this.characterService.useSingleItem(itemName, true); }
        const runeDamage = this.onRuneAttack(isPlayer, playerMagic, itemName, creatureDefence);
        finalDamageByPlayer = this.maximumDamage(isPlayer, runeDamage , newCharData);
        chatMessagesPlayer.push('Your enemy has lost ' + finalDamageByPlayer + ' hitpoints.');
        break;
      case 'Mana':
        if (isPlayer) {
          const spellName = itemName;
          const spellResult = this.onManaSpell(isPlayer, newCharData, spellName);
          c.charStats.strength = spellResult.char.currentDungeonStats.charStats.strength;
          c.charStats.accuracy = spellResult.char.currentDungeonStats.charStats.accuracy;
          c.charStats.magic = spellResult.char.currentDungeonStats.charStats.magic;
          c.charStats.mana = spellResult.char.currentDungeonStats.charStats.mana;
          const spellAction = spellResult.action;
          chatMessagesPlayer.push(' It is a  ' + spellName + ' spell. Effect: ' + spellAction);
        }
        break;
      case 'Potion':
        switch (itemName) {
          case 'HP Potion':
          case 'HP Medium Potion':
          case 'HP Large Potion':
            if (isPlayer) {
              let hp = 0;
              this.characterService.useSingleItem(itemName, true);
              if (itemName === 'HP Potion') {
                hp = 50;
              } else if (itemName === 'HP Medium Potion') {
                hp = 100;
              } else if (itemName === 'HP Large Potion') {
                hp = 250;
              }
              const oldHp = playerHP.valueOf();
              playerHP = playerHP + hp > playerMaxHp ? playerMaxHp : playerHP + hp;
              c.charStats.hp = playerHP;
              chatMessagesPlayer.push(' Your have restored ' + (playerHP - oldHp) + ' hitpoints.');
            }
            break;
          case 'Mana Potion':
            if (isPlayer) {
              let mana = 0;
              this.characterService.useSingleItem(itemName, true);
              if (itemName === 'Mana Potion') {
                mana = 50;
              }
              const oldMana = c.charStats.mana;
              c.charStats.mana = c.charStats.mana + mana > playerMaxMana ? playerMaxMana : c.charStats.mana + mana;
              chatMessagesPlayer.push('Your have restored ' + (c.charStats.mana - oldMana) + ' manapoints.');
            }
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
    damageByCreature = this.onMeleeAttack(1, creatureMeleeAttack, 1, playerStrength, playerDefence, playerShielding, playerShieldingSkill);
    finalDamageByCreature = damageByCreature[0];
    damageBlockedByPlayer = damageByCreature[1];

    const skillAllFactor = [
      // ['Knight', 'Archer', 'Wizard'],
      [1, 2, 2], // swordXP
      [1, 2, 2], // axeXP
      [1, 2, 2], // hammerXP
      [2, 1, 2], // bowXP
      [2, 1, 2], // crossbowXP
      [2, 2, 1], // wandXP
      [2, 2, 1], // rodXP
      [1, 2, 1.5], // shieldingXP
    ];

    let i = 0;
    switch (newCharData.generalInfo.profession) {
      case 'knight':
        i = 0;
        break;
      case 'archer':
        i = 1;
        break;
      case 'wizard':
        i = 2;
        break;
      default:
        break;
    }

    a.swordXP = (isPlayer && playerAttackWeaponType === 'Sword') ? (a.swordXP + finalDamageByPlayer) / skillAllFactor[0][i] : a.swordXP;
    a.axeXP = (isPlayer && playerAttackWeaponType === 'Axe') ? (a.axeXP + finalDamageByPlayer) / skillAllFactor[1][i] : a.axeXP;
    a.hammerXP = (isPlayer && playerAttackWeaponType === 'Hammer') ? (a.hammerXP + finalDamageByPlayer) / skillAllFactor[2][i] : a.hammerXP;
    a.bowXP = (isPlayer && playerAttackWeaponType === 'Bow') ? (a.bowXP + finalDamageByPlayer) / skillAllFactor[3][i] : a.bowXP;
    a.crossbowXP =
      (isPlayer && playerAttackWeaponType === 'Crossbow') ? (a.crossbowXP + finalDamageByPlayer) / skillAllFactor[4][i] : a.crossbowXP;
    a.wandXP = (isPlayer && playerAttackWeaponType === 'Wand') ? (a.wandXP + finalDamageByPlayer) / skillAllFactor[5][i] : a.wandXP;
    a.rodXP = (isPlayer && playerAttackWeaponType === 'Rod') ? (a.rodXP + finalDamageByPlayer) / skillAllFactor[6][i] : a.rodXP;
    a.shieldingXP =
      (isPlayer && isShieldOn) ? a.shieldingXP : (a.shieldingXP + damageBlockedByPlayer) / skillAllFactor[7][i];
    c.charStats.hp = isPlayer ? c.charStats.hp : c.charStats.hp - finalDamageByCreature;
    c.currCreature.hp = isPlayer ? creatureHP - finalDamageByPlayer : creatureHP;
    if (!isPlayer) { chatMessagesEnemy.push('You have lost ' + finalDamageByCreature + ' hitpoints.'); }
    return [newCharData, chatMessagesPlayer, chatMessagesEnemy];
  }

  onMeleeAttack(
  mainAttackAttribute: number,
  meleeAttack: number,
  meleeSkill: number,
  mainDefenderStrength: number,
  defence: number,
  shielding: number,
  shieldingSkill: number) {
    let damage = [0, 0];
    const factor = 0.75 + Math.random() * 0.5;
    const defFactor = 1;
    const attacked = Math.round(meleeAttack * (meleeSkill + mainAttackAttribute / 100) * factor);
    const defended = Math.round((defence * mainDefenderStrength / 200 + shielding * shieldingSkill / 10) * defFactor);
    damage = [Math.round(Math.max(0, attacked - defended)), defended];
    return damage;
  }

  onRuneAttack(isPlayer: boolean, magic: number, item: string, oppMagic: number) {
    const runeAttack = this.eqService.getEquipment(item).magic;
    const factor = 0.75 + Math.random() * 0.5;
    const damage = Math.round(runeAttack * magic / (oppMagic / 2) * factor);
    return damage;
  }

  onManaSpell(isPlayer: boolean, charData: Character, spellName: string) {
    const spell = this.getSpell(spellName);
    const c = charData.currentDungeonStats.charStats;
    let result: {char: Character, action: string};
    let actionName = 'nothing happened';
    switch (spell.effect) {
      case 'Defence':
        if (c.mana >= spell.mana) {
          c.strength *= (1 + spell.perc / 100);
          c.strength = Math.round(c.strength);
          c.mana -= spell.mana;
          actionName = 'Your natural strength raised by: ' + spell.perc + '%.';
          result = {char: charData, action: actionName};
        } else {
          actionName = 'You do not have enough mana to cast this spell.';
          result = {char: charData, action: actionName};
        }
        break;
      case 'Accuracy':
        if (c.mana >= spell.mana) {
          c.accuracy *= (1 + spell.perc / 100);
          c.accuracy = Math.round(c.accuracy);
          c.mana -= spell.mana;
          actionName = 'Your natural accuracy raised by: ' + spell.perc + '%.';
          result = {char: charData, action: actionName};
        } else {
          actionName = 'You do not have enough mana to cast this spell.';
          result = {char: charData, action: actionName};
        }
        break;
      case 'Magic':
        if (c.mana >= spell.mana) {
          c.magic *= (1 + spell.perc / 100);
          c.magic = Math.round(c.magic);
          c.mana -= spell.mana;
          actionName = 'Your natural magic raised by: ' + spell.perc + '%.';
          result = {char: charData, action: actionName};
        } else {
          actionName = 'You do not have enough mana to cast this spell.';
          result = {char: charData, action: actionName};
        }
        break;
      default:
        break;
    }
    return result;
  }

  maximumDamage(isPlayer: boolean, damage: number, charData: Character) {
    let max = 0;
    if (isPlayer) {
      max = Math.min(damage, charData.currentDungeonStats.currCreature.hp);
    } else {
      max = Math.min(damage, charData.currentDungeonStats.charStats.hp);
    }
    return max;
  }

  gambleLoot(creature: Creature) {
    const possibleLoot = creature.loot;
    const wonLoot: {name: string, amount: number}[] = [];
    possibleLoot.forEach((data) => {
      const x = data.probability ===  1 ? data.probability : Math.round(Math.random() * data.probability);
      const y = Math.round(Math.random() * (data.maxAmount - data.minAmount)) + data.minAmount;
      if (x === data.probability) {
        wonLoot.push({name: data.item, amount: y});
      }
    });
    return wonLoot;
  }

  setSpellsFromServer(newSpells: Spell[]) {
    newSpells.forEach(data => {
      spellArray.set(data.name, data);
    });
  }

  getAllSpells() {
    const spells: Spell[] = [];
    spellArray.forEach((data) => {
      spells.push(data);
    });
    return spells;
  }

  getSpell(name: string) {
    const spell: Spell = Object.assign({}, spellArray.get(name));
    const item = spell;
    return item;
  }
}
