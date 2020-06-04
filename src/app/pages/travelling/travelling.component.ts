import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Character } from 'src/app/classes/character.model';

import { CharacterService } from 'src/app/shared/character.service';

@Component({
  selector: 'app-travelling',
  templateUrl: './travelling.component.html',
  styleUrls: ['./travelling.component.css']
})
export class TravellingComponent implements OnInit {
  characterInfo: Character;
  characterInfoSub: Subscription;
  charSpeed = 0;
  timeLeft = 0;

  constructor(
    private characterInfoService: CharacterService,
  ) {}

  ngOnInit(): void {
    this.subscriptionsOnInit();
  }

  subscriptionsOnInit() {
    this.characterInfo = this.characterInfoService.getCharacterInfo();
    const c = this.characterInfo.currentDungeonStats;
    this.characterInfoSub = this.characterInfoService.characterInfoChanged.subscribe((char) => {
      this.characterInfo = char;
    });
    this.charSpeed = c.charStats.speed + c.eqStats.eqSpeed;
    this.startTimer();
  }

  getTime(num: number) {
    return (new Date(num).toLocaleString());
  }

  getDate(num: number) {
    const date = new Date(num);
    return date;
  }

  startTimer() {
    const finishingDate = this.characterInfo.currentDungeon.returnsTime;
    const startingCountDate = new Date().getTime();
    this.timeLeft = Math.round((finishingDate - startingCountDate) / 1000) * 1000;
    const x = setInterval(() => {
      this.timeLeft -= 1000;
      if (this.timeLeft <= 0) {
        this.characterInfo.currentDungeon.location = null;
        this.characterInfo.currentDungeon.returnsTime = null;
        clearInterval(x);
      }
    }, 1000);
  }

  onReturnImmediatelly() {
    this.timeLeft = 0;
  }
}
