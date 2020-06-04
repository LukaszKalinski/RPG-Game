import { Injectable } from '@angular/core';

import { Quest } from '../classes/quest.model';
import { CharacterQuestInfo } from '../classes/quest-current.model';

const quests = new Map<string, Quest>();

@Injectable()
export class QuestService {

  getQuest(name: string) {
    const quest: Quest = quests.get(name);
    return quest;
  }

  getAllQuests() {
    const allQuests: Quest[] = [];
    quests.forEach((data) => {
      allQuests.push(data);
    });
    return allQuests;
  }

  setQuestsFromServer(questList: Quest[]) {
    questList.forEach(data => {
      data.toDo.forEach((todo, index) => {
        if (todo.name === '' || todo.name === null) {
          data.toDo.splice(index, 1);
        }
      });
      data.rewards.forEach((rew, index) => {
        if (rew.name === '' || rew.name === null) {
          data.rewards.splice(index, 1);
        }
      });
      quests.set(data.name, data);
    });
  }

  createQuestsStatusList() {
    let arr: CharacterQuestInfo[] = [];
    quests.forEach(data => {
      if (data) {
        const isUnlocked = data.reqLevel > 0 ? false : true;
        const toDoCurrArr: {name: string, amount: number}[] = [];
        data.toDo.forEach(rec => {
          toDoCurrArr.push({name: rec.name, amount: rec.amount});
        });
        if (arr.length > 0) {
          arr.push(new CharacterQuestInfo(data.name, false, isUnlocked, toDoCurrArr, false, false));
        } else {
          arr = [new CharacterQuestInfo(data.name, false, isUnlocked, toDoCurrArr, false, false)];
        }
      }
    });
    return arr;
  }
}
