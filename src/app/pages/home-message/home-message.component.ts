import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { ApplicationStateService } from 'src/app/shared/app-state.service';

@Component({
  selector: 'app-home-message',
  templateUrl: './home-message.component.html',
  styleUrls: ['./home-message.component.css'],
  animations: [
    trigger('mainTitleAppear', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          color: 'transparent',
          transform: 'translateY(50px)'
        }),
        animate(1000)
      ]),
    ]),
    trigger('secondTitleAppear', [
      state('in', style({
        opacity: 1,
        color: 'transparent',
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(40px)'
        }),
        animate(1200)
      ]),
    ]),
    trigger('buttonGroupAppear', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(60px)'
        }),
        animate(1200)
      ]),
    ]),
  ],
})
export class HomeMessageComponent implements OnInit {
  isMobile = false;
  isMobileSub: Subscription;
  mainTitleAppear = false;
  secondTitleAppear = false;
  buttonGroupAppear = false;
  loggedUser = null;
  loggeUserSub: Subscription;

  constructor(
    private authService: AuthService,
    private stateService: ApplicationStateService
    ) { }

  ngOnInit(): void {
    this.isMobile = this.stateService.getWidthStatus();
    this.isMobileSub = this.stateService.isMobileResolutionChanged.subscribe((data) => {
      this.isMobile = data;
    });
    this.loggedUser = this.authService.user;
    this.loggeUserSub = this.authService.user.subscribe((data) => {
      this.loggedUser = data;
    });
  }
}
