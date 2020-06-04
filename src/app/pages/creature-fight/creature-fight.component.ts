import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { CurrentDungeonInfo } from 'src/app/classes/dungeon-current.model';
import { CurrentDungeonStats } from 'src/app/classes/dungeon-stats.model';
import { Character } from 'src/app/classes/character.model';
import { Creature } from 'src/app/classes/creature.model';
import { Spell } from 'src/app/classes/spell.model';

import { CharacterService } from 'src/app/shared/character.service';
import { CreatureService } from 'src/app/shared/creature.service';
import { FightService } from 'src/app/shared/fight.service';
import { ApplicationStateService } from 'src/app/shared/app-state.service';

@Component({
  selector: 'app-creature-fight',
  templateUrl: './creature-fight.component.html',
  styleUrls: ['./creature-fight.component.css']
})
export class CreatureFightComponent implements OnInit {
  isMobile = false;
  isMobileSub: Subscription;
  characterInfo: Character;
  characterInfoSub: Subscription;
  currDungeonStats: CurrentDungeonStats;
  currDungeonInfo: CurrentDungeonInfo;
  creatureFighting: Creature;
  serverCreature: Creature;
  allSpells: Spell[];
  chatboxMessages: string[] = [];
  isPlayerAttacking = true;
  isFighting = true;
  wonLoot: {name: string, amount: number}[] = [];
  actionName = 'Melee';

  constructor(
    private stateService: ApplicationStateService,
    private characterInfoService: CharacterService,
    private creatureService: CreatureService,
    private fightService: FightService
  ) {}

  ngOnInit(): void {
    this.subscriptionsOnInit();
    if (this.characterInfo.currentDungeonStats.charStats.hp === 0) {
      this.onLoose();
    }
  }

  subscriptionsOnInit() {
    this.isMobile = this.stateService.getWidthStatus();
    this.isMobileSub = this.stateService.isMobileResolutionChanged.subscribe((data) => {
      this.isMobile = data;
    });
    this.characterInfo = this.characterInfoService.getCharacterInfo();
    this.characterInfoSub = this.characterInfoService.characterInfoChanged.subscribe((char) => {
      this.characterInfo = char;
    });
    this.creatureFighting = this.characterInfo.currentDungeonStats.currCreature;
    this.serverCreature = this.creatureService.getCreature(this.creatureFighting.name);
    this.allSpells = this.fightService.getAllSpells();
  }

  changeSite() {
    this.isPlayerAttacking = !this.isPlayerAttacking;
  }

  finishFight(result: string) {
    this.isFighting = false;
  }

  onAction(actionName: string, itemName: string) {
    this.attackAction(actionName, itemName);
    this.changeSite();
    if (this.creatureFighting.hp > 0) {
      setTimeout(() => {
        this.attackAction(actionName, itemName);
        setTimeout(() => {
          this.changeSite();
        }, 500);
      }, 500);
    }
  }

  attackAction(actionName: string, itemName: string) {
    const c = this.chatboxMessages;
    const s = this.characterInfo.currentDungeonStats;
    const f = this.fightService;
    let answer;
    let action = '';
    let actionStr = '';
    switch (actionName) {
      case 'Melee':
        action = 'Melee';
        actionStr = ': You are attacking by Weapon. ';
        break;
      case 'Rune':
        action = 'Rune';
        actionStr = ': You are attacking by Rune. ';
        break;
      case 'Mana':
        action = 'Mana';
        actionStr = ': You are trying to use a spell. ';
        break;
      case 'Potion':
        action = 'Potion';
        actionStr = ': You are using Potion. ';
        break;
      default:
        break;
    }
    answer = f.onAction(action, this.isPlayerAttacking, this.characterInfo, itemName);
    this.isPlayerAttacking ? c.unshift(new Date().toLocaleTimeString() + actionStr
      + answer[1]) : c.unshift(new Date().toLocaleTimeString() + ': Your enemy is attacking. ' + answer[2]);

    if (s.currCreature.hp <= 0) {
      s.currCreature.hp = 0;
      this.onWin();
    } else if (s.charStats.hp <= 0) {
      s.charStats.hp = 0;
      this.onLoose();
    }
    const g = this.characterInfo.gamePlayInfo;
    g.currHealth = answer[0].currentDungeonStats.charStats.hp;
    g.currMana = answer[0].currentDungeonStats.charStats.mana;
    this.characterInfoService.updateCharacterData(this.characterInfo);
  }

  onWin() {
    this.chatboxMessages.unshift('You have WON!');
    this.clearSpells();
    this.characterInfo.attributes.exp += this.creatureFighting.level;
    this.characterInfoService.checkLevel(this.characterInfo);
    this.updateQuestLog();
    this.gambleLoot();
    setTimeout(() => {
      this.finishFight('Won');
    }, 500);
  }

  onLoose() {
    this.chatboxMessages.unshift('You have lost.');
    this.clearSpells();
    setTimeout(() => {
      this.finishFight('Lost');
      this.characterInfoService.clearDungInventoryOnLoose();
    }, 500);
  }

  gambleLoot() {
    this.wonLoot = this.fightService.gambleLoot(this.creatureFighting);
  }

  useItem(actionName: string, itemName: string) {
    this.onAction(actionName, itemName);
    this.actionName = 'Melee';
  }

  changeAttackType(name: string) {
    this.actionName = name;
    switch (name) {
      case 'Melee':
        this.onAction('Melee', 'Melee or Range Attack');
        break;
      default:
        break;
    }
  }

  updateQuestLog() {
    const creature = this.serverCreature;
    if (this.characterInfo.questsInfo) {
      this.characterInfoService.updateQuestLog(creature);
    }
  }

  clearSpells() {
    const s = this.characterInfo.currentDungeonStats.charStats;
    const a = this.characterInfo.attributes;
    s.strength = a.strength;
    s.accuracy = a.accuracy;
    s.magic = a.magic;
  }

  displayValue(value: number) {
    const result = this.characterInfoService.displayValue(value);
    return result;
  }

}
