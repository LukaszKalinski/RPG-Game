import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ApplicationStateService {
  isMobileResolutionChanged = new Subject<boolean>();
  private isMobileResolution = false;

  constructor() {
    if (window.innerWidth < 825) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

  checkWidth() {
    if (window.innerWidth < 825) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

  updateWidthStatus() {
    this.checkWidth();
    this.isMobileResolutionChanged.next(this.isMobileResolution);
  }

  getWidthStatus() {
    return this.isMobileResolution;
  }
}
