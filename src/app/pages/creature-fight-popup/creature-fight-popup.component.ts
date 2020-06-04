import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Equipment } from 'src/app/classes/equipment.model';
import { CharacterService } from 'src/app/shared/character.service';
import { EquipmentService } from 'src/app/shared/equipment.service';
import { Character } from 'src/app/classes/character.model';
import { CharacterInventory } from 'src/app/classes/character-inventory.model';

import { AuthService } from 'src/app/auth/auth.service';
import { ServerService } from 'src/app/shared/server-data.service';
import { ApplicationStateService } from 'src/app/shared/app-state.service';

@Component({
  selector: 'app-creature-fight-popup',
  templateUrl: './creature-fight-popup.component.html',
  styleUrls: ['./creature-fight-popup.component.css']
})
export class CreatureFightPopupComponent implements OnInit, OnDestroy {
  @Input() loot: {name: string, amount: number}[];
  isMobile = false;
  isMobileSub: Subscription;
  isSmallestImg = false;
  characterInfo: Character;
  characterInfoSub: Subscription;
  loggedUser = null;
  loggeUserSub: Subscription;
  dungeonInventory: CharacterInventory = {eq: null};
  freeCap = 0;

  constructor(
    private characterInfoService: CharacterService,
    private eqService: EquipmentService,
    private router: Router,
    private authService: AuthService,
    private serverService: ServerService,
    private stateService: ApplicationStateService,
  ) {}

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
    if (this.characterInfo.currentDungeonStats.charStats.hp === 0) {
      this.clearDungInventoryOnLoose();
    }
    this.freeCap = this.characterInfo.attributes.capacity - this.characterInfo.gamePlayInfo.currCap;
    this.onResize();
  }

  getEquipment(name: string) {
    return this.eqService.getEquipment(name);
  }

  allLootWeight() {
    let weight = 0;
    this.loot.forEach(data => {
      const itemWeight = this.singleLootWeight(data.name, data.amount);
      weight += itemWeight;
    });
    return weight;
  }

  singleLootWeight(item: string, num: number) {
    const weight = this.eqService.getEquipment(item).weight * num;
    return weight;
  }

  takeAllLoot() {
    this.loot.forEach((data) => {
      const item = this.eqService.getEquipment(data.name);
      item.amount = data.amount;
      this.sentItemToDungeonInventory(item);
      this.eqService.calculateEquipmentStats(this.characterInfo);
    });
    this.loot = [];
    this.onGoBack();
  }

  takeSingleLoot(loot: string, amount: number, index: number) {
    const item = this.eqService.getEquipment(loot);
    item.amount = amount;
    this.sentItemToDungeonInventory(item);
    this.loot.splice(index, 1);
  }

  sentItemToDungeonInventory(item: Equipment) {
    this.characterInfoService.sendItemTodungeonInventory(item);
  }

  clearDungInventoryOnLoose() {
    this.characterInfoService.clearDungInventoryOnLoose();
  }

  onGoBack() {
    this.router.navigate(['/home/dungeon']);
  }

  displayValue(value: number) {
    const result = this.characterInfoService.displayValue(value);
    return result;
  }

  ngOnDestroy() {
    if (this.loggedUser !== null) {
      this.serverService.sendWholeUserOnServer(this.authService.user.value.id, this.characterInfo);
    }
  }

  onResize() {
    this.isSmallestImg = window.innerHeight > 700 ? false : true;
  }
}
