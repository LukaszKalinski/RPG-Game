import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ImagesService } from 'src/app/shared/image-service.service';
import { ApplicationStateService } from 'src/app/shared/app-state.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  isMobile = false;
  isMobileSub: Subscription;
  isLoading = true;
  backgroundImage = null;

  constructor(
    private stateService: ApplicationStateService,
    private imagesService: ImagesService,
  ) { }

  ngOnInit(): void {
    this.isMobile = this.stateService.getWidthStatus();
    this.backgroundImage = this.imagesService.getDirectImageUrl('backgroundLoginImg');
    this.loadingTimeout();
  }

  loadingTimeout() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  onResize() {
    this.stateService.updateWidthStatus();
  }
}

