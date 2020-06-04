import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Character } from '../classes/character.model';
import { CurrentDungeonInfo } from '../classes/dungeon-current.model';
import { CurrentDungeonStats } from '../classes/dungeon-stats.model';
import { Equipment } from '../classes/equipment.model';
import { Creation } from '../classes/creation.model';
import { CurrentCreationInfo } from '../classes/creation-current.model';
import { Dungeon } from '../classes/dungeon.model';
import { Creature } from '../classes/creature.model';
import { Quest } from '../classes/quest.model';
import { Spell } from '../classes/spell.model';

import { EquipmentService } from './equipment.service';
import { CreationService } from './creation.service';
import { DungeonService } from './dungeon.service';
import { CreatureService } from './creature.service';
import { QuestService } from './quest.service';
import { FightService } from './fight.service';

import { environment } from 'src/environments/environment';

@Injectable()
export class ServerService {

  constructor(
    private http: HttpClient,
    private eqService: EquipmentService,
    private creationService: CreationService,
    private dungeonService: DungeonService,
    private creatureService: CreatureService,
    private questService: QuestService,
    private fightService: FightService,
  ) {}

  sendWholeUserOnServer(userId: string, charData: Character) {
    this.http
    .put(environment.firebaseConfig.databaseURL + '/' + userId + '.json', charData)
    .subscribe(response => {
      // console.log(response);
    });
  }

  loadAllUserDataFromServer(userId: string) {
    const url = environment.firebaseConfig.databaseURL + '/' + userId + '.json';
    return this.http
    .get<Character>(
      url
    ).pipe(
      map((data: Character) => {
        if (data.currentDungeon) {} else {
          data.currentDungeon = new CurrentDungeonInfo(null, null);
        }
        if (data.currentCreation) {} else {
          data.currentCreation = new CurrentCreationInfo(null, null, null, null);
        }
        if (data.currentDungeonStats) {} else {
          data.currentDungeonStats = new CurrentDungeonStats(null, null, null, null, null);
        }
        const currTime = new Date().getTime();
        if (data.currentDungeon.returnsTime) {
          if (data.currentDungeon.returnsTime < currTime) {
            data.currentDungeon = new CurrentDungeonInfo(null, null);
          }
        }
        return data;
      }),
      tap(data => {
        // console.log(data);
      })
    );
  }

  sendAllEquipmentToServer(eq: Equipment[]) {
    this.http
    .put(environment.firebaseConfig.databaseURL + '/allEq.json', eq)
    .subscribe(response => {
      // console.log(response);
    });
  }

  loadAllEquipmentFromServer() {
    const url = environment.firebaseConfig.databaseURL + '/allEq.json';
    return this.http
    .get<Equipment[]>(
      url
    ).pipe(
      map((data: Equipment[]) => {
        return data;
      }),
      tap(data => {
        this.eqService.setEqFromServer(data);
      })
    ).subscribe();
  }

  sendAllCreationsToServer(creations: Creation[]) {
    this.http
    .put(environment.firebaseConfig.databaseURL + '/allCreations.json', creations)
    .subscribe(response => {
      // console.log(response);
    });
  }

  loadAllCreationsFromServer() {
    const url = environment.firebaseConfig.databaseURL + '/allCreations.json';
    return this.http
    .get<Creation[]>(
      url
    ).pipe(
      map((data: Creation[]) => {
        return data;
      }),
      tap(data => {
        this.creationService.setCreationsFromServer(data);
      })
    ).subscribe();
  }

  sendAllCreaturesToServer(creatures: Creature[]) {
    this.http
    .put(environment.firebaseConfig.databaseURL + '/allCreatures.json', creatures)
    .subscribe(response => {
      // console.log(response);
    });
  }

  loadAllCreaturesFromServer() {
    const url = environment.firebaseConfig.databaseURL + '/allCreatures.json';
    return this.http
    .get<Creature[]>(
      url
    ).pipe(
      map((data: Creature[]) => {
        return data;
      }),
      tap(data => {
        this.creatureService.setCreaturesFromServer(data);
      })
    ).subscribe();
  }

  sendAllDungeonsToServer(dungeons: Dungeon[]) {
    this.http
    .put(environment.firebaseConfig.databaseURL + '/allDungeons.json', dungeons)
    .subscribe(response => {
      // console.log(response);
    });
  }

  loadAllDungeonsFromServer() {
    const url = environment.firebaseConfig.databaseURL + '/allDungeons.json';
    return this.http
    .get<Dungeon[]>(
      url
    ).pipe(
      map((data: Dungeon[]) => {
        return data;
      }),
      tap(data => {
        this.dungeonService.setDungeonsFromServer(data);
      })
    ).subscribe();
  }

  sendAllQuestsToServer(quests: Quest[]) {
    this.http
    .put(environment.firebaseConfig.databaseURL + '/allQuests.json', quests)
    .subscribe(response => {
      // console.log(response);
    });
  }

  loadAllQuestsFromServer() {
    const url = environment.firebaseConfig.databaseURL + '/allQuests.json';
    return this.http
    .get<Quest[]>(
      url
    ).pipe(
      map((data: Quest[]) => {
        return data;
      }),
      tap(data => {
        this.questService.setQuestsFromServer(data);
      })
    ).subscribe();
  }

  sendAllSpellsToServer(spells: Spell[]) {
    this.http
    .put(environment.firebaseConfig.databaseURL + '/allSpells.json', spells)
    .subscribe(response => {
      // console.log(response);
    });
  }

  loadAllSpellsFromServer() {
    const url = environment.firebaseConfig.databaseURL + '/allSpells.json';
    return this.http
    .get<Spell[]>(
      url
    ).pipe(
      map((data: Spell[]) => {
        return data;
      }),
      tap(data => {
        this.fightService.setSpellsFromServer(data);
      })
    ).subscribe();
  }
}
