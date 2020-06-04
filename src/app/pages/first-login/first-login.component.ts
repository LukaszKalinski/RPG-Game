import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Character } from 'src/app/classes/character.model';
import { CharacterInfo } from 'src/app/classes/character-info.model';
import { CharacterSkills } from 'src/app/classes/character-skills.model';
import { CharacterInventory } from 'src/app/classes/character-inventory.model';
import { CharacterGamePlayInfo } from 'src/app/classes/character-gameplay.model';
import { CoatOfArms } from 'src/app/classes/coatofarms.model';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';
import { CharacterEquippedInv } from 'src/app/classes/character-equipped.model';

import { CharacterService } from 'src/app/shared/character.service';
import { ServerService } from 'src/app/shared/server-data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ApplicationStateService } from 'src/app/shared/app-state.service';
import { ImagesService } from 'src/app/shared/image-service.service';

@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.component.html',
  styleUrls: ['./first-login.component.css'],
  animations: [
    trigger('nameAppear', [
      state('in', style({
        opacity: 1,
        transform: 'scale(1.0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          color: 'transparent',
          transform: 'scale(0.5)'
        }),
        animate(1000)
      ]),
    ]),
  ]
})
export class FirstLoginComponent implements OnInit {
  isMobile = false;
  isMobileSub: Subscription;
  lastLogin = null;
  loggedUser = null;
  loggeUserSub: Subscription;
  charCreateStep = 0;
  charName = null;
  coatOfArms: CoatOfArms[] = [];
  selectedProf = null;
  profDescToDisplay: string;
  maleIcon = faMars;
  femaleIcon = faVenus;
  gender = 'male';
  date = new Date();
  profDesc = ['knight', 'archer', 'wizard'];
  profDescription = this.charService.getProfTable();
  charInfo: Character = null;
  charGeneralInfo: CharacterInfo = null;
  charAttributes: CharacterSkills = null;
  charEquipped: CharacterEquippedInv = null;
  charInventory: CharacterInventory = null;
  charGamePlayInfo: CharacterGamePlayInfo = null;

  constructor(
    private stateService: ApplicationStateService,
    private imagesService: ImagesService,
    private charService: CharacterService,
    private serverService: ServerService,
    private authService: AuthService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.isMobile = this.stateService.getWidthStatus();
    this.isMobileSub = this.stateService.isMobileResolutionChanged.subscribe((data) => {
      this.isMobile = data;
    });
    this.coatOfArms.push(new CoatOfArms('knight', this.imagesService.getDirectImageUrl('knightArm')));
    this.coatOfArms.push(new CoatOfArms('archer', this.imagesService.getDirectImageUrl('archerArm')));
    this.coatOfArms.push(new CoatOfArms('wizard', this.imagesService.getDirectImageUrl('wizardArm')));

    this.loggedUser = this.authService.user;
    this.loggeUserSub = this.authService.user.subscribe((data) => {
      this.loggedUser = data;
    });
  }

  onArmIsClicked(prof: string) {
    if (this.profDescToDisplay === prof) {
      this.profDescToDisplay = null;
    } else {
      this.profDescToDisplay = prof;
      this.selectedProf = prof;
    }
  }

  onGenderChoice(gender: string) {
    if (this.charCreateStep === 0) {
      this.gender = gender;
    }
  }

  onNextStep() {
    if (this.charCreateStep === 0) {
      this.charGeneralInfo = new CharacterInfo(this.charName, 'empty', this.date.getTime());
    } else if (this.charCreateStep === 1) {
      this.charGeneralInfo.profession = this.selectedProf;
    } else if (this.charCreateStep === 2 ) {
      this.charInfo = new Character(
        this.charGeneralInfo, this.charAttributes, this.charEquipped, this.charInventory, this.charGamePlayInfo);
      this.charInfo = this.charService.charCreate(this.charInfo);
      this.serverService.sendWholeUserOnServer(this.loggedUser.id, this.charInfo);
      this.router.navigate(['/home/inventory']);
    }
    this.charCreateStep += 1;
  }

  onCharRaiseLvl(charData: Character) {
    this.charService.charRaiseLevel(charData);
  }

}
