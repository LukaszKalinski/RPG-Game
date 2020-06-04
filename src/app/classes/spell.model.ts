export class Spell {
  constructor(
    public name: string,
    public mana: number,
    public effect: string,
    public perc: number,
    public reqLev: number,
    public prof: string = 'any',
  ) {}
}
