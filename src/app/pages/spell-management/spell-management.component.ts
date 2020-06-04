import { Component, OnInit } from '@angular/core';

import { Spell } from 'src/app/classes/spell.model';
import {
  faChevronCircleLeft,
  faChevronCircleRight
   } from '@fortawesome/free-solid-svg-icons';

import { ServerService } from 'src/app/shared/server-data.service';
import { FightService } from 'src/app/shared/fight.service';

@Component({
  selector: 'app-spell-management',
  templateUrl: './spell-management.component.html',
  styleUrls: ['./spell-management.component.css']
})
export class SpellManagementComponent implements OnInit {
  allSpells: Spell[] = [];
  itemIndex = 0;
  rightIcon = faChevronCircleRight;
  leftIcon = faChevronCircleLeft;
  selectedItem;
  itemName: string;
  itemMana: number;
  itemEffect: string;
  itemPerc: number;
  itemReqLev: number;
  itemProf: string;

  constructor(
    private serverService: ServerService,
    private fightService: FightService,
  ) { }

  ngOnInit(): void {
    this.allSpells = this.fightService.getAllSpells();
    this.selectedItem = Object.entries(this.allSpells[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  sendAllItemsToServer(spells: Spell[]) {
    this.serverService.sendAllSpellsToServer(spells);
  }

  loadAllItemsFromServer() {
    this.serverService.loadAllSpellsFromServer();
    setTimeout(() => {
      this.allSpells = this.fightService.getAllSpells();
    }, 1000);
  }

  saveParticularItemInfo() {
    const c = this.allSpells[this.itemIndex];
    c.name = this.itemName;
    c.mana = typeof(this.itemMana) === 'number' ? this.itemMana : parseInt(this.itemMana, 10);
    c.effect = this.itemEffect;
    c.reqLev = typeof(this.itemReqLev) === 'number' ? this.itemReqLev : parseInt(this.itemReqLev, 10);
    c.perc = typeof(this.itemPerc) === 'number' ? this.itemPerc : parseInt(this.itemPerc, 10);
    c.prof = this.itemProf;
    this.loadParticularItemInfo();
  }

  loadParticularItemInfo() {
    const c = this.allSpells[this.itemIndex];
    this.itemName = c.name;
    this.itemMana = c.mana;
    this.itemEffect = c.effect;
    this.itemReqLev = c.reqLev;
    this.itemPerc = c.perc;
    this.itemProf = c.prof;
  }

  createNewItem() {
    let newSpell: Spell;
    newSpell = this.createNewSpell();
    this.allSpells.push(newSpell);
    this.selectedItem = Object.entries(this.allSpells[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  createNewSpell() {
    const c = new Spell(null, null, null, null, null, null);
    c.name = this.itemName;
    c.mana = typeof(this.itemMana) === 'number' ? this.itemMana : parseInt(this.itemMana, 10);
    c.effect = this.itemEffect;
    c.reqLev = typeof(this.itemReqLev) === 'number' ? this.itemReqLev : parseInt(this.itemReqLev, 10);
    c.perc = typeof(this.itemPerc) === 'number' ? this.itemPerc : parseInt(this.itemPerc, 10);
    c.prof = this.itemProf;
    return c;
  }

  goBack() {
    if (this.itemIndex === 0) {
      this.itemIndex = this.allSpells.length - 1;
    } else {
      this.itemIndex -= 1;
    }
    this.selectedItem = Object.entries(this.allSpells[this.itemIndex]);
    this.loadParticularItemInfo();
  }

  goForward() {
    if (this.itemIndex === this.allSpells.length - 1) {
      this.itemIndex = 0;
    } else {
      this.itemIndex += 1;
    }
    this.selectedItem = Object.entries(this.allSpells[this.itemIndex]);
    this.loadParticularItemInfo();
  }
}
