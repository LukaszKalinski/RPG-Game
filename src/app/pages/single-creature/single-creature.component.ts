import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Creature } from 'src/app/classes/creature.model';
import { Character } from 'src/app/classes/character.model';

import { CharacterService } from 'src/app/shared/character.service';
import { ApplicationStateService } from 'src/app/shared/app-state.service';

@Component({
  selector: 'app-single-creature',
  templateUrl: './single-creature.component.html',
  styleUrls: ['./single-creature.component.css']
})
export class SingleCreatureComponent implements OnInit {
  @Input() creature: Creature;
  @Output() creatureClosed = new EventEmitter<void>();
  isMobile = false;
  isSmallest = false;
  isMobileSub: Subscription;
  characterInfo: Character;
  characterInfoSub: Subscription;
  stringCreature: {name: string, item: any}[] = [];

  constructor(
    private router: Router,
    private characterInfoService: CharacterService,
    private stateService: ApplicationStateService,
  ) { }

  ngOnInit(): void {
    this.subscriptionsOnInit();
    this.createStringItem();
  }

  subscriptionsOnInit() {
    this.isMobile = this.stateService.getWidthStatus();
    this.isMobileSub = this.stateService.isMobileResolutionChanged.subscribe((data) => {
      this.isMobile = data;
    });
    this.characterInfo = this.characterInfoService.getCharacterInfo();
    this.characterInfoSub = this.characterInfoService.characterInfoChanged.subscribe((char) => {
      this.characterInfo = char;
    });
    this.onResize();
  }

  createStringItem() {
    this.stringCreature = [
      {name: 'Name', item: this.creature.name},
      {name: 'Image', item: this.creature.image},
      {name: 'Description', item: this.creature.desc},
      {name: 'Dungeon', item: this.creature.dungeon},
      {name: 'Rarity', item: this.creature.rarity},
      {name: 'Experience', item: this.creature.level},
      {name: 'HP', item: this.creature.hp},
      {name: 'Mana', item: this.creature.mana},
      {name: 'Type', item: this.creature.type},
      {name: 'Attack', item: this.creature.attack},
      {name: 'Defence', item: this.creature.defence},
      {name: 'Resistance', item: this.creature.resistance},
      {name: 'Resistance Level', item: this.creature.resistanceLevel},
      {name: 'loot', item: {loot: this.creature.loot}},
    ];
  }

  onFightCreature() {
    this.setCreatureInCharData(this.creature);
    this.router.navigate(['/home/fight']);
  }

  setCreatureInCharData(creature: Creature) {
    this.characterInfo.currentDungeonStats.currCreature = new Creature(
      creature.name,
      creature.image,
      creature.desc,
      creature.dungeon,
      creature.rarity,
      creature.level,
      creature.hp,
      creature.mana,
      creature.type,
      creature.attack,
      creature.defence,
      creature.resistance,
      creature.resistanceLevel,
      creature.loot);
    this.characterInfoService.updateCharacterData(this.characterInfo);
  }

  onClose() {
    this.creatureClosed.emit();
  }

  onResize() {
    this.isSmallest = window.innerHeight > 700 ? false : true;
  }
}
