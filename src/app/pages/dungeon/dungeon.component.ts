import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Creature } from 'src/app/classes/creature.model';
import { Dungeon } from 'src/app/classes/dungeon.model';
import { Character } from 'src/app/classes/character.model';

import { CreatureService } from 'src/app/shared/creature.service';
import { ApplicationStateService } from 'src/app/shared/app-state.service';
import { DungeonService } from 'src/app/shared/dungeon.service';
import { CharacterService } from 'src/app/shared/character.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ServerService } from 'src/app/shared/server-data.service';

@Component({
  selector: 'app-dungeon',
  templateUrl: './dungeon.component.html',
  styleUrls: ['./dungeon.component.css']
})
export class DungeonComponent implements OnInit, OnDestroy {
  isMobile = false;
  isMobileSub: Subscription;
  characterInfo: Character;
  characterInfoSub: Subscription;
  loggedUser = null;
  loggeUserSub: Subscription;
  loadedDungeon: Dungeon = null;
  selectedCreature = null;
  returningDate: Date;

  constructor(
    private creatureService: CreatureService,
    private authService: AuthService,
    private stateService: ApplicationStateService,
    private dungeonService: DungeonService,
    private characterInfoService: CharacterService,
    private serverService: ServerService,
  ) { }

  ngOnInit(): void {
    this.subscriptionsOnInit();
    this.loadedDungeon = this.dungeonService.getDungeonInfo(this.characterInfo.currentDungeon.location);
    this.returningDate = new Date(this.characterInfo.currentDungeon.returnsTime);
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
  }

  getCreature(name: string) {
    return this.creatureService.getCreature(name);
  }

  getAllCreatures(name: string) {
    return this.creatureService.getAllCreatureNamesOnLocation(name);
  }

  onOpenDetails(creature: Creature) {
    if (creature) {
      this.selectedCreature = creature;
    }
  }

  onCloseCreature() {
    this.selectedCreature = null;
  }

  ngOnDestroy() {
    if (this.loggedUser !== null) {
      this.serverService.sendWholeUserOnServer(this.authService.user.value.id, this.characterInfo);
    }
  }

}
