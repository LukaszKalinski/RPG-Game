import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Character } from 'src/app/classes/character.model';
import {
  faCoins,
  faUserCircle,
  faGem
   } from '@fortawesome/free-solid-svg-icons';

import { CharacterService } from 'src/app/shared/character.service';
import { ApplicationStateService } from 'src/app/shared/app-state.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ServerService } from 'src/app/shared/server-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMobile = false;
  isMobileSub: Subscription;
  characterInfo: Character;
  characterInfoSub: Subscription;
  balance = 0;
  loggedUser = null;
  loggeUserSub: Subscription;
  goldIcon = faCoins;
  userIcon = faUserCircle;
  gemIcon = faGem;
  charLev = 0;
  charName = null;

  constructor(
    private characterInfoService: CharacterService,
    private stateService: ApplicationStateService,
    private authService: AuthService,
    private serverService: ServerService,
  ) { }

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
      this.balance = this.characterInfoService.getCharacterBalance() ? this.characterInfoService.getCharacterBalance() : 0;
      this.charLev = this.characterInfo.attributes.level;
      this.charName = this.characterInfo.generalInfo.name;
    });
  }

  onLogout() {
    this.serverService.sendWholeUserOnServer(this.authService.user.value.id, this.characterInfo);
    this.authService.logout();
  }

  valueDisplay(n: number) {
    const nStr: string = n.toString();
    const x = nStr.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? '.' + x[1] : '';
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
     x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
  }

  isShort() {
    let result = false;
    if (this.loggedUser) {
      result = window.innerWidth > 1160 ? false : true;
    }
    return result;
  }
}
