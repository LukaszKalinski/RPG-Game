import { Component, OnInit } from '@angular/core';

import { Creature } from 'src/app/classes/creature.model';
import {
  faChevronCircleLeft,
  faChevronCircleRight
   } from '@fortawesome/free-solid-svg-icons';

import { ServerService } from 'src/app/shared/server-data.service';
import { CreatureService } from 'src/app/shared/creature.service';

@Component({
  selector: 'app-creature-management',
  templateUrl: './creature-management.component.html',
  styleUrls: ['./creature-management.component.css']
})
export class CreatureManagementComponent implements OnInit {
  allCreatures: Creature[] = [];
  itemIndex = 0;
  rightIcon = faChevronCircleRight;
  leftIcon = faChevronCircleLeft;
  selectedItem;
  itemName: string;
  itemImage: string;
  itemDesc: string;
  itemDungeon: string;
  itemRarity: number;
  itemLevel: number;
  itemHP: number;
  itemMana: number;
  itemType: string;
  itemAttack: number;
  itemDefence: number;
  itemResistance: string;
  itemResLvl: number;
  itemLoot: {probability: number, item: string, minAmount: number, maxAmount: number}[];
  itemNeedsOne: {probability: number, item: string, minAmount: number, maxAmount: number};
  itemNeedsTwo: {probability: number, item: string, minAmount: number, maxAmount: number};
  itemNeedsThree: {probability: number, item: string, minAmount: number, maxAmount: number};

  constructor(
    private serverService: ServerService,
    private creatureService: CreatureService
  ) { }

  ngOnInit(): void {
    this.allCreatures = this.creatureService.getAllCreatures();
    this.selectedItem = Object.entries(this.allCreatures[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  sendAllItemsToServer(creatures: Creature[]) {
    creatures.forEach(data => {
      data.loot.forEach((item, index) => {
        if (item.item === '' || item.item === null || item.minAmount === 0) {
          data.loot.splice(index, 1);
        }
      });
    });
    this.serverService.sendAllCreaturesToServer(creatures);
  }

  loadAllItemsFromServer() {
    this.serverService.loadAllCreaturesFromServer();
    setTimeout(() => {
      this.allCreatures = this.creatureService.getAllCreatures();
    }, 1000);
  }

  saveParticularItemInfo() {
    const c = this.allCreatures[this.itemIndex];
    c.name = this.itemName;
    c.image = this.itemImage;
    c.desc = this.itemDesc;
    c.dungeon = this.itemDungeon;
    c.rarity = typeof(this.itemRarity) === 'number' ? this.itemRarity : parseInt(this.itemRarity, 10);
    c.level = typeof(this.itemLevel) === 'number' ? this.itemLevel : parseInt(this.itemLevel, 10);
    c.hp = typeof(this.itemHP) === 'number' ? this.itemHP : parseInt(this.itemHP, 10);
    c.mana = typeof(this.itemMana) === 'number' ? this.itemMana : parseInt(this.itemMana, 10);
    c.type = this.itemType;
    c.attack = typeof(this.itemAttack) === 'number' ? this.itemAttack : parseInt(this.itemAttack, 10);
    c.defence = typeof(this.itemDefence) === 'number' ? this.itemDefence : parseInt(this.itemDefence, 10);
    c.resistance = this.itemResistance;
    c.resistanceLevel = typeof(this.itemResLvl) === 'number' ? this.itemResLvl : parseInt(this.itemResLvl, 10);
    this.itemNeedsOne.probability = typeof(this.itemNeedsOne.probability) === 'number' ?
      this.itemNeedsOne.probability : parseInt(this.itemNeedsOne.probability, 10);
    this.itemNeedsOne.minAmount = typeof(this.itemNeedsOne.minAmount) === 'number' ?
      this.itemNeedsOne.minAmount : parseInt(this.itemNeedsOne.minAmount, 10);
    this.itemNeedsOne.maxAmount = typeof(this.itemNeedsOne.maxAmount) === 'number' ?
      this.itemNeedsOne.maxAmount : parseInt(this.itemNeedsOne.maxAmount, 10);
    this.itemNeedsTwo.probability = typeof(this.itemNeedsTwo.probability) === 'number' ?
      this.itemNeedsTwo.probability : parseInt(this.itemNeedsTwo.probability, 10);
    this.itemNeedsTwo.minAmount = typeof(this.itemNeedsTwo.minAmount) === 'number' ?
      this.itemNeedsTwo.minAmount : parseInt(this.itemNeedsTwo.minAmount, 10);
    this.itemNeedsTwo.maxAmount = typeof(this.itemNeedsTwo.maxAmount) === 'number' ?
      this.itemNeedsTwo.maxAmount : parseInt(this.itemNeedsTwo.maxAmount, 10);
    this.itemNeedsThree.probability = typeof(this.itemNeedsThree.probability) === 'number' ?
      this.itemNeedsThree.probability : parseInt(this.itemNeedsThree.probability, 10);
    this.itemNeedsThree.minAmount = typeof(this.itemNeedsThree.minAmount) === 'number' ?
      this.itemNeedsThree.minAmount : parseInt(this.itemNeedsThree.minAmount, 10);
    this.itemNeedsThree.maxAmount = typeof(this.itemNeedsThree.maxAmount) === 'number' ?
      this.itemNeedsThree.maxAmount : parseInt(this.itemNeedsThree.maxAmount, 10);
    c.loot = [this.itemNeedsOne, this.itemNeedsTwo, this.itemNeedsThree];
    this.loadParticularItemInfo();
  }

  loadParticularItemInfo() {
    const c = this.allCreatures[this.itemIndex];
    this.itemName = c.name;
    this.itemImage = c.image;
    this.itemDesc = c.desc;
    this.itemDungeon = c.dungeon;
    this.itemRarity = c.rarity;
    this.itemLevel = c.level;
    this.itemHP = c.hp;
    this.itemMana = c.mana;
    this.itemType = c.type;
    this.itemAttack = c.attack;
    this.itemDefence = c.defence;
    this.itemResistance = c.resistance;
    this.itemResLvl = c.resistanceLevel;
    this.itemNeedsOne = c.loot[0] ? c.loot[0] : {probability: 0, item: '', minAmount: 0, maxAmount: 0};
    this.itemNeedsTwo = c.loot[1] ? c.loot[1] : {probability: 0, item: '', minAmount: 0, maxAmount: 0};
    this.itemNeedsThree = c.loot[2] ? c.loot[2] : {probability: 0, item: '', minAmount: 0, maxAmount: 0};
  }

  createNewItem() {
    let newCreature: Creature;
    newCreature = this.createNewCreature();
    this.allCreatures.push(newCreature);
    this.selectedItem = Object.entries(this.allCreatures[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  createNewCreature() {
    const c = new Creature(
      null, null, null, null, null, null, null, null, null, null, null, null, null,
      [
        {probability: null, item: null, minAmount: null, maxAmount: null},
        {probability: null, item: null, minAmount: null, maxAmount: null},
        {probability: null, item: null, minAmount: null, maxAmount: null}
      ]);
    c.name = this.itemName;
    c.image = this.itemImage;
    c.desc = this.itemDesc;
    c.dungeon = this.itemDungeon;
    c.rarity = typeof(this.itemRarity) === 'number' ? this.itemRarity : parseInt(this.itemRarity, 10);
    c.level = typeof(this.itemLevel) === 'number' ? this.itemLevel : parseInt(this.itemLevel, 10);
    c.hp = typeof(this.itemHP) === 'number' ? this.itemHP : parseInt(this.itemHP, 10);
    c.mana = typeof(this.itemMana) === 'number' ? this.itemMana : parseInt(this.itemMana, 10);
    c.type = this.itemType;
    c.attack = typeof(this.itemAttack) === 'number' ? this.itemAttack : parseInt(this.itemAttack, 10);
    c.defence = typeof(this.itemDefence) === 'number' ? this.itemDefence : parseInt(this.itemDefence, 10);
    c.resistance = this.itemResistance;
    c.resistanceLevel = typeof(this.itemResLvl) === 'number' ? this.itemResLvl : parseInt(this.itemResLvl, 10);
    this.itemNeedsOne.probability = typeof(this.itemNeedsOne.probability) === 'number' ?
      this.itemNeedsOne.probability : parseInt(this.itemNeedsOne.probability, 10);
    this.itemNeedsOne.minAmount = typeof(this.itemNeedsOne.minAmount) === 'number' ?
      this.itemNeedsOne.minAmount : parseInt(this.itemNeedsOne.minAmount, 10);
    this.itemNeedsOne.maxAmount = typeof(this.itemNeedsOne.maxAmount) === 'number' ?
      this.itemNeedsOne.maxAmount : parseInt(this.itemNeedsOne.maxAmount, 10);
    this.itemNeedsTwo.probability = typeof(this.itemNeedsTwo.probability) === 'number' ?
      this.itemNeedsTwo.probability : parseInt(this.itemNeedsTwo.probability, 10);
    this.itemNeedsTwo.minAmount = typeof(this.itemNeedsTwo.minAmount) === 'number' ?
      this.itemNeedsTwo.minAmount : parseInt(this.itemNeedsTwo.minAmount, 10);
    this.itemNeedsTwo.maxAmount = typeof(this.itemNeedsTwo.maxAmount) === 'number' ?
      this.itemNeedsTwo.maxAmount : parseInt(this.itemNeedsTwo.maxAmount, 10);
    this.itemNeedsThree.probability = typeof(this.itemNeedsThree.probability) === 'number' ?
      this.itemNeedsThree.probability : parseInt(this.itemNeedsThree.probability, 10);
    this.itemNeedsThree.minAmount = typeof(this.itemNeedsThree.minAmount) === 'number' ?
      this.itemNeedsThree.minAmount : parseInt(this.itemNeedsThree.minAmount, 10);
    this.itemNeedsThree.maxAmount = typeof(this.itemNeedsThree.maxAmount) === 'number' ?
      this.itemNeedsThree.maxAmount : parseInt(this.itemNeedsThree.maxAmount, 10);
    c.loot = [this.itemNeedsOne, this.itemNeedsTwo, this.itemNeedsThree];
    return c;
  }

  goBack() {
    if (this.itemIndex === 0) {
      this.itemIndex = this.allCreatures.length - 1;
    } else {
      this.itemIndex -= 1;
    }
    this.selectedItem = Object.entries(this.allCreatures[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  goForward() {
    if (this.itemIndex === this.allCreatures.length - 1) {
      this.itemIndex = 0;
    } else {
      this.itemIndex += 1;
    }
    this.selectedItem = Object.entries(this.allCreatures[this.itemIndex]);
    this.loadParticularItemInfo();
  }
}
