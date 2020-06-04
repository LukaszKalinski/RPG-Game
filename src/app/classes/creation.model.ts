export class Creation {
  constructor(
    public type: string,
    public name: string,
    public product: string,
    public amount: number = 1,
    public needs: {name: string, amount: number}[],
    public reqLv: number = 0,
    public exp: number = 1,
    public baseTime: number = 1,
  ) {}
}
