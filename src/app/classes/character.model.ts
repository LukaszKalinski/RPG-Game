import { CharacterInfo } from './character-info.model';
import { CharacterSkills } from './character-skills.model';
import { CharacterInventory } from './character-inventory.model';
import { CharacterGamePlayInfo } from './character-gameplay.model';
import { CharacterEquippedInv } from './character-equipped.model';
import { CurrentDungeonInfo } from './dungeon-current.model';
import { CurrentDungeonStats } from './dungeon-stats.model';
import { CreationStatus } from './creation-status.model';
import { CurrentCreationInfo } from './creation-current.model';
import { CharacterQuestInfo } from './quest-current.model';

export class Character {
  constructor(
    public generalInfo: CharacterInfo,
    public attributes: CharacterSkills,
    public equipped: CharacterEquippedInv,
    public inventory: CharacterInventory,
    public gamePlayInfo: CharacterGamePlayInfo,
    public currentDungeon: CurrentDungeonInfo = null,
    public currentDungeonStats: CurrentDungeonStats = null,
    public currentDungeonInventory: CharacterInventory = null,
    public creationStatus: CreationStatus[] = null,
    public currentCreation: CurrentCreationInfo = null,
    public questsInfo: CharacterQuestInfo[] = null,
  ) {}
}


