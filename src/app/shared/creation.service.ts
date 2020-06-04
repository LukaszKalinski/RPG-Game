import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Creation } from '../classes/creation.model';
import { CreationStatus } from '../classes/creation-status.model';
import { Character } from '../classes/character.model';

const creationList: Creation[] = [];

@Injectable()
export class CreationService {
  collectorTypeChanged = new Subject<string>();
  private collectorType = 'Woodcutting';
  craftingTypeChanged = new Subject<string>();
  private craftingType = 'Carpentry';

  constructor() {}

  setCollectorType(name: string) {
    this.collectorType = name;
    this.collectorTypeChanged.next(name);
  }

  setCraftingType(name: string) {
    this.craftingType = name;
    this.craftingTypeChanged.next(name);
  }

  getCollectorType() {
    return this.collectorType;
  }

  getCraftingType() {
    return this.craftingType;
  }

  getAllCreationList() {
    return creationList;
  }

  getAllCreationStatusList() {
    const arr: CreationStatus[] = this.createCreationStatusList();
    return arr;
  }

  getDirectCreationList(name: string) {
    const arr: Creation[] = [];
    creationList.forEach(data => {
      if (data.type === name) {
        arr.push(data);
      }
    });
    return arr;
  }

  getDirectCreation(name: string) {
    let arr: Creation = null;
    creationList.forEach(data => {
      if (data.name === name) {
        arr = data;
      }
    });
    return arr;
  }

  createCreationStatusList() {
    let arr: CreationStatus[] = [];
    creationList.forEach(data => {
      if (data) {
        const isUnlocked = data.reqLv > 0 ? false : true;
        if (arr.length > 0) {
          arr.push(new CreationStatus('Recipe - ' + data.name, data.name, isUnlocked));
        } else {
          arr = [new CreationStatus('Recipe - ' + data.name, data.name, isUnlocked)];
        }
      }
    });
    return arr;
  }

  unlockRecipe(name: string, charData: Character) {
    charData.creationStatus.forEach(data => {
      if (data.name === name) {
        data.isUnlocked = true;
      }
    });
    return charData;
  }

  setCreationsFromServer(data: Creation[]) {
    data.forEach(creation => {
      if (creation.type === 'Carpentry' || creation.type === 'Blacksmithing' ||
        creation.type === 'Alchemy' || creation.type === 'Rune Crafting') {
        creation.needs.forEach((rec, index) => {
          if (rec.name === '' || rec.name === null) {
            creation.needs.splice(index, 1);
          }
        });
      }
      creationList.push(creation);
    });
  }
}
