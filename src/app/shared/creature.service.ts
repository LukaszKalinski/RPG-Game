import { Injectable } from '@angular/core';

import { Creature } from '../classes/creature.model';

const creature = new Map<string, Creature>();
const creatureExist: {name: string, occurence: string}[] = [];

@Injectable()
export class CreatureService {
  constructor() {}

  getCreature(name: string) {
    const creat: Creature = creature.get(name);
    return creat;
  }

  getAllCreatureNamesOnLocation(location: string) {
    const creaturesList: string[] = [];
    for (const item of creatureExist) {
      if (item.occurence === location) {
        creaturesList.push(item.name);
      }
    }
    return creaturesList;
  }

  getAllCreatures() {
    const allCreature: Creature[] = [];
    creature.forEach((data) => {
      allCreature.push(data);
    });
    return allCreature;
  }

  setCreaturesFromServer(creatures: Creature[]) {
    creatures.forEach(data => {
      data.loot.forEach((rec, index) => {
        if (rec.item === null || rec.item === '') {
          data.loot.splice(index, 1);
        }
      });
      creature.set(data.name, data);
    });
    this.setCreaturesExistance(this.getAllCreatures());
  }

  setCreaturesExistance(creatures: Creature[]) {
    creatures.forEach(singleCreature => {
      const locations = singleCreature.dungeon.split(',');
      locations.forEach(dung => {
        let newDung = dung;
        if (newDung[0] === ' ') {
          newDung = newDung.slice(1);
        }
        creatureExist.push({name: singleCreature.name, occurence: newDung});
      });
    });
  }
}
