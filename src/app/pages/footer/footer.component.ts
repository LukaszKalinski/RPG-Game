import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { IconDefinition,
  faFacebook,
  faTwitter,
  faGoogle
   } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  animations: [
    trigger('animation', [
      state('false', style({
        opacity: 0,
        transform: 'translate(-50%, 0)'
      })),
      state('true', style({
        opacity: 1,
        transform: 'translate(-50%, -20px)'
      })),
      transition('false => true', animate(300)),
      transition('true => false', animate(800)),
    ]),
  ]
})
export class FooterComponent implements OnInit {
  facebookIcon = faFacebook;
  twitterIcon = faTwitter;
  googleIcon = faGoogle;
  hover = false;

  constructor() { }

  onHover() {
    this.hover = true;
  }

  onUnHover() {
    this.hover = false;
  }

  onClick() {
  }

  ngOnInit(): void {
  }

}
