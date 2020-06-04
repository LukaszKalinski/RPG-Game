import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Validators, FormControl, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { faUserAlt, faKey, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { Character } from '../classes/character.model';

import { ApplicationStateService } from '../shared/app-state.service';
import { AuthService, AuthResponseData } from './auth.service';
import { CharacterService } from '../shared/character.service';
import { ImagesService } from '../shared/image-service.service';
import { ServerService } from '../shared/server-data.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  animations: [
    trigger('loginform', [
      state('in', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
        }),
        animate(2000)
      ]),
    ]),
  ]
})
export class AuthComponent implements OnInit {
  isLoading = false;
  error: string = null;
  isMobile = false;
  isMobileSub: Subscription;
  isLoginMode = true;
  backgroundImage = null;
  characterInfo: Character;
  characterInfoSub: Subscription;
  loginForm: FormGroup;
  userIcon = faUserAlt;
  pwdIcon = faKey;
  pwdCheckIcon = faCheckCircle;

  constructor(
    private stateService: ApplicationStateService,
    private imagesService: ImagesService,
    private router: Router,
    private characterInfoService: CharacterService,
    private authService: AuthService,
    private serverService: ServerService
  ) { }

  ngOnInit(): void {
    this.isMobile = this.stateService.getWidthStatus();
    this.isMobileSub = this.stateService.isMobileResolutionChanged.subscribe((data) => {
      this.isMobile = data;
    });
    this.characterInfo = this.characterInfoService.getCharacterInfo();
    this.characterInfoSub = this.characterInfoService.characterInfoChanged.subscribe((char) => {
      this.characterInfo = char;
    });
    this.backgroundImage = this.imagesService.getDirectImageUrl('backgroundLoginImg');
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });

  }

  onSubmit(form: FormGroup) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading =  true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      resData => {
        if (this.isLoginMode) {
          const loadingData = this.serverService.loadAllUserDataFromServer(this.authService.user.value.id).subscribe(data => {
            this.characterInfoService.updateCharacterData(data);
            this.characterInfoService.updateCharacterCreationStatusOnLoad();
            this.characterInfoService.updateCharacterQuestsStatusOnLoad();
            this.characterInfoService.regeneratingHPandMana();
            this.characterInfo.generalInfo.lastLogin = new Date().getTime();
            this.characterInfoService.updateCharacterData(this.characterInfo);
            this.isLoading = false;
            this.router.navigate(['/home/inventory']);
          });
        } else {
          this.router.navigate(['/home/firstlogin']);
        }
      },
      errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  onChangeMode() {
    this.isLoginMode = !this.isLoginMode;
    this.loginForm.reset();
  }
}
