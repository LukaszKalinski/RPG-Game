import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { Equipment } from 'src/app/classes/equipment.model';
import { Character } from 'src/app/classes/character.model';

import { CharacterService } from 'src/app/shared/character.service';

@Component({
  selector: 'app-singleitem',
  templateUrl: './singleitem.component.html',
  styleUrls: ['./singleitem.component.css']
})
export class SingleitemComponent implements OnInit {
  @Input() item: Equipment;
  @Input() ringSlotNum = 0;
  @Input() isDungInv: boolean;
  @Input() isEquipped: boolean;
  @Input() isShop: boolean;
  @Output() itemClosed = new EventEmitter<void>();
  isSmallestImg = false;
  characterInfo: Character;
  characterInfoSub: Subscription;
  stringItem: {name: string, item: any}[] = [];


  constructor(
    private characterInfoService: CharacterService,
  ) { }

  ngOnInit(): void {
    this.createStringItem();
    this.characterInfo = this.characterInfoService.getCharacterInfo();
    this.characterInfoSub = this.characterInfoService.characterInfoChanged.subscribe((char) => {
      this.characterInfo = char;
    });
    this.isSmallestImg = window.innerHeight > 625 ? false : true;
  }

  createStringItem() {
    this.stringItem = [
      {name: 'Name', item: this.item.name},
      {name: 'Type', item: this.item.type},
      {name: 'Image', item: this.item.img},
      {name: 'Description', item: this.item.desc},
      {name: 'Profession', item: this.item.reqProfession},
      {name: 'Required Level', item: this.item.reqLevel},
      {name: 'Required Skill', item: this.item.reqSkill},
      {name: 'Required Level', item: this.item.reqSkillLevel},
      {name: 'Melee Attack', item: this.item.meleeAttack},
      {name: 'Range Attack', item: this.item.rangeAttack},
      {name: 'Magic Attack', item: this.item.magic},
      {name: 'Shielding', item: this.item.shielding},
      {name: 'Defence', item: this.item.defence},
      {name: 'Speed', item: this.item.speed},
      {name: 'Weight', item: this.item.weight},
      {name: 'Amount', item: this.item.amount},
      {name: 'Condition', item: this.item.condition},
      {name: 'Rarity', item: this.item.rarity},
      {name: 'Element', item: this.item.runeElement},
      {name: 'Magic Attack', item: this.item.extraMagic},
      {name: '+ HP', item: this.item.extraHP},
      {name: '+ Mana', item: this.item.extraMana},
      {name: '+ Strength', item: this.item.extraStrength},
      {name: '+ Accuracy', item: this.item.extraAccuracy},
      {name: '+ Magic', item: this.item.extraMagic},
      {name: '+ Sword Fighting', item: this.item.extraSwordSkill},
      {name: '+ Axe Fighting', item: this.item.extraAxeSkill},
      {name: '+ Hammer Fighting', item: this.item.extraHammerSkill},
      {name: '+ Shielding Skill', item: this.item.extraShieldingSkill},
      {name: '+ Bow Fighting', item: this.item.extraBowSkill},
      {name: '+ Crossbow Fighting', item: this.item.extraCrossbowSkill},
      {name: '+ Wand Fighting', item: this.item.extraWandSkill},
      {name: '+ Rod Fighting', item: this.item.extraRodSkill},
      {name: '+ Woodcutting', item: this.item.extraWoodcuttingSkill},
      {name: '+ Carpentry', item: this.item.extraCarpentrySkill},
      {name: '+ Mining', item: this.item.extraMiningSkill},
      {name: '+ Blacksmithing', item: this.item.extraBlackSmithingSkill},
      {name: '+ Herbology', item: this.item.extraHerbologySkill},
      {name: '+ Alchemy', item: this.item.extraAlchemySkill},
      {name: '+ Sorcery', item: this.item.extraSorcerySkill},
      {name: '+ Rune Crafting', item: this.item.extraRuneCraftingSkill},
    ];
  }

  itemRarity(int: number) {
    let name = 'normal';
    switch (int) {
      case 1:
        name = 'rare';
        break;
      case 2:
        name = 'very rare';
        break;
      case 3:
        name = 'legendary';
        break;
      case 4:
        name = 'epic';
        break;
      case 5:
        name = 'godlike';
        break;
      default:
        name = 'normal';
    }
    return name;
  }

  onSingleItemUse() {
    this.characterInfoService.useSingleItem(this.item.name, this.isDungInv);
    this.onClose();
  }

  onEquipItem(ringSlot: number) {
    const c = this.characterInfo.equipped;
    const cs = this.characterInfoService;
    const item = this.item;
    const type = item.type;
    let oldItem: Equipment;
    switch (type) {
      case 'Armor':
        oldItem = c.armorSlot;
        c.armorSlot = item;
        break;
      case 'Belt':
        oldItem = c.beltSlot;
        c.beltSlot = item;
        break;
      case 'Boots':
        oldItem = c.bootsSlot;
        c.bootsSlot = item;
        break;
      case 'Belt':
        oldItem = c.beltSlot;
        c.beltSlot = item;
        break;
      case 'Gloves':
        oldItem = c.glovesSlot;
        c.glovesSlot = item;
        break;
      case 'Helmet':
        oldItem = c.helmetSlot;
        c.helmetSlot = item;
        break;
      case 'Horse':
        oldItem = c.horseSlot;
        c.horseSlot = item;
        break;
      case 'Sword':
      case 'Axe':
      case 'Hammer':
      case 'Bow':
      case 'Crossbow':
      case 'Wand':
      case 'Rod':
        oldItem = c.leftHandSlot;
        c.leftHandSlot = item;
        if (item.isTwoHanded) {
          const rightItem = c.rightHandSlot;
          this.characterInfoService.addEquipmentToInv(rightItem);
          c.rightHandSlot = null;
        }
        break;
      case 'Shield':
        if (!c.leftHandSlot.isTwoHanded) {
          oldItem = c.rightHandSlot;
          c.rightHandSlot = item;
        }
        break;
      case 'Legs':
        oldItem = c.legsSlot;
        c.legsSlot = item;
        break;
      case 'Necklace':
        oldItem = c.necklaceSlot;
        c.necklaceSlot = item;
        break;
      case 'Pads':
        oldItem = c.padsSlot;
        c.padsSlot = item;
        break;
      case 'Ring':
        switch (ringSlot) {
          case 1:
            oldItem = c.ringSlotOne;
            c.ringSlotOne = item;
            break;
          case 2:
            oldItem = c.ringSlotTwo;
            c.ringSlotTwo = item;
            break;
          case 3:
            oldItem = c.ringSlotThree;
            c.ringSlotThree = item;
            break;
          case 4:
            oldItem = c.ringSlotFour;
            c.ringSlotFour = item;
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
    cs.addEquipmentToInv(oldItem);
    cs.deleteSingleItemFromInventory(item, 1);
    cs.updateCharacterData(this.characterInfo);
    this.onClose();
  }

  onUnequipItem(item: Equipment) {
    const c = this.characterInfo.equipped;
    const cs = this.characterInfoService;
    const type = item.type;
    switch (type) {
      case 'Armor':
        c.armorSlot = null;
        break;
      case 'Belt':
        c.beltSlot = null;
        break;
      case 'Boots':
        c.bootsSlot = null;
        break;
      case 'Belt':
        c.beltSlot = null;
        break;
      case 'Gloves':
        c.glovesSlot = null;
        break;
      case 'Helmet':
        c.helmetSlot = null;
        break;
      case 'Horse':
        c.horseSlot = null;
        break;
      case 'Sword':
      case 'Axe':
      case 'Hammer':
      case 'Bow':
      case 'Crossbow':
      case 'Wand':
      case 'Rod':
        c.leftHandSlot = null;
        break;
      case 'Shield':
        c.rightHandSlot = null;
        break;
      case 'Legs':
        c.legsSlot = null;
        break;
      case 'Necklace':
        c.necklaceSlot = null;
        break;
      case 'Pads':
        c.padsSlot = null;
        break;
      case 'Ring':
        switch (this.ringSlotNum) {
          case 1:
            c.ringSlotOne = null;
            break;
          case 2:
            c.ringSlotTwo = null;
            break;
          case 3:
            c.ringSlotThree = null;
            break;
          case 4:
            c.ringSlotFour = null;
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
    cs.addEquipmentToInv(item);
    cs.updateCharacterData(this.characterInfo);
    this.onClose();
  }

  checkIfNotShieldAndTwo() {
    const c = this.characterInfo.equipped;
    let result = true;
    if (c.leftHandSlot) {
      if (c.leftHandSlot.isTwoHanded && this.item.type === 'Shield') {
        result = false;
      }
    }
    return result;
  }

  checkIfReqLev() {
    let result = true;
    if (this.item.reqLevel > this.characterInfo.attributes.level) {
      result = false;
    }
    return result;
  }

  onClose() {
    this.itemClosed.emit();
  }
}

