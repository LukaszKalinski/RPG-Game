import { CharacterEquippedInv } from './character-equipped.model';
import { CharacterSkills } from './character-skills.model';
import { CharacterGamePlayInfo } from './character-gameplay.model';
import { CharacterInventory } from './character-inventory.model';
import { Creature } from './creature.model';

export class CurrentDungeonStats {
  constructor(
    public equipment: CharacterEquippedInv = null,
    public charStats: CharacterSkills = null,
    public eqStats: CharacterGamePlayInfo = null,
    public inventory: CharacterInventory = null,
    public currCreature: Creature = null,
  ) {}
}
