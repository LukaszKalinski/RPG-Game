import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, style, transition, animate, query, stagger, keyframes } from '@angular/animations';
import { Subscription } from 'rxjs';

import { Character } from 'src/app/classes/character.model';
import { Quest } from 'src/app/classes/quest.model';
import { CharacterQuestInfo } from 'src/app/classes/quest-current.model';
import { IconDefinition,
  faCheckCircle,
  faLockOpen,
  faLock
   } from '@fortawesome/free-solid-svg-icons';


import { ApplicationStateService } from 'src/app/shared/app-state.service';
import { CharacterService } from 'src/app/shared/character.service';
import { QuestService } from 'src/app/shared/quest.service';
import { ServerService } from 'src/app/shared/server-data.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.css'],
  animations: [
    trigger('quests', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('300ms', [
          animate('.5s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateX(-50%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateX(-10px) scale(1.1)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1 }),
          ]))]), { optional: true }),
      ]),
    ]),
  ]
})
export class QuestsComponent implements OnInit, OnDestroy {
  isMobile = false;
  isMobileSub: Subscription;
  characterInfo: Character;
  characterInfoSub: Subscription;
  loggedUser = null;
  loggeUserSub: Subscription;
  selectedQuest: Quest = null;
  charQuestIndex = 0;
  charQuestInfo: CharacterQuestInfo = null;
  questList: CharacterQuestInfo[] = null;
  questDoneIcon = faCheckCircle;
  lockedIcon = faLock;
  unlockedIcon = faLockOpen;

  constructor(
    private stateService: ApplicationStateService,
    private characterInfoService: CharacterService,
    private questService: QuestService,
    private serverService: ServerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.subscriptionsOnInit();
  }

  subscriptionsOnInit() {
    this.isMobile = this.stateService.getWidthStatus();
    this.isMobileSub = this.stateService.isMobileResolutionChanged.subscribe((data) => {
      this.isMobile = data;
    });
    this.loggedUser = this.authService.user;
    this.loggeUserSub = this.authService.user.subscribe((data) => {
      this.loggedUser = data;
    });
    this.characterInfo = this.characterInfoService.getCharacterInfo();
    this.characterInfoSub = this.characterInfoService.characterInfoChanged.subscribe((char) => {
      this.characterInfo = char;
    });
    this.questList = this.characterInfo.questsInfo;
    this.selectedQuest = this.questService.getQuest(this.questList[this.charQuestIndex].questName);
    this.charQuestInfo = this.characterInfo.questsInfo[this.charQuestIndex];
  }

  onSelectQuest(questName: string, index: number, quest: CharacterQuestInfo) {
    const selQuest = this.questService.getQuest(questName);
    this.charQuestIndex = index;
    this.selectedQuest = selQuest;
    this.charQuestInfo = quest;
  }

  ngOnDestroy() {
    if (this.loggedUser !== null) {
      this.serverService.sendWholeUserOnServer(this.authService.user.value.id, this.characterInfo);
    }
  }
}


