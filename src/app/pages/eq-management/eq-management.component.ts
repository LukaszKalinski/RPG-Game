import { Component, OnInit } from '@angular/core';

import { Equipment } from 'src/app/classes/equipment.model';
import {
  faChevronCircleLeft,
  faChevronCircleRight
   } from '@fortawesome/free-solid-svg-icons';

import { EquipmentService } from 'src/app/shared/equipment.service';
import { ServerService } from 'src/app/shared/server-data.service';

@Component({
  selector: 'app-eq-management',
  templateUrl: './eq-management.component.html',
  styleUrls: ['./eq-management.component.css']
})
export class EqManagementComponent implements OnInit {
  allEquipment: Equipment[] = [];
  itemIndex = 0;
  rightIcon = faChevronCircleRight;
  leftIcon = faChevronCircleLeft;
  selectedItem;
  itemName: string;
  itemType: string;
  itemImg: string;
  itemReqProfession: string;
  itemReqLevel: number;
  itemReqSkill: string;
  itemReqSkillLevel: number;
  itemMeleeAttack: number;
  itemShielding: number;
  itemDefence: number;
  itemRangeAttack: number;
  itemMagic: number;
  itemSpeed: number;
  itemWeight: number;
  itemAmount: number;
  itemCondition: number;
  itemRarity: number;
  itemExtraHP: number;
  itemExtraMana: number;
  itemExtraStrength: number;
  itemExtraAccuracy: number;
  itemExtraMagic: number;
  itemExtraSwordSkill: number;
  itemExtraAxeSkill: number;
  itemExtraHammerSkill: number;
  itemExtraShieldingSkill: number;
  itemExtraBowSkill: number;
  itemExtraCrossbowSkill: number;
  itemExtraWandSkill: number;
  itemExtraRodSkill: number;
  itemExtraWoodcuttingSkill: number;
  itemExtraCarpentrySkill: number;
  itemExtraMiningSkill: number;
  itemExtraBlackSmithingSkill: number;
  itemExtraHerbologySkill: number;
  itemExtraAlchemySkill: number;
  itemExtraSorcerySkill: number;
  itemExtraRuneCraftingSkill: number;
  itemDesc: string;
  itemUsable: boolean;
  itemStackable: boolean;
  itemRuneElement: string;
  itemIsTwoHanded: boolean;
  itemSellValue: number;
  itemBuyValue: number;

  constructor(
    private eqService: EquipmentService,
    private serverService: ServerService,
  ) { }

  ngOnInit(): void {
    this.allEquipment = this.eqService.getAllEquipment();
    this.selectedItem = Object.entries(this.allEquipment[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  sendAllItemsToServer(eq: Equipment[]) {
    this.serverService.sendAllEquipmentToServer(eq);
  }

  loadAllItemsFromServer() {
    this.serverService.loadAllEquipmentFromServer();
    setTimeout(() => {
      this.allEquipment = this.eqService.getAllEquipment();
    }, 1000);
  }

  saveParticularItemInfo() {
    const c = this.allEquipment[this.itemIndex];
    c.name = this.itemName;
    c.type = this.itemType;
    c.img = this.itemImg;
    c.reqProfession = this.itemReqProfession;
    c.reqLevel = typeof(this.itemReqLevel) === 'number' ? this.itemReqLevel : parseInt(this.itemReqLevel, 10);
    c.reqSkill = this.itemReqSkill;
    c.reqSkillLevel = typeof(this.itemReqSkillLevel) === 'number' ? this.itemReqSkillLevel : parseInt(this.itemReqSkillLevel, 10);
    c.meleeAttack = typeof(this.itemMeleeAttack) === 'number' ? this.itemMeleeAttack : parseInt(this.itemMeleeAttack, 10);
    c.shielding = typeof(this.itemShielding) === 'number' ? this.itemShielding : parseInt(this.itemShielding, 10);
    c.defence = typeof(this.itemDefence) === 'number' ? this.itemDefence : parseInt(this.itemDefence, 10);
    c.rangeAttack = typeof(this.itemRangeAttack) === 'number' ? this.itemRangeAttack : parseInt(this.itemRangeAttack, 10);
    c.magic = typeof(this.itemMagic) === 'number' ? this.itemMagic : parseInt(this.itemMagic, 10);
    c.speed = typeof(this.itemSpeed) === 'number' ? this.itemSpeed : parseInt(this.itemSpeed, 10);
    c.weight = typeof(this.itemWeight) === 'number' ? this.itemWeight : parseInt(this.itemWeight, 10);
    c.amount = typeof(this.itemAmount) === 'number' ? this.itemAmount : parseInt(this.itemAmount, 10);
    c.condition = typeof(this.itemCondition) === 'number' ? this.itemCondition : parseInt(this.itemCondition, 10);
    c.rarity = typeof(this.itemRarity) === 'number' ? this.itemRarity : parseInt(this.itemRarity, 10);
    c.extraHP = typeof(this.itemExtraHP) === 'number' ? this.itemExtraHP : parseInt(this.itemExtraHP, 10);
    c.extraMana = typeof(this.itemExtraMana) === 'number' ? this.itemExtraMana : parseInt(this.itemExtraMana, 10);
    c.extraStrength = typeof(this.itemExtraStrength) === 'number' ? this.itemExtraStrength : parseInt(this.itemExtraStrength, 10);
    c.extraAccuracy = typeof(this.itemExtraAccuracy) === 'number' ? this.itemExtraAccuracy : parseInt(this.itemExtraAccuracy, 10);
    c.extraMagic = typeof(this.itemExtraMagic) === 'number' ? this.itemExtraMagic : parseInt(this.itemExtraMagic, 10);
    c.extraSwordSkill = typeof(this.itemExtraSwordSkill) === 'number' ? this.itemExtraSwordSkill : parseInt(this.itemExtraSwordSkill, 10);
    c.extraAxeSkill = typeof(this.itemExtraAxeSkill) === 'number' ? this.itemExtraAxeSkill : parseInt(this.itemExtraAxeSkill, 10);
    c.extraHammerSkill = typeof(this.itemExtraHammerSkill) === 'number' ?
      this.itemExtraHammerSkill : parseInt(this.itemExtraHammerSkill, 10);
    c.extraShieldingSkill = typeof(this.itemExtraShieldingSkill) === 'number' ?
      this.itemExtraShieldingSkill : parseInt(this.itemExtraShieldingSkill, 10);
    c.extraBowSkill = typeof(this.itemExtraBowSkill) === 'number' ?
      this.itemExtraBowSkill : parseInt(this.itemExtraBowSkill, 10);
    c.extraCrossbowSkill = typeof(this.itemExtraCrossbowSkill) === 'number' ?
      this.itemExtraCrossbowSkill : parseInt(this.itemExtraCrossbowSkill, 10);
    c.extraWandSkill = typeof(this.itemExtraWandSkill) === 'number' ? this.itemExtraWandSkill : parseInt(this.itemExtraWandSkill, 10);
    c.extraRodSkill = typeof(this.itemExtraRodSkill) === 'number' ? this.itemExtraRodSkill : parseInt(this.itemExtraRodSkill, 10);
    c.extraWoodcuttingSkill = typeof(this.itemExtraWoodcuttingSkill) === 'number' ?
      this.itemExtraWoodcuttingSkill : parseInt(this.itemExtraWoodcuttingSkill, 10);
    c.extraCarpentrySkill = typeof(this.itemExtraCarpentrySkill) === 'number' ?
      this.itemExtraCarpentrySkill : parseInt(this.itemExtraCarpentrySkill, 10);
    c.extraMiningSkill =  typeof(this.itemExtraMiningSkill) === 'number' ?
      this.itemExtraMiningSkill : parseInt(this.itemExtraMiningSkill, 10);
    c.extraBlackSmithingSkill = typeof(this.itemExtraBlackSmithingSkill) === 'number' ?
      this.itemExtraBlackSmithingSkill : parseInt(this.itemExtraBlackSmithingSkill, 10);
    c.extraHerbologySkill = typeof(this.itemExtraHerbologySkill) === 'number' ?
      this.itemExtraHerbologySkill : parseInt(this.itemExtraHerbologySkill, 10);
    c.extraAlchemySkill = typeof(this.itemExtraAlchemySkill) === 'number' ?
      this.itemExtraAlchemySkill : parseInt(this.itemExtraAlchemySkill, 10);
    c.extraSorcerySkill = typeof(this.itemExtraSorcerySkill) === 'number' ?
      this.itemExtraSorcerySkill : parseInt(this.itemExtraSorcerySkill, 10);
    c.extraRuneCraftingSkill = typeof(this.itemExtraRuneCraftingSkill) === 'number' ?
      this.itemExtraRuneCraftingSkill : parseInt(this.itemExtraRuneCraftingSkill, 10);
    c.desc = this.itemDesc;
    c.usable = typeof(this.itemUsable) === 'string' ? (this.itemUsable === 'true' ? true : false) : this.itemUsable;
    c.stackable = typeof(this.itemStackable) === 'string' ? (this.itemStackable === 'true' ? true : false) : this.itemStackable;
    c.runeElement = this.itemRuneElement;
    c.isTwoHanded = typeof(this.itemIsTwoHanded)  === 'string' ? (this.itemIsTwoHanded === 'true' ? true : false) : this.itemIsTwoHanded;
    c.sellValue = typeof(this.itemSellValue) === 'number' ? this.itemSellValue : parseInt(this.itemSellValue, 10);
    c.buyValue = typeof(this.itemBuyValue) === 'number' ? this.itemBuyValue : parseInt(this.itemBuyValue, 10);
    this.loadParticularItemInfo();
  }

  loadParticularItemInfo() {
    const c = this.allEquipment[this.itemIndex];
    this.itemName = c.name;
    this.itemType = c.type;
    this.itemImg = c.img;
    this.itemReqProfession = c.reqProfession;
    this.itemReqLevel = c.reqLevel;
    this.itemReqSkill = c.reqSkill;
    this.itemReqSkillLevel = c.reqSkillLevel;
    this.itemMeleeAttack = c.meleeAttack;
    this.itemShielding = c.shielding;
    this.itemDefence = c.defence;
    this.itemRangeAttack = c.rangeAttack;
    this.itemMagic = c.magic;
    this.itemSpeed = c.speed;
    this.itemWeight = c.weight;
    this.itemAmount = c.amount;
    this.itemCondition = c.condition;
    this.itemRarity = c.rarity;
    this.itemExtraHP = c.extraHP;
    this.itemExtraMana = c.extraMana;
    this.itemExtraStrength = c.extraStrength;
    this.itemExtraAccuracy = c.extraAccuracy;
    this.itemExtraMagic = c.extraMagic;
    this.itemExtraSwordSkill = c.extraSwordSkill;
    this.itemExtraAxeSkill = c.extraAxeSkill;
    this.itemExtraHammerSkill = c.extraHammerSkill;
    this.itemExtraShieldingSkill = c.extraShieldingSkill;
    this.itemExtraBowSkill = c.extraBowSkill;
    this.itemExtraCrossbowSkill = c.extraCrossbowSkill;
    this.itemExtraWandSkill = c.extraWandSkill;
    this.itemExtraRodSkill = c.extraRodSkill;
    this.itemExtraWoodcuttingSkill = c.extraWoodcuttingSkill;
    this.itemExtraCarpentrySkill = c.extraCarpentrySkill;
    this.itemExtraMiningSkill = c.extraMiningSkill;
    this.itemExtraBlackSmithingSkill = c.extraBlackSmithingSkill;
    this.itemExtraHerbologySkill = c.extraHerbologySkill;
    this.itemExtraAlchemySkill = c.extraAlchemySkill;
    this.itemExtraSorcerySkill = c.extraSorcerySkill;
    this.itemExtraRuneCraftingSkill = c.extraRuneCraftingSkill;
    this.itemDesc = c.desc;
    this.itemUsable = c.usable;
    this.itemStackable = c.stackable;
    this.itemRuneElement = c.runeElement;
    this.itemIsTwoHanded = c.isTwoHanded;
    this.itemSellValue = c.sellValue;
    this.itemBuyValue = c.buyValue;
  }

  createNewItem() {
    let newEq: Equipment;
    newEq = this.createNewEquipment();
    this.allEquipment.push(newEq);
    this.selectedItem = Object.entries(this.allEquipment[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  createNewEquipment() {
    // tslint:disable-next-line: max-line-length
    const c = new Equipment(
      null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
    c.name = this.itemName;
    c.type = this.itemType;
    c.img = this.itemImg;
    c.reqProfession = this.itemReqProfession;
    c.reqLevel = typeof(this.itemReqLevel) === 'number' ? this.itemReqLevel : parseInt(this.itemReqLevel, 10);
    c.reqSkill = this.itemReqSkill;
    c.reqSkillLevel = typeof(this.itemReqSkillLevel) === 'number' ? this.itemReqSkillLevel : parseInt(this.itemReqSkillLevel, 10);
    c.meleeAttack = typeof(this.itemMeleeAttack) === 'number' ? this.itemMeleeAttack : parseInt(this.itemMeleeAttack, 10);
    c.shielding = typeof(this.itemShielding) === 'number' ? this.itemShielding : parseInt(this.itemShielding, 10);
    c.defence = typeof(this.itemDefence) === 'number' ? this.itemDefence : parseInt(this.itemDefence, 10);
    c.rangeAttack = typeof(this.itemRangeAttack) === 'number' ? this.itemRangeAttack : parseInt(this.itemRangeAttack, 10);
    c.magic = typeof(this.itemMagic) === 'number' ? this.itemMagic : parseInt(this.itemMagic, 10);
    c.speed = typeof(this.itemSpeed) === 'number' ? this.itemSpeed : parseInt(this.itemSpeed, 10);
    c.weight = typeof(this.itemWeight) === 'number' ? this.itemWeight : parseInt(this.itemWeight, 10);
    c.amount = typeof(this.itemAmount) === 'number' ? this.itemAmount : parseInt(this.itemAmount, 10);
    c.condition = typeof(this.itemCondition) === 'number' ? this.itemCondition : parseInt(this.itemCondition, 10);
    c.rarity = typeof(this.itemRarity) === 'number' ? this.itemRarity : parseInt(this.itemRarity, 10);
    c.extraHP = typeof(this.itemExtraHP) === 'number' ? this.itemExtraHP : parseInt(this.itemExtraHP, 10);
    c.extraMana = typeof(this.itemExtraMana) === 'number' ? this.itemExtraMana : parseInt(this.itemExtraMana, 10);
    c.extraStrength = typeof(this.itemExtraStrength) === 'number' ? this.itemExtraStrength : parseInt(this.itemExtraStrength, 10);
    c.extraAccuracy = typeof(this.itemExtraAccuracy) === 'number' ? this.itemExtraAccuracy : parseInt(this.itemExtraAccuracy, 10);
    c.extraMagic = typeof(this.itemExtraMagic) === 'number' ? this.itemExtraMagic : parseInt(this.itemExtraMagic, 10);
    c.extraSwordSkill = typeof(this.itemExtraSwordSkill) === 'number' ? this.itemExtraSwordSkill : parseInt(this.itemExtraSwordSkill, 10);
    c.extraAxeSkill = typeof(this.itemExtraAxeSkill) === 'number' ? this.itemExtraAxeSkill : parseInt(this.itemExtraAxeSkill, 10);
    c.extraHammerSkill = typeof(this.itemExtraHammerSkill) === 'number' ?
      this.itemExtraHammerSkill : parseInt(this.itemExtraHammerSkill, 10);
    c.extraShieldingSkill = typeof(this.itemExtraShieldingSkill) === 'number' ?
      this.itemExtraShieldingSkill : parseInt(this.itemExtraShieldingSkill, 10);
    c.extraBowSkill = typeof(this.itemExtraBowSkill) === 'number' ? this.itemExtraBowSkill : parseInt(this.itemExtraBowSkill, 10);
    c.extraCrossbowSkill = typeof(this.itemExtraCrossbowSkill) === 'number' ?
      this.itemExtraCrossbowSkill : parseInt(this.itemExtraCrossbowSkill, 10);
    c.extraWandSkill = typeof(this.itemExtraWandSkill) === 'number' ? this.itemExtraWandSkill : parseInt(this.itemExtraWandSkill, 10);
    c.extraRodSkill = typeof(this.itemExtraRodSkill) === 'number' ? this.itemExtraRodSkill : parseInt(this.itemExtraRodSkill, 10);
    c.extraWoodcuttingSkill = typeof(this.itemExtraWoodcuttingSkill) === 'number' ?
      this.itemExtraWoodcuttingSkill : parseInt(this.itemExtraWoodcuttingSkill, 10);
    c.extraCarpentrySkill = typeof(this.itemExtraCarpentrySkill) === 'number' ?
      this.itemExtraCarpentrySkill : parseInt(this.itemExtraCarpentrySkill, 10);
    c.extraMiningSkill =  typeof(this.itemExtraMiningSkill) === 'number' ?
      this.itemExtraMiningSkill : parseInt(this.itemExtraMiningSkill, 10);
    c.extraBlackSmithingSkill = typeof(this.itemExtraBlackSmithingSkill) === 'number' ?
      this.itemExtraBlackSmithingSkill : parseInt(this.itemExtraBlackSmithingSkill, 10);
    c.extraHerbologySkill = typeof(this.itemExtraHerbologySkill) === 'number' ?
      this.itemExtraHerbologySkill : parseInt(this.itemExtraHerbologySkill, 10);
    c.extraAlchemySkill = typeof(this.itemExtraAlchemySkill) === 'number' ?
      this.itemExtraAlchemySkill : parseInt(this.itemExtraAlchemySkill, 10);
    c.extraSorcerySkill = typeof(this.itemExtraSorcerySkill) === 'number' ?
      this.itemExtraSorcerySkill : parseInt(this.itemExtraSorcerySkill, 10);
    c.extraRuneCraftingSkill = typeof(this.itemExtraRuneCraftingSkill) === 'number' ?
      this.itemExtraRuneCraftingSkill : parseInt(this.itemExtraRuneCraftingSkill, 10);
    c.desc = this.itemDesc;
    c.usable = typeof(this.itemUsable) === 'string' ? (this.itemUsable === 'true' ? true : false) : this.itemUsable;
    c.stackable = typeof(this.itemStackable) === 'string' ? (this.itemStackable === 'true' ? true : false) : this.itemStackable;
    c.runeElement = this.itemRuneElement;
    c.isTwoHanded = typeof(this.itemIsTwoHanded) === 'string' ? (this.itemIsTwoHanded === 'true' ? true : false) : this.itemIsTwoHanded;
    c.sellValue = typeof(this.itemSellValue) === 'number' ? this.itemSellValue : parseInt(this.itemSellValue, 10);
    c.buyValue = typeof(this.itemBuyValue) === 'number' ? this.itemBuyValue : parseInt(this.itemBuyValue, 10);
    return c;
  }

  goBack() {
    if (this.itemIndex === 0) {
      this.itemIndex = this.allEquipment.length - 1;
    } else {
      this.itemIndex -= 1;
    }
    this.selectedItem = Object.entries(this.allEquipment[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  goForward() {
    if (this.itemIndex === this.allEquipment.length - 1) {
      this.itemIndex = 0;
    } else {
      this.itemIndex += 1;
    }
    this.selectedItem = Object.entries(this.allEquipment[this.itemIndex]);
    this.loadParticularItemInfo();
  }
}
