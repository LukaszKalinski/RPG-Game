export class Dungeon {
  constructor(
    public name: string,
    public image: string,
    public desc: string,
    public reqLev: number,
    public travelingTime: number,
    public isOpened: boolean = false,
    public isUnlocked: boolean = false,
  ) {}
}
