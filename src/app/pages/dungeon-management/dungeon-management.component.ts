import { Component, OnInit } from '@angular/core';

import { Dungeon } from 'src/app/classes/dungeon.model';
import {
  faChevronCircleLeft,
  faChevronCircleRight
   } from '@fortawesome/free-solid-svg-icons';

import { ServerService } from 'src/app/shared/server-data.service';
import { DungeonService } from 'src/app/shared/dungeon.service';

@Component({
  selector: 'app-dungeon-management',
  templateUrl: './dungeon-management.component.html',
  styleUrls: ['./dungeon-management.component.css']
})
export class DungeonManagementComponent implements OnInit {
  allDungeons: Dungeon[] = [];
  itemIndex = 0;
  rightIcon = faChevronCircleRight;
  leftIcon = faChevronCircleLeft;
  selectedItem;
  itemName: string;
  itemImage: string;
  itemDesc: string;
  itemReqLvl: number;
  itemTravellingTime: number;
  itemIsOpened: boolean;
  itemIsUnlocked: boolean;

  constructor(
    private serverService: ServerService,
    private dungeonService: DungeonService
  ) { }

  ngOnInit(): void {
    this.allDungeons = this.dungeonService.getAllDungeons();
    this.selectedItem = Object.entries(this.allDungeons[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  sendAllItemsToServer(dungeons: Dungeon[]) {
    this.serverService.sendAllDungeonsToServer(dungeons);
  }

  loadAllItemsFromServer() {
    this.serverService.loadAllDungeonsFromServer();
    setTimeout(() => {
      this.allDungeons = this.dungeonService.getAllDungeons();
    }, 1000);
  }

  saveParticularItemInfo() {
    const c = this.allDungeons[this.itemIndex];
    c.name = this.itemName;
    c.image = this.itemImage;
    c.desc = this.itemDesc;
    c.reqLev = typeof(this.itemReqLvl) === 'number' ? this.itemReqLvl : parseInt(this.itemReqLvl, 10);
    c.travelingTime = typeof(this.itemTravellingTime) === 'number' ? this.itemTravellingTime : parseInt(this.itemTravellingTime, 10);
    c.isOpened = typeof(this.itemIsOpened) === 'string' ? (this.itemIsOpened === 'true' ? true : false) : this.itemIsOpened;
    c.isUnlocked = typeof(this.itemIsUnlocked) === 'string' ? (this.itemIsUnlocked === 'true' ? true : false) : this.itemIsUnlocked;
    this.loadParticularItemInfo();
  }

  loadParticularItemInfo() {
    const c = this.allDungeons[this.itemIndex];
    this.itemName  = c.name;
    this.itemImage = c.image;
    this.itemDesc = c.desc;
    this.itemReqLvl = c.reqLev;
    this.itemTravellingTime = c.travelingTime;
    this.itemIsOpened = c.isOpened;
    this.itemIsUnlocked = c.isUnlocked;
  }

  createNewItem() {
    let newDungeon: Dungeon;
    newDungeon = this.createNewDungeon();
    this.allDungeons.push(newDungeon);
    this.selectedItem = Object.entries(this.allDungeons[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  createNewDungeon() {
    // tslint:disable-next-line: max-line-length
    const c = new Dungeon(null, null, null, null, null, null, null);
    c.name = this.itemName;
    c.image = this.itemImage;
    c.desc = this.itemDesc;
    c.reqLev = typeof(this.itemReqLvl) === 'number' ? this.itemReqLvl : parseInt(this.itemReqLvl, 10);
    c.travelingTime = typeof(this.itemTravellingTime) === 'number' ? this.itemTravellingTime : parseInt(this.itemTravellingTime, 10);
    c.isOpened = typeof(this.itemIsOpened) === 'string' ? (this.itemIsOpened === 'true' ? true : false) : this.itemIsOpened;
    c.isUnlocked = typeof(this.itemIsUnlocked) === 'string' ? (this.itemIsUnlocked === 'true' ? true : false) : this.itemIsUnlocked;
    return c;
  }

  goBack() {
    if (this.itemIndex === 0) {
      this.itemIndex = this.allDungeons.length - 1;
    } else {
      this.itemIndex -= 1;
    }
    this.selectedItem = Object.entries(this.allDungeons[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  goForward() {
    if (this.itemIndex === this.allDungeons.length - 1) {
      this.itemIndex = 0;
    } else {
      this.itemIndex += 1;
    }
    this.selectedItem = Object.entries(this.allDungeons[this.itemIndex]);
    this.loadParticularItemInfo();
  }
}
