export class CharacterQuestInfo {
  constructor(
    public questName: string,
    public isOpened: boolean,
    public isUnlocked: boolean,
    public toDoCurrent: {name: string, amount: number}[],
    public isDone: boolean = false,
    public isRewCollected: boolean = false,
  ) {}
}
