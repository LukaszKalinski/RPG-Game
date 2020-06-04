import { Equipment } from './equipment.model';

export class Quest {
  constructor(
    public name: string,
    public toDo: {name: string, type: string, amount: number}[] = null,
    public rewards: {name: string, amount: number}[] = null,
    public isAlreadyDone: boolean = false,
    public isRenewable: boolean,
    public isOpened: boolean = false,
    public reqLevel: number,
    public description: string = null,
  ) {}
}
