import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, query, stagger, keyframes } from '@angular/animations';
import { Subscription } from 'rxjs';

import { Character } from 'src/app/classes/character.model';
import { Dungeon } from 'src/app/classes/dungeon.model';
import {
  faChevronCircleLeft,
  faChevronCircleRight
   } from '@fortawesome/free-solid-svg-icons';

import { ApplicationStateService } from 'src/app/shared/app-state.service';
import { DungeonService } from 'src/app/shared/dungeon.service';
import { CharacterService } from 'src/app/shared/character.service';

@Component({
  selector: 'app-dungeon-choice',
  templateUrl: './dungeon-choice.component.html',
  styleUrls: ['./dungeon-choice.component.css'],
  animations: [
    trigger('entercards', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('300ms', [
          animate('.5s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-50%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(-10px) scale(1.1)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
          ]))]), { optional: true }),
      ]),
    ]),
  ]
})
export class DungeonChoiceComponent implements OnInit {
  isMobile = false;
  isMobileSub: Subscription;
  characterInfo: Character;
  characterInfoSub: Subscription;
  allDungeons: Dungeon[] = [];
  chosenDungeon: Dungeon = null;
  slides = [];
  page = 0;
  visibleItems = 6;
  visibleLines = 2;
  rightIcon = faChevronCircleRight;
  leftIcon = faChevronCircleLeft;

  constructor(
    private stateService: ApplicationStateService,
    private dungeonService: DungeonService,
    private characterInfoService: CharacterService,
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
    this.chosenDungeon = this.characterInfo.currentDungeon ?
      this.dungeonService.getDungeonInfo(this.characterInfo.currentDungeon.location) : null;
    this.allDungeons = this.dungeonService.getAllDungeons();
    this.allDungeons.forEach(dungeon => {
      if (dungeon.reqLev > this.characterInfo.attributes.level) {} else {
        dungeon.isUnlocked = true;
      }
    });
    this.slides = this.cuttingArray(this.allDungeons, this.visibleItems);
    this.onResize();
  }

  setCharacterDungeonInfo(dungeonName: string) {
    this.chosenDungeon = this.dungeonService.getDungeonInfo(dungeonName);
    this.characterInfoService.setCharacterDungeonInfo(this.chosenDungeon);
  }

  refreshVisibleCount() {
    this.visibleLines = window.innerWidth < 700 ? 1 : Math.max(1, Math.floor((window.innerHeight - 150) / 360));
    this.visibleItems = Math.max(1, Math.floor((window.innerWidth * 10 / 12 - 50) / 250));
    this.visibleItems *= this.visibleLines;
    this.slides = this.cuttingArray(this.allDungeons, this.visibleItems);
  }

  cuttingArray(arr: Dungeon[], cuttingSize: number) {
    const cuttedArr: any = [[]];
    const tempArr = [];
    for (let i = 0; i < arr.length; i += cuttingSize) {
      tempArr.push(arr.slice(i, i + cuttingSize));
    }
    return tempArr;
  }

  goBack() {
    if (this.page === 0) {
      this.page = this.slides.length - 1;
    } else {
      this.page -= 1;
    }
  }

  goForward() {
    if (this.page === this.slides.length - 1) {
      this.page = 0;
    } else {
      this.page += 1;
    }
  }

  onResize() {
    this.refreshVisibleCount();
  }

}
