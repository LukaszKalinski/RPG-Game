import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';
import { Subscription } from 'rxjs';

import { Character } from 'src/app/classes/character.model';
import { Creation } from 'src/app/classes/creation.model';
import { CreationStatus } from 'src/app/classes/creation-status.model';
import {
  faChevronCircleLeft,
  faChevronCircleRight
   } from '@fortawesome/free-solid-svg-icons';

import { CreationService } from 'src/app/shared/creation.service';
import { CharacterService } from 'src/app/shared/character.service';
import { EquipmentService } from 'src/app/shared/equipment.service';
import { ServerService } from 'src/app/shared/server-data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ApplicationStateService } from 'src/app/shared/app-state.service';

@Component({
  selector: 'app-collecting',
  templateUrl: './collecting.component.html',
  styleUrls: ['./collecting.component.css'],
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
export class CollectingComponent implements OnInit, OnDestroy {
  isMobile = false;
  isMobileSub: Subscription;
  loggedUser = null;
  loggeUserSub: Subscription;
  collectingType: string;
  collectingTypeChanged: Subscription;
  characterInfo: Character;
  characterInfoSub: Subscription;
  selectedAmount = 1;
  collectingPossibilities: Creation[] = [];
  characterCreationStatus: CreationStatus[] = [];
  slides = [];
  page = 0;
  visibleItems = 6;
  visibleLines = 2;
  rightIcon = faChevronCircleRight;
  leftIcon = faChevronCircleLeft;
  isSmallestImg = false;

  constructor(
    private creationService: CreationService,
    private characterInfoService: CharacterService,
    private eqService: EquipmentService,
    private serverService: ServerService,
    private authService: AuthService,
    private stateService: ApplicationStateService,
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
    this.collectingType = this.creationService.getCollectorType();
    this.collectingTypeChanged = this.creationService.collectorTypeChanged.subscribe((coll) => {
      this.collectingType = coll;
      this.refreshVisibleCount();
    });
    this.collectingPossibilities = this.creationService.getDirectCreationList(this.collectingType);
    this.characterCreationStatus = [...this.characterInfo.creationStatus];
    this.slides = this.cuttingArray(this.collectingPossibilities, this.visibleItems);
    this.characterInfoService.verifyCollectionStatus();
    this.characterInfoService.updateCharacterData(this.characterInfo);
    this.onResize();
  }

  checkIfCollectionIsUnlocked(collectionName: string) {
    let result = false;
    this.characterCreationStatus.forEach(data => {
      if (data.creationName === collectionName) {
        result = data.isUnlocked === true ? true : false;
        return result;
      }
    });
    return result;
  }

  getProductImage(name: string) {
    const imgUrl = this.eqService.getEquipment(name).img;
    return imgUrl;
  }

  setCollection(collection: Creation) {
    const s = this.characterInfoService;
    this.selectedAmount = Math.min(100, this.selectedAmount);
    s.setCharacterCollectionInfo(collection, this.selectedAmount);
    s.updateCharacterData(this.characterInfo);
  }

  refreshVisibleCount() {
    this.visibleLines = this.isMobile ? 1 : window.innerWidth < 700 ? 1 : Math.floor((window.innerHeight - 150) / 440);
    this.visibleItems = Math.floor((window.innerWidth * 10 / 12) / 250) * this.visibleLines;
    this.visibleItems = this.isMobile ? 1 : this.visibleItems;
    this.slides = this.cuttingArray(this.collectingPossibilities, this.visibleItems);
  }

  cuttingArray(arr: Creation[], cuttingSize: number) {
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

  ngOnDestroy() {
    if (this.loggedUser !== null) {
      this.serverService.sendWholeUserOnServer(this.authService.user.value.id, this.characterInfo);
    }
  }

  onResize() {
    this.refreshVisibleCount();
    this.isSmallestImg = window.innerHeight > 565 ? false : true;
  }
}
