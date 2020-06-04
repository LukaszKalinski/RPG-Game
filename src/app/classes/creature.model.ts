import { Equipment } from './equipment.model';

export class Creature {
  constructor(
    public name: string,
    public image: string,
    public desc: string,
    public dungeon: string,
    public rarity: number,
    public level: number,
    public hp: number,
    public mana: number,
    public type: string,
    public attack: number,
    public defence: number,
    public resistance: string,
    public resistanceLevel: number,
    public loot: {probability: number, item: string, minAmount: number, maxAmount: number}[],
  ) {}
}

