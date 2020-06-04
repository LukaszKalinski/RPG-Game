import { Component, OnInit } from '@angular/core';

import { Quest } from 'src/app/classes/quest.model';
import {
  faChevronCircleLeft,
  faChevronCircleRight
   } from '@fortawesome/free-solid-svg-icons';

import { ServerService } from 'src/app/shared/server-data.service';
import { QuestService } from 'src/app/shared/quest.service';

@Component({
  selector: 'app-quests-management',
  templateUrl: './quests-management.component.html',
  styleUrls: ['./quests-management.component.css']
})
export class QuestsManagementComponent implements OnInit {
  allQuests: Quest[] = [];
  itemIndex = 0;
  rightIcon = faChevronCircleRight;
  leftIcon = faChevronCircleLeft;
  selectedItem;
  itemName: string;
  itemToDo: {name: string, type: string, amount: number}[];
  itemToDoOne: {name: string, type: string, amount: number};
  itemToDoTwo: {name: string, type: string, amount: number};
  itemToDoThree: {name: string, type: string, amount: number};
  itemRewards: {name: string, amount: number}[];
  itemRewardOne: {name: string, amount: number};
  itemRewardTwo: {name: string, amount: number};
  itemRewardThree: {name: string, amount: number};
  itemIsAlreadyDone: boolean;
  itemIsRenewable: boolean;
  itemIsOpened: boolean;
  itemReqLevel: number;
  itemDesc: string;

  constructor(
    private serverService: ServerService,
    private questService: QuestService,
  ) { }

  ngOnInit(): void {
    this.allQuests = this.questService.getAllQuests();
    this.selectedItem = Object.entries(this.allQuests[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  sendAllItemsToServer(quests: Quest[]) {
    quests.forEach(data => {
      data.toDo.forEach((item, index) => {
        if (item.name === '' || item.name === null) {
          data.toDo.splice(index, 1);
        }
      });
      data.rewards.forEach((item, index) => {
        if (item.name === '' || item.name === null) {
          data.rewards.splice(index, 1);
        }
      });
    });
    this.serverService.sendAllQuestsToServer(quests);
  }

  loadAllItemsFromServer() {
    this.serverService.loadAllQuestsFromServer();
    setTimeout(() => {
      this.allQuests = this.questService.getAllQuests();
    }, 1000);
  }

  saveParticularItemInfo() {
    const c = this.allQuests[this.itemIndex];
    c.name = this.itemName;
    c.description = this.itemDesc;
    c.reqLevel = typeof(this.itemReqLevel) === 'number' ? this.itemReqLevel : parseInt(this.itemReqLevel, 10);
    c.isAlreadyDone = typeof(this.itemIsAlreadyDone) === 'string' ?
      (this.itemIsAlreadyDone === 'true' ? true : false) : this.itemIsAlreadyDone;
    c.isRenewable = typeof(this.itemIsRenewable) === 'string' ? (this.itemIsRenewable === 'true' ? true : false) : this.itemIsRenewable;
    c.isOpened = typeof(this.itemIsOpened) === 'string' ? (this.itemIsOpened === 'true' ? true : false) : this.itemIsOpened;
    this.itemToDoOne.amount = typeof(this.itemToDoOne.amount) === 'number' ?
      this.itemToDoOne.amount : parseInt(this.itemToDoOne.amount, 10);
    this.itemToDoTwo.amount = typeof(this.itemToDoTwo.amount) === 'number' ?
      this.itemToDoTwo.amount : parseInt(this.itemToDoTwo.amount, 10);
    this.itemToDoThree.amount = typeof(this.itemToDoThree.amount) === 'number' ?
      this.itemToDoThree.amount : parseInt(this.itemToDoThree.amount, 10);
    this.itemRewardOne.amount = typeof(this.itemRewardOne.amount) === 'number' ?
      this.itemRewardOne.amount : parseInt(this.itemRewardOne.amount, 10);
    this.itemRewardTwo.amount = typeof(this.itemRewardTwo.amount) === 'number' ?
      this.itemRewardTwo.amount : parseInt(this.itemRewardTwo.amount, 10);
    this.itemRewardThree.amount = typeof(this.itemRewardThree.amount) === 'number' ?
      this.itemRewardThree.amount : parseInt(this.itemRewardThree.amount, 10);
    c.toDo = [this.itemToDoOne, this.itemToDoTwo, this.itemToDoThree];
    c.rewards = [this.itemRewardOne, this.itemRewardTwo, this.itemRewardThree];
    this.loadParticularItemInfo();
  }

  loadParticularItemInfo() {
    const c = this.allQuests[this.itemIndex];
    this.itemName = c.name;
    this.itemDesc = c.description;
    this.itemReqLevel = c.reqLevel;
    this.itemIsAlreadyDone = c.isAlreadyDone;
    this.itemIsRenewable = c.isRenewable;
    this.itemIsOpened = c.isOpened;
    this.itemToDoOne = c.toDo[0] ? c.toDo[0] : {name: '', type: '', amount: 0};
    this.itemToDoTwo = c.toDo[1] ? c.toDo[1] : {name: '', type: '', amount: 0};
    this.itemToDoThree = c.toDo[2] ? c.toDo[2] : {name: '', type: '', amount: 0};
    this.itemRewardOne = c.rewards[0] ? c.rewards[0] : {name: '', amount: 0};
    this.itemRewardTwo = c.rewards[1] ? c.rewards[1] : {name: '', amount: 0};
    this.itemRewardThree = c.rewards[2] ? c.rewards[2] : {name: '', amount: 0};
  }

  createNewItem() {
    let newQuest: Quest;
    newQuest = this.createNewQuest();
    this.allQuests.push(newQuest);
    this.selectedItem = Object.entries(this.allQuests[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  createNewQuest() {
    const c = new Quest(null, [
      {name: null, type: null, amount: null}],
      [{name: null, amount: null}],
      null, null, null, null, null);
    c.name = this.itemName;
    c.description = this.itemDesc;
    c.reqLevel = typeof(this.itemReqLevel) === 'number' ? this.itemReqLevel : parseInt(this.itemReqLevel, 10);
    c.isAlreadyDone = typeof(this.itemIsAlreadyDone) === 'string' ?
      (this.itemIsAlreadyDone === 'true' ? true : false) : this.itemIsAlreadyDone;
    c.isRenewable = typeof(this.itemIsRenewable) === 'string' ? (this.itemIsRenewable === 'true' ? true : false) : this.itemIsRenewable;
    c.isOpened = typeof(this.itemIsOpened) === 'string' ? (this.itemIsOpened === 'true' ? true : false) : this.itemIsOpened;
    this.itemToDoOne.amount = typeof(this.itemToDoOne.amount) === 'number' ?
      this.itemToDoOne.amount : parseInt(this.itemToDoOne.amount, 10);
    this.itemToDoTwo.amount = typeof(this.itemToDoTwo.amount) === 'number' ?
      this.itemToDoTwo.amount : parseInt(this.itemToDoTwo.amount, 10);
    this.itemToDoThree.amount = typeof(this.itemToDoThree.amount) === 'number' ?
      this.itemToDoThree.amount : parseInt(this.itemToDoThree.amount, 10);
    this.itemRewardOne.amount = typeof(this.itemRewardOne.amount) === 'number' ?
      this.itemRewardOne.amount : parseInt(this.itemRewardOne.amount, 10);
    this.itemRewardTwo.amount = typeof(this.itemRewardTwo.amount) === 'number' ?
      this.itemRewardTwo.amount : parseInt(this.itemRewardTwo.amount, 10);
    this.itemRewardThree.amount = typeof(this.itemRewardThree.amount) === 'number' ?
      this.itemRewardThree.amount : parseInt(this.itemRewardThree.amount, 10);
    c.toDo = [this.itemToDoOne, this.itemToDoTwo, this.itemToDoThree];
    c.rewards = [this.itemRewardOne, this.itemRewardTwo, this.itemRewardThree];
    return c;
  }

  goBack() {
    if (this.itemIndex === 0) {
      this.itemIndex = this.allQuests.length - 1;
    } else {
      this.itemIndex -= 1;
    }
    this.selectedItem = Object.entries(this.allQuests[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  goForward() {
    if (this.itemIndex === this.allQuests.length - 1) {
      this.itemIndex = 0;
    } else {
      this.itemIndex += 1;
    }
    this.selectedItem = Object.entries(this.allQuests[this.itemIndex]);
    this.loadParticularItemInfo();
  }
}
