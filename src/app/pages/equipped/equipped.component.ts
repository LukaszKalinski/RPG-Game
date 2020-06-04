import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Equipment } from 'src/app/classes/equipment.model';
import { Character } from 'src/app/classes/character.model';
import { CharacterEquippedInv } from 'src/app/classes/character-equipped.model';

import { CharacterService } from 'src/app/shared/character.service';
import { EquipmentService } from 'src/app/shared/equipment.service';
import { ApplicationStateService } from 'src/app/shared/app-state.service';

@Component({
  selector: 'app-equipped',
  templateUrl: './equipped.component.html',
  styleUrls: ['./equipped.component.css']
})

export class EquippedComponent implements OnInit, OnDestroy {
  isMobile = false;
  isMobileSub: Subscription;
  isSmallestImg = false;
  characterInfo: Character;
  characterInfoSub: Subscription;
  characterEquipped: CharacterEquippedInv;
  characterEquippedSub: Subscription;
  selectedItem: Equipment = null;
  leftHandSlot: Equipment[] = [];
  rightHandSlot: Equipment[] = [];
  armorSlot: Equipment[] = [];
  helmetSlot: Equipment[] = [];
  bootsSlot: Equipment[] = [];
  beltSlot: Equipment[] = [];
  necklaceSlot: Equipment[] = [];
  ringSlot: Equipment[] = [];
  ringSlotTwo: Equipment[] = [];
  ringSlotThree: Equipment[] = [];
  ringSlotFour: Equipment[] = [];
  glovesSlot: Equipment[] = [];
  legsSlot: Equipment[] = [];
  padsSlot: Equipment[] = [];
  horseSlot: Equipment[] = [];
  potionSlot: Equipment[] = [];
  ringSlotNum = 0;
  equipmentSkills: {name: string, level: number}[] = [];

  constructor(
    private characterInfoService: CharacterService,
    private eqService: EquipmentService,
    private stateService: ApplicationStateService,
    ) { }

  ngOnInit(): void {
    this.subscriptionsOnInit();
    this.setEquipmentToSlots();
    this.characterInfoService.getEquipmentStats();
    this.setEquipmentStatistics();
  }

  subscriptionsOnInit() {
    this.isMobile = this.stateService.getWidthStatus();
    this.isMobileSub = this.stateService.isMobileResolutionChanged.subscribe((data) => {
      this.isMobile = data;
    });
    this.characterInfo = this.characterInfoService.getCharacterInfo();
    this.characterInfoSub = this.characterInfoService.characterInfoChanged.subscribe((char) => {
      this.characterInfo = char;
      this.setEquipmentToSlots();
      this.characterInfoService.getEquipmentStats();
      this.setEquipmentStatistics();
    });
    this.characterEquipped = this.characterInfoService.getCharEquipped();
    this.characterEquippedSub = this.characterInfoService.characterInfoChanged.subscribe((eq) => {
      this.characterEquipped = eq.equipped;
      this.setEquipmentToSlots();
      this.characterInfoService.getEquipmentStats();
      this.setEquipmentStatistics();
    });
    this.isSmallestImg = window.innerHeight > 625 ? false : true;
  }

  setEquipmentToSlots() {
    const c = this.characterInfo.equipped;
    this.leftHandSlot = [
      c.leftHandSlot ? c.leftHandSlot : this.eqService.getEquipment('Starting Sword')];
    this.rightHandSlot = [
      c.rightHandSlot ? c.rightHandSlot : this.eqService.getEquipment('Starting Shield')];
    this.armorSlot = [
      c.armorSlot ? c.armorSlot : this.eqService.getEquipment('Starting Armor')];
    this.helmetSlot = [
      c.helmetSlot ? c.helmetSlot : this.eqService.getEquipment('Starting Helmet')];
    this.bootsSlot = [
      c.bootsSlot ? c.bootsSlot : this.eqService.getEquipment('Starting Boots')];
    this.beltSlot = [
      c.beltSlot ? c.beltSlot : this.eqService.getEquipment('Starting Belt')];
    this.necklaceSlot = [
      c.necklaceSlot ? c.necklaceSlot : this.eqService.getEquipment('Starting Necklace')];
    this.ringSlot = [
      c.ringSlotOne ? c.ringSlotOne : this.eqService.getEquipment('Starting Ring')];
    this.ringSlotTwo = [
      c.ringSlotTwo ? c.ringSlotTwo : this.eqService.getEquipment('Starting Ring')];
    this.ringSlotThree = [
      c.ringSlotThree ? c.ringSlotThree : this.eqService.getEquipment('Starting Ring')];
    this.ringSlotFour = [
      c.ringSlotFour ? c.ringSlotFour : this.eqService.getEquipment('Starting Ring')];
    this.glovesSlot = [
      c.glovesSlot ? c.glovesSlot : this.eqService.getEquipment('Starting Gloves')];
    this.legsSlot = [
      c.legsSlot ? c.legsSlot : this.eqService.getEquipment('Starting Legs')];
    this.padsSlot = [
      c.padsSlot ? c.padsSlot : this.eqService.getEquipment('Starting Pads')];
    this.horseSlot = [
      c.horseSlot ? c.horseSlot : this.eqService.getEquipment('Starting Horse')];
    this.potionSlot = [
      c.potionSlotOne ? c.potionSlotOne : this.eqService.getEquipment('Starting Potion')];
  }

  setEquipmentStatistics() {
    const c = this.characterInfo.gamePlayInfo;
    this.equipmentSkills = [
      {name: 'Melee Attack', level: c.eqMeleeAttack},
      {name: 'Magic Attack', level: c.eqMagicAttack},
      {name: 'Range Attack', level: c.eqRangeAttack},
      {name: 'Shielding', level: c.eqShielding},
      {name: 'Defence', level: c.eqDefence},
      {name: 'Speed', level: c.eqSpeed},
      {name: 'HP', level: c.extraHP},
      {name: 'Mana', level: c.extraMana},
      {name: 'Strength', level: c.extraStrength},
      {name: 'Accuracy', level: c.extraAccuracy},
      {name: 'Sword Fighting', level: c.extraSwordSkill},
      {name: 'Axe Fighting', level: c.extraAxeSkill},
      {name: 'Hammer Fighting', level: c.extraHammerSkill},
      {name: 'Shielding Skill', level: c.extraShieldingSkill},
      {name: 'Bow Fighting', level: c.extraBowSkill},
      {name: 'Crossbow Fighting', level: c.extraCrossbowSkill},
      {name: 'Wand Fighting', level: c.extraWandSkill},
      {name: 'Rod Fighting', level: c.extraRodSkill},
      {name: 'Woodcutting', level: c.extraWoodcuttingSkill},
      {name: 'Carpentry', level: c.extraCarpentrySkill},
      {name: 'Mining', level: c.extraMiningSkill},
      {name: 'Blacksmithing', level: c.extraBlackSmithingSkill},
      {name: 'Herbology', level: c.extraHerbologySkill},
      {name: 'Alchemy', level: c.extraAlchemySkill},
      {name: 'Sorcery', level: c.extraSorcerySkill},
      {name: 'Crafting', level: c.extraRuneCraftingSkill}
    ];
  }

  onOpenDetails(item: Equipment, ringSlotNum: number) {
    this.ringSlotNum = ringSlotNum;
    if (!item.name.includes('Starting')) {
      this.selectedItem = item;
    }
  }

  onCloseItem() {
    this.selectedItem = null;
  }

  transformEqArrToEqObj() {
    const c = this.characterEquipped;
    const characterEquipped2 = new CharacterEquippedInv(
      c.leftHandSlot.name ? c.leftHandSlot : c.leftHandSlot[0],
      c.rightHandSlot.name ? c.rightHandSlot : c.rightHandSlot[0],
      c.armorSlot.name ? c.armorSlot : c.armorSlot[0],
      c.helmetSlot.name ? c.helmetSlot : c.helmetSlot[0],
      c.bootsSlot.name ? c.bootsSlot : c.bootsSlot[0],
      c.beltSlot.name ? c.beltSlot : c.beltSlot[0],
      c.necklaceSlot.name ? c.necklaceSlot : c.necklaceSlot[0],
      c.ringSlotOne.name ? c.ringSlotOne : c.ringSlotOne[0],
      c.ringSlotTwo.name ? c.ringSlotTwo : c.ringSlotTwo[0],
      c.ringSlotThree.name ? c.ringSlotThree : c.ringSlotThree[0],
      c.ringSlotFour.name ? c.ringSlotFour : c.ringSlotFour[0],
      c.glovesSlot.name ? c.glovesSlot : c.glovesSlot[0],
      c.legsSlot.name ? c.legsSlot : c.legsSlot[0],
      c.padsSlot.name ? c.padsSlot : c.padsSlot[0],
      c.horseSlot.name ? c.horseSlot : c.horseSlot[0],
      c.potionSlotOne ? c.potionSlotOne[0] : null,
      c.potionSlotTwo ? c.potionSlotTwo[0] : null,
      c.potionSlotThree ? c.potionSlotThree[0] : null,
      c.potionSlotFour ? c.potionSlotFour[0] : null,
    );
    this.characterInfoService.setCharEquipped(characterEquipped2);
  }

  ngOnDestroy(): void {
    this.transformEqArrToEqObj();
  }
}
