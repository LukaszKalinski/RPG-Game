import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';
import { Subscription } from 'rxjs';

import { Character } from 'src/app/classes/character.model';
import { Equipment } from 'src/app/classes/equipment.model';
import { CharacterInventory } from 'src/app/classes/character-inventory.model';
import {
  faChevronCircleLeft,
  faChevronCircleRight
   } from '@fortawesome/free-solid-svg-icons';

import { CharacterService } from 'src/app/shared/character.service';
import { ApplicationStateService } from 'src/app/shared/app-state.service';
import { EquipmentService } from 'src/app/shared/equipment.service';
import { ServerService } from 'src/app/shared/server-data.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
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

export class ShopComponent implements OnInit, OnDestroy {
  isMobile = false;
  isMobileSub: Subscription;
  characterInfo: Character;
  characterInfoSub: Subscription;
  loggedUser = null;
  loggeUserSub: Subscription;
  allItems: Equipment[] = [];
  selectedItem: Equipment = null;
  isBuying = true;
  inventory: CharacterInventory = null;
  amount = 0;
  balance = 0;
  slides = [];
  page = 0;
  visibleItems = 5;
  visibleLines = 2;
  rightIcon = faChevronCircleRight;
  leftIcon = faChevronCircleLeft;
  filter = '';

  constructor(
    private characterInfoService: CharacterService,
    private stateService: ApplicationStateService,
    private serverService: ServerService,
    private eqService: EquipmentService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.subscriptionsOnInit();
    this.refreshVisibleCount();
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
    this.allItems = this.eqService.getAllEquipmentToShop();
    this.inventory = this.characterInfoService.getCharInventory();
    this.balance = this.characterInfoService.getCharacterBalance();
    this.slides = this.cuttingArray(this.allItems, this.visibleItems);
  }

  refreshVisibleCount() {
    const arrShop = this.filterEqArray(this.allItems);
    const arrInv = this.filterEqArray(this.inventory.eq);
    arrInv.forEach((data, index) => {
      if (data.sellValue === 0) {
        arrInv.splice(index, 1);
      }
    });
    this.visibleLines = window.innerWidth < 700 ? 1 : Math.floor((window.innerHeight - 150) / 272);
    this.visibleItems = Math.floor((window.innerWidth * 10 / 12 - 50) / 200);
    this.visibleItems *= this.visibleLines;
    this.slides = this.isBuying ? this.cuttingArray(arrShop, this.visibleItems) : this.cuttingArray(arrInv, this.visibleItems);
  }

  filterEqArray(arr: Equipment[]) {
    const filter = this.filter;
    const newArr = arr.filter((data) => {
      return (data.name.toLowerCase().includes(this.filter.toLowerCase()));
    });
    return newArr;
  }

  onOpenDetails(item: Equipment) {
    if (!item.name.includes('Starting')) {
      this.selectedItem = item;
    }
  }

  onCloseItem() {
    this.selectedItem = null;
  }

  onSwitchOperation() {
    this.isBuying = !this.isBuying;
    this.filter = '';
    this.refreshVisibleCount();
    this.page = 0;
  }

  onItemOperation(isBuying: boolean, item: Equipment) {
    const amount = 1 ;
    switch (isBuying) {
      case true:
        const newItemB = Object.assign({}, item);
        this.characterInfoService.buyEquipment(newItemB);
        break;
      case false:
        const newItemS = Object.assign({}, item);
        this.characterInfoService.sellEquipment(newItemS, amount);
        break;
      default:
        break;
    }
    this.balance = this.characterInfoService.getCharacterBalance();
    this.refreshVisibleCount();
  }

  cuttingArray(arr: Equipment[], cuttingSize: number) {
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
  }
}
