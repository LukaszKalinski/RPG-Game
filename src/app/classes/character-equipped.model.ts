import { Equipment } from './equipment.model';

export class CharacterEquippedInv {
  constructor(
    public leftHandSlot: Equipment,
    public rightHandSlot: Equipment,
    public armorSlot: Equipment,
    public helmetSlot: Equipment,
    public bootsSlot: Equipment,
    public beltSlot: Equipment,
    public necklaceSlot: Equipment,
    public ringSlotOne: Equipment,
    public ringSlotTwo: Equipment,
    public ringSlotThree: Equipment,
    public ringSlotFour: Equipment,
    public glovesSlot: Equipment,
    public legsSlot: Equipment,
    public padsSlot: Equipment,
    public horseSlot: Equipment,
    public potionSlotOne: Equipment,
    public potionSlotTwo: Equipment,
    public potionSlotThree: Equipment,
    public potionSlotFour: Equipment,
  ) {}
}
