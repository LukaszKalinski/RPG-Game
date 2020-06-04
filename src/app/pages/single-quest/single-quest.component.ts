import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { Quest } from 'src/app/classes/quest.model';
import { Character } from 'src/app/classes/character.model';
import { CharacterQuestInfo } from 'src/app/classes/quest-current.model';

import { CharacterService } from 'src/app/shared/character.service';
import { EquipmentService } from 'src/app/shared/equipment.service';
import { CreatureService } from 'src/app/shared/creature.service';
import { ApplicationStateService } from 'src/app/shared/app-state.service';

import { BoldSpanPipe } from 'src/app/pipes/bold-span.pipe';

@Component({
  selector: 'app-single-quest',
  templateUrl: './single-quest.component.html',
  styleUrls: ['./single-quest.component.css']
})
export class SingleQuestComponent implements OnInit, OnChanges {
  @Input() selectedQuest: Quest;
  @Input() charQuestInfo: CharacterQuestInfo;
  @Input() charQuestIndex: number;
  isMobile = false;
  isSmallest = false;
  isMobileSub: Subscription;
  characterInfo: Character;
  characterInfoSub: Subscription;

  constructor(
    private characterInfoService: CharacterService,
    private eqService: EquipmentService,
    private creatureService: CreatureService,
    private stateService: ApplicationStateService,
    private boldTextPipe: BoldSpanPipe,
  ) { }

  ngOnInit(): void {
    this.subscriptionsOnInit();
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
    this.characterInfo.questsInfo[this.charQuestIndex].isDone = this.checkIfQuestIsFinished();
    this.onResize();
  }

  boldText() {
    let result = this.selectedQuest.description;
    result = result ? this.boldDesc(this.selectedQuest.toDo) : '';
    return result;
  }

  boldDesc(res: {name: string, type: string, amount: number}[]) {
    const staticChanges: string[] = ['quest', 'dungeon', 'kill', 'decrease'];
    let result = this.selectedQuest.description ? this.selectedQuest.description : '';
    if (result) {
      staticChanges.forEach((data) => {
        if (data) {
          result = this.boldTextPipe.replace(result, ' ' + data + ' ');
          result = this.boldTextPipe.replace(result, ' ' + data + 's');
          result = this.boldTextPipe.replace(result, ' ' + data + ',');
          result = this.boldTextPipe.replace(result, ' ' + data + '.');
          result = this.boldTextPipe.replace(result, ' ' + data + '!');
        }
      });
      res.forEach((data, index) => {
        if (data.name) {
          result = this.boldTextPipe.replace(result, ' ' + res[index].name + ' ');
          result = this.boldTextPipe.replace(result, ' ' + res[index].name + 's');
        }
      });
    }
    return result;
  }

  checkIfQuestIsFinished() {
    let isFinished = false;
    if (this.charQuestInfo.isOpened) {
      this.charQuestInfo.toDoCurrent.forEach((curr, currIndex) => {
        this.selectedQuest.toDo.forEach((quest, qIndex) => {
          if (currIndex === qIndex) {
            if (curr.amount >= quest.amount) {
              isFinished = true;
            } else {
              return false;
            }
          }
        });
      });
    }
    return isFinished;
  }

  getLootImage(name: string) {
    const imgUrl = this.eqService.getEquipment(name).img;
    return imgUrl;
  }

  getCreatureImage(name: string) {
    const imgUrl = this.creatureService.getCreature(name).image;
    return imgUrl;
  }

  onOpenQuest() {
    const q = this.characterInfo.questsInfo;
    q[this.charQuestIndex].isOpened = true;
    q[this.charQuestIndex].isRewCollected = false;
    q[this.charQuestIndex].isDone = false;
    q[this.charQuestIndex].toDoCurrent.forEach(data => {
      data.amount = 0;
    });
    this.charQuestInfo = q[this.charQuestIndex];
    this.characterInfoService.updateCharacterData(this.characterInfo);
  }

  onReopen() {
    const q = this.characterInfo.questsInfo;
    q[this.charQuestIndex].isRewCollected = false;
    q[this.charQuestIndex].isOpened = true;
    q[this.charQuestIndex].isDone = false;
    q[this.charQuestIndex].toDoCurrent.forEach(data => {
      data.amount = 0;
    });
    this.charQuestInfo = q[this.charQuestIndex];
    this.characterInfoService.updateCharacterData(this.characterInfo);
  }

  onClaimRewards() {
    const q = this.characterInfo.questsInfo;
    q[this.charQuestIndex].isRewCollected = true;
    q[this.charQuestIndex].isOpened = false;
    q[this.charQuestIndex].isDone = false;
    this.addRewardsToInventory(this.selectedQuest.rewards);
    this.charQuestInfo = q[this.charQuestIndex];
    this.characterInfoService.updateCharacterData(this.characterInfo);
  }

  addRewardsToInventory(rewards: {name: string, amount: number}[]) {
    rewards.forEach(data => {
      const eq = this.eqService.getEquipment(data.name);
      eq.amount = data.amount;
      this.characterInfoService.addEquipmentToInv(eq);
    });
  }

  displayValue(value: number) {
    const result = this.characterInfoService.displayValue(value);
    return result;
  }

  ngOnChanges() {
    if (this.characterInfo) {
      this.characterInfo.questsInfo[this.charQuestIndex].isDone = this.checkIfQuestIsFinished();
    }
  }

  onResize() {
    this.isSmallest = window.innerWidth > 460 ? false : true;
  }
}
