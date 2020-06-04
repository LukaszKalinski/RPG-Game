import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

import { Equipment } from 'src/app/classes/equipment.model';
import { Character } from 'src/app/classes/character.model';
import { CharacterInventory } from 'src/app/classes/character-inventory.model';
import {
  faChevronCircleLeft,
  faChevronCircleRight
   } from '@fortawesome/free-solid-svg-icons';

import { CharacterService } from 'src/app/shared/character.service';
import { EquipmentService } from 'src/app/shared/equipment.service';
import { DragAndDropService } from 'src/app/shared/draganddrop.service';
import { ApplicationStateService } from 'src/app/shared/app-state.service';

@Component({
  selector: 'app-safe-box',
  templateUrl: './safe-box.component.html',
  styleUrls: ['./safe-box.component.css']
})
export class SafeBoxComponent implements OnInit {
  isMobile = false;
  isMobileSub: Subscription;
  characterInfo: Character;
  characterInfoSub: Subscription;
  inventoryContainer: Equipment[] = [];
  eqName: string;
  selectedItem: Equipment = null;
  dungInventoryContainer: Equipment[] = [];
  isDungInv: boolean;
  inventory: CharacterInventory = null;
  backpack: CharacterInventory = null;
  slidesBox = [];
  pageBox = 0;
  visibleItemsBox = 20;
  slidesBp = [];
  pageBp = 0;
  visibleItemsBp = 20;
  rightIcon = faChevronCircleRight;
  leftIcon = faChevronCircleLeft;

  constructor(
    private characterInfoService: CharacterService,
    private dadService: DragAndDropService,
    private eqService: EquipmentService,
    private stateService: ApplicationStateService,
    ) { }

  ngOnInit(): void {
    this.subscriptionsOnInit();
    this.setInventoryToSlot();
  }

  subscriptionsOnInit() {
    this.isMobile = this.stateService.getWidthStatus();
    this.isMobileSub = this.stateService.isMobileResolutionChanged.subscribe((data) => {
      this.isMobile = data;
    });
    this.characterInfo = this.characterInfoService.getCharacterInfo();
    this.characterInfoSub = this.characterInfoService.characterInfoChanged.subscribe((char) => {
      this.characterInfo = char;
      this.refreshVisibleCount();
    });
    this.refreshVisibleCount();
  }

  setInventoryToSlot() {
    this.inventoryContainer = this.characterInfo.inventory.eq;
    this.dungInventoryContainer = this.characterInfo.currentDungeonInventory ? this.characterInfo.currentDungeonInventory.eq : [];
  }

  unEquipItem(event: CdkDragDrop<string[]>) {
    const c = this.characterInfoService;
    if (event.previousContainer.data.length === 1) {} else {
      this.dadService.unEquipItem(event);
    }
    this.inventoryContainer = [];
    this.inventoryContainer = this.createArrFromSlides(this.slidesBox);
    this.dungInventoryContainer = [];
    this.dungInventoryContainer = this.createArrFromSlides(this.slidesBp);
    c.setCharInventory(new CharacterInventory(this.inventoryContainer));
    c.setCharDungInventory(new CharacterInventory(this.dungInventoryContainer));
    c.getEquipmentStats();
    c.updateCharacterData(this.characterInfo);
    this.refreshVisibleCount();
  }

  createArrFromSlides(slides: [][]) {
    const newArr: Equipment[] = [];
    slides.forEach(line => {
      line.forEach((data) => {
        newArr.push(data);
      });
    });
    return newArr;
  }

  getEquipment(name: string) {
    this.inventoryContainer.push(this.eqService.getEquipment(name));
  }

  onOpenDetails(item: Equipment, isDungInv: boolean) {
    this.isDungInv = isDungInv;
    if (!item.name.includes('Starting')) {
      this.selectedItem = item;
    }
  }

  onCloseItem() {
    this.refreshVisibleCount();
    this.characterInfoService.getEquipmentStats();
    this.characterInfoService.updateCharacterData(this.characterInfo);
    this.selectedItem = null;
  }

  refreshVisibleCount() {
    this.inventory = this.characterInfo.inventory;
    this.backpack = this.characterInfo.currentDungeonInventory;
    const arrInv = this.inventory.eq;
    const bpInv = this.backpack.eq;
    this.visibleItemsBox = Math.floor((window.innerWidth * 10 / 12) * 0.95 / 50);
    this.slidesBox = this.cuttingArray(arrInv, this.visibleItemsBox);
    this.visibleItemsBp = Math.floor((window.innerWidth * 10 / 12) * 0.95 / 50);
    this.slidesBp = this.cuttingArray(bpInv, this.visibleItemsBp);
  }

  cuttingArray(arr: Equipment[], cuttingSize: number) {
    const cuttedArr: any = [[]];
    const tempArr = [];
    for (let i = 0; i < arr.length; i += cuttingSize) {
      tempArr.push(arr.slice(i, i + cuttingSize));
    }
    return tempArr;
  }

  goBack(container: string) {
    if (container === 'inventory') {
      if (this.pageBox === 0) {
        this.pageBox = this.slidesBox.length - 1;
      } else {
        this.pageBox -= 1;
      }
    }
    if (container === 'backpack') {
      if (this.pageBp === 0) {
        this.pageBp = this.slidesBp.length - 1;
      } else {
        this.pageBp -= 1;
      }
    }
  }

  goForward(container: string) {
    if (container === 'inventory') {
      if (this.pageBox === this.slidesBox.length - 1) {
        this.pageBox = 0;
      } else {
        this.pageBox += 1;
      }
    }
    if (container === 'backpack') {
      if (this.pageBp === this.slidesBp.length - 1) {
        this.pageBp = 0;
      } else {
        this.pageBp += 1;
      }
    }
  }

  displayValue(value: number) {
    const result = this.characterInfoService.displayValue(value);
    return result;
  }

  onResize(event: Event) {
    this.refreshVisibleCount();
    if (!this.slidesBox[this.pageBox]) {
      this.pageBox = 0;
    }
    if (!this.slidesBox[this.pageBp]) {
      this.pageBp = 0;
    }
  }
}

