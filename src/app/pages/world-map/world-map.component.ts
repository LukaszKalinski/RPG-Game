import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ApplicationStateService } from 'src/app/shared/app-state.service';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.css']
})
export class WorldMapComponent implements OnInit {
  isMobile = false;
  isMobileSub: Subscription;
  isDragged = false;
  x = 0;
  y = 0;
  startX = 0;
  startY = 0;
  endX = 0;
  endY = 0;
  lastX = -500;
  lastY = -500;
  imgWidth = 0;
  imgHeight = 0;
  contWidth = 0;
  contHeight = 0;
  maxWidth = 0;
  maxHeight = 0;

  constructor(
    private stateService: ApplicationStateService,
  ) { }

  ngOnInit(): void {
    this.isMobile = this.stateService.getWidthStatus();
    this.isMobileSub = this.stateService.isMobileResolutionChanged.subscribe((data) => {
      this.isMobile = data;
    });
    this.refreshSize();
  }

  refreshSize() {
    if (!this.isMobile) {
      this.imgWidth = document.getElementById('map-image') ? document.getElementById('map-image').clientWidth : this.imgWidth;
      this.imgHeight = document.getElementById('map-image') ? document.getElementById('map-image').clientHeight : this.imgHeight;
      this.contWidth = document.getElementById('map-container') ? document.getElementById('map-container').clientWidth : this.contWidth;
      this.contHeight = document.getElementById('map-container') ? document.getElementById('map-container').clientHeight : this.contHeight;
    }
  }

  onStart() {
    this.isDragged = true;
  }

  onMove(event: MouseEvent) {
    this.refreshSize();
    if (this.isDragged) {
      this.startX = this.startX ? this.startX : event.screenX;
      this.startY = this.startY ? this.startY : event.screenY;
      this.endX = event.screenX;
      this.endY = event.screenY;
      this.maxWidth = this.contWidth - this.imgWidth;
      this.maxHeight = this.contHeight - this.imgHeight;
      this.lastX = this.x + (this.endX - this.startX);
      if (this.lastX > 0) {
        this.lastX = 0;
      } else if (this.lastX < this.maxWidth) {
        this.lastX = this.maxWidth;
      }
      this.lastY = this.y + (this.endY - this.startY);
      if (this.lastY > 0) {
        this.lastY = 0;
      } else if (this.lastY < this.maxHeight) {
        this.lastY = this.maxHeight;
      }
    }
  }

  onStop() {
    if (this.isDragged) {
      this.startX = 0;
      this.startY = 0;
      this.x = this.lastX;
      this.y = this.lastY;
      this.isDragged = false;
    }
  }
}
