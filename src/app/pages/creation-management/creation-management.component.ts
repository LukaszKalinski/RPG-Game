import { Component, OnInit } from '@angular/core';

import { Creation } from 'src/app/classes/creation.model';
import {
  faChevronCircleLeft,
  faChevronCircleRight
   } from '@fortawesome/free-solid-svg-icons';

import { CreationService } from 'src/app/shared/creation.service';
import { ServerService } from 'src/app/shared/server-data.service';

@Component({
  selector: 'app-creation-management',
  templateUrl: './creation-management.component.html',
  styleUrls: ['./creation-management.component.css']
})
export class CreationManagementComponent implements OnInit {
  allCreations: Creation[] = [];
  itemIndex = 0;
  rightIcon = faChevronCircleRight;
  leftIcon = faChevronCircleLeft;
  selectedItem;
  itemName: string;
  itemType: string;
  itemProduct: string;
  itemAmount: number;
  itemNeeds: {name: string, amount: number}[];
  itemReqLvl: number;
  itemExp: number;
  itemBaseTime: number;
  itemNeedsOne: {name: string, amount: number};
  itemNeedsTwo: {name: string, amount: number};
  itemNeedsThree: {name: string, amount: number};

  constructor(
    private serverService: ServerService,
    private creationService: CreationService
  ) { }

  ngOnInit(): void {
    this.allCreations = this.creationService.getAllCreationList();
    this.selectedItem = Object.entries(this.allCreations[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  sendAllItemsToServer(creations: Creation[]) {
    creations.forEach((data, index2) => {
      if (data.needs) {
        data.needs.forEach((rec, index) => {
          if (rec.name === '' || rec.name === null) {
            data.needs.splice(index, 1);
          }
        });
      }
    });
    this.serverService.sendAllCreationsToServer(creations);
  }

  loadAllItemsFromServer() {
    this.serverService.loadAllCreationsFromServer();
    setTimeout(() => {
      this.allCreations = this.creationService.getAllCreationList();
    }, 1000);
  }

  saveParticularItemInfo() {
    const c = this.allCreations[this.itemIndex];
    c.name = this.itemName;
    c.type = this.itemType;
    c.product = this.itemProduct;
    c.amount = typeof(this.itemAmount) === 'number' ? this.itemAmount : parseInt(this.itemAmount, 10);
    this.itemNeedsOne.amount = typeof(this.itemNeedsOne.amount) === 'number' ?
      this.itemNeedsOne.amount : parseInt(this.itemNeedsOne.amount as unknown as string, 10);
    this.itemNeedsTwo.amount = typeof(this.itemNeedsTwo.amount) === 'number' ?
      this.itemNeedsTwo.amount : parseInt(this.itemNeedsTwo.amount as unknown as string, 10);
    this.itemNeedsThree.amount = typeof(this.itemNeedsThree.amount) === 'number' ?
      this.itemNeedsThree.amount : parseInt(this.itemNeedsThree.amount as unknown as string, 10);
    c.needs = [
      this.itemNeedsOne,
      this.itemNeedsTwo,
      this.itemNeedsThree,
    ];
    c.reqLv = typeof(this.itemReqLvl) === 'number' ? this.itemReqLvl : parseInt(this.itemReqLvl, 10);
    c.exp = typeof(this.itemExp) === 'number' ? this.itemExp : parseInt(this.itemExp, 10);
    c.baseTime = typeof(this.itemBaseTime) === 'number' ? this.itemBaseTime : parseInt(this.itemBaseTime, 10);
    this.loadParticularItemInfo();
  }

  loadParticularItemInfo() {
    const c = this.allCreations[this.itemIndex];
    this.itemName = c.name;
    this.itemType = c.type;
    this.itemProduct = c.product;
    this.itemAmount = c.amount;
    this.itemNeeds = c.needs;
    if (c.type === 'Woodcutting' || c.type === 'Mining' || c.type === 'Herbology' || c.type === 'Sorcery') {
      this.itemNeedsOne =  {name: '', amount: 0};
      this.itemNeedsTwo = {name: '', amount: 0};
      this.itemNeedsThree = {name: '', amount: 0};
    } else {
      this.itemNeedsOne = c.needs[0] ? c.needs[0] : {name: '', amount: 0};
      this.itemNeedsTwo = c.needs[1] ? c.needs[1] : {name: '', amount: 0};
      this.itemNeedsThree = c.needs[2] ? c.needs[2] : {name: '', amount: 0};
    }
    this.itemReqLvl = c.reqLv;
    this.itemExp = c.exp;
    this.itemBaseTime = c.baseTime;
  }

  createNewItem() {
    let newCreation: Creation;
    newCreation = this.createNewCreation();
    this.allCreations.push(newCreation);
    this.selectedItem = Object.entries(this.allCreations[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  createNewCreation() {
    const c = new Creation(
      null, null, null, null, [{name: null, amount: null}, {name: null, amount: null}, {name: null, amount: null}], null, null, null);
    c.name = this.itemName;
    c.type = this.itemType;
    c.amount = typeof(this.itemAmount) === 'number' ? this.itemAmount : parseInt(this.itemAmount, 10);
    c.product = this.itemProduct;
    c.needs = [
      this.itemNeedsOne,
      this.itemNeedsTwo,
      this.itemNeedsThree,
    ];
    c.reqLv = typeof(this.itemReqLvl) === 'number' ? this.itemReqLvl : parseInt(this.itemReqLvl, 10);
    c.exp = typeof(this.itemExp) === 'number' ? this.itemExp : parseInt(this.itemExp, 10);
    c.baseTime = typeof(this.itemBaseTime) === 'number' ? this.itemBaseTime : parseInt(this.itemBaseTime, 10);
    return c;
  }

  goBack() {
    if (this.itemIndex === 0) {
      this.itemIndex = this.allCreations.length - 1;
    } else {
      this.itemIndex -= 1;
    }
    this.selectedItem = Object.entries(this.allCreations[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  goForward() {
    if (this.itemIndex === this.allCreations.length - 1) {
      this.itemIndex = 0;
    } else {
      this.itemIndex += 1;
    }
    this.selectedItem = Object.entries(this.allCreations[this.itemIndex]);
    this.loadParticularItemInfo();
  }

}
