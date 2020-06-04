import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Character } from 'src/app/classes/character.model';
import { Creation } from 'src/app/classes/creation.model';

import { CharacterService } from 'src/app/shared/character.service';
import { CreationService } from 'src/app/shared/creation.service';

@Component({
  selector: 'app-travelling-collecting',
  templateUrl: './travelling-collecting.component.html',
  styleUrls: ['./travelling-collecting.component.css']
})
export class TravellingCollectingComponent implements OnInit {
  characterInfo: Character;
  characterInfoSub: Subscription;
  isCollecting = true;
  timeLeft = 0;
  finishedOffline = false;
  runningTimer = false;
  interval;

  constructor(
    private characterInfoService: CharacterService,
    private creationService: CreationService,
  ) { }

  ngOnInit(): void {
    this.subscriptionsOnInit();
  }

  subscriptionsOnInit() {
    this.characterInfo = this.characterInfoService.getCharacterInfo();
    this.characterInfoSub = this.characterInfoService.characterInfoChanged.subscribe((char) => {
      this.characterInfo = char;
    });
    this.checkCreationType();
    this.startTimer();
  }

  checkCreationType() {
    const creation = this.creationService.getDirectCreation(this.characterInfo.currentCreation.element);
    if (creation.type === 'Woodcutting' || creation.type === 'Mining' || creation.type === 'Herbology' || creation.type === 'Sorcery') {
      this.isCollecting = true;
    } else {
      this.isCollecting = false;
    }
  }

  getTime(num: number) {
    return (new Date(num).toLocaleString());
  }

  getDate(num: number) {
    const date = new Date(num);
    return date;
  }

  startTimer() {
    const finishingDate = this.characterInfo.currentCreation.returnsTime;
    const startingCountDate = new Date().getTime();
    this.timeLeft = Math.round((finishingDate - startingCountDate) / 1000) * 1000;
    if (finishingDate > startingCountDate) {
      this.interval = setInterval(() => {
        this.timeLeft -= 1000;
        if (this.timeLeft === 0 && this.characterInfo.currentCreation.amount !== null) {
          this.updateCollectingSkills();
          this.getProduct();
          this.timeLeft = 0;
          clearInterval(this.interval);
        } else if (this.timeLeft < 0) {
          clearInterval(this.interval);
        }
      }, 1000);
    } else if (this.characterInfo.currentCreation.amount === null) {
      clearInterval(this.interval);
    } else {
      clearInterval(this.interval);
      this.finished();
    }
  }

  getProduct() {
    const collection: Creation = this.creationService.getDirectCreation(this.characterInfo.currentCreation.element);
    const selectedAmount = this.characterInfo.currentCreation.amount;
    this.characterInfoService.addCreatedProduct(collection, selectedAmount);
  }

  updateCollectingSkills() {
    const collection = this.creationService.getDirectCreation(this.characterInfo.currentCreation.element);
    const amount = this.characterInfo.currentCreation.amount;
    this.characterInfoService.updateCreationSkills(collection, amount);
  }

  finished() {
    this.finishedOffline = true;
    setTimeout(() => {
      this.updateCollectingSkills();
      this.getProduct();
      this.finishedOffline = false;
    }, 3000);
  }

}
