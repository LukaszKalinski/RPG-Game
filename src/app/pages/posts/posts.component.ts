import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, query, stagger, keyframes } from '@angular/animations';
import { Subscription } from 'rxjs';

import { SinglePost } from 'src/app/classes/post.model';

import { ApplicationStateService } from 'src/app/shared/app-state.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  animations: [
    trigger('post', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('600ms', [
          animate('.5s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateX(-50%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateX(-10px) scale(1.1)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1 }),
          ]))]), { optional: true }),
      ]),
    ]),
  ]
})
export class PostsComponent implements OnInit {
  isMobile = false;
  isMobileSub: Subscription;
  posts: SinglePost[] = [];

  constructor(
    private stateService: ApplicationStateService,
  ) { }

  ngOnInit(): void {
    this.isMobile = this.stateService.getWidthStatus();
    this.isMobileSub = this.stateService.isMobileResolutionChanged.subscribe((data) => {
      this.isMobile = data;
    });
    this.setPosts();
  }

  setPosts() {
    const newPost = new SinglePost(
      'Update',
      'Lukasz X.',
      // tslint:disable-next-line: max-line-length
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      // tslint:disable-next-line: max-line-length
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'https://cdn.searchenginejournal.com/wp-content/uploads/2016/07/update-your-content.jpg',
      new Date().getTime()
    );
    for (let i = 0; i < 7; i++) {
      this.posts.push(newPost);
    }
  }

  stringDate(date: number) {
    const newDate = new Date(date).toLocaleDateString();
    const newTime = new Date(date).toLocaleTimeString();
    const stringDate = newDate + ', ' + newTime + ' | ';
    return stringDate;
  }
}


