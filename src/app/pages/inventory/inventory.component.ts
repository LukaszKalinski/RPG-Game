import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';

import { Character } from 'src/app/classes/character.model';

import { CharacterService } from 'src/app/shared/character.service';
import { ServerService } from 'src/app/shared/server-data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ApplicationStateService } from 'src/app/shared/app-state.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  animations: [
    trigger('stats', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          color: 'transparent',
          transform: 'translateX(0)'
        }),
        animate(1000)
      ]),
    ]),
    trigger('eq', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          color: 'transparent',
          transform: 'translateX(0)'
        }),
        animate(1000)
      ]),
    ]),
    trigger('box', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          color: 'transparent',
          transform: 'translateY(30px)'
        }),
        animate(1000)
      ]),
    ]),
  ],

})
export class InventoryComponent implements OnInit, OnDestroy {
  isMobile = false;
  isMobileSub: Subscription;
  characterInfo: Character;
  characterInfoSub: Subscription;
  loggedUser = null;
  loggeUserSub: Subscription;

  constructor(
    private characterInfoService: CharacterService,
    private serverService: ServerService,
    private authService: AuthService,
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
  }

  ngOnDestroy() {
    if (this.loggedUser !== null) {
      this.serverService.sendWholeUserOnServer(this.authService.user.value.id, this.characterInfo);
    }
  }
}
