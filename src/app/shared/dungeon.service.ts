import { Injectable } from '@angular/core';

import { Dungeon } from '../classes/dungeon.model';

const dungeon = new Map<string, Dungeon>();

@Injectable()
export class DungeonService {
  constructor() {}

  getDungeonInfo(name: string) {
    const dung: Dungeon = dungeon.get(name);
    return dung;
  }

  getAllDungeons() {
    const dungeons: Dungeon[] = [];
    dungeon.forEach((data) => {
      dungeons.push(data);
    });
    return dungeons;
  }

  setDungeonsFromServer(newDungeons: Dungeon[]) {
    newDungeons.forEach(data => {
      dungeon.set(data.name, data);
    });
  }
}
