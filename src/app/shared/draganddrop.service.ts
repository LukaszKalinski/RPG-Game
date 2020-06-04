import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Injectable()
export class DragAndDropService {
  equipItem(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        0);
      transferArrayItem(
        event.container.data,
        event.previousContainer.data,
        event.currentIndex,
        0,
      );
      event.container.data.splice(event.currentIndex, 1);
    }
  }

  unEquipItem(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        0);
    }
  }
}
