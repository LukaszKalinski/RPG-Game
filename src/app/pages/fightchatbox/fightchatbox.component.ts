import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, query, style, stagger, animate, keyframes, state } from '@angular/animations';

@Component({
  selector: 'app-fightchatbox',
  templateUrl: './fightchatbox.component.html',
  styleUrls: ['./fightchatbox.component.css'],
  animations: [
    trigger('actions', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('300ms', [
          animate(1000, style({ opacity: 1}))
        ]))
      ])
    ])
  ]
})
export class FightchatboxComponent implements OnInit {
  @Input() chatboxMessages: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
