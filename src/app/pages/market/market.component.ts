import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/classes/character.model';
import { Subscription } from 'rxjs';
import { ApplicationStateService } from 'src/app/shared/app-state.service';
import { CharacterService } from 'src/app/shared/character.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {
  isMobile = false;
  isMobileSub: Subscription;
  characterInfo: Character;
  characterInfoSub: Subscription;

  constructor(
    private stateService: ApplicationStateService,
    private characterInfoService: CharacterService,
  ) { }

  ngOnInit(): void {
    this.subscriptionsOnInit();
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
  }

}
