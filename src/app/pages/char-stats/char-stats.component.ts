import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Character } from 'src/app/classes/character.model';
import { CharacterSkillsToDisplay } from 'src/app/classes/character-skills2Disp.model';

import { CharacterService } from 'src/app/shared/character.service';

@Component({
  selector: 'app-char-stats',
  templateUrl: './char-stats.component.html',
  styleUrls: ['./char-stats.component.css']
})
export class CharStatsComponent implements OnInit {
  characterInfo: Character;
  characterInfoSub: Subscription;
  skillsMainToDisplay: CharacterSkillsToDisplay[] = [];
  skillsToDisplay: CharacterSkillsToDisplay[] = [];

  hpMax = 0;
  manaMax = 0;
  hpPerc = 0;
  hpCurr = 0;
  manaPerc = 0;
  manaCurr = 0;
  strengthPerc = 0;
  strengthCurr = 0;
  accPerc = 0;
  accCurr = 0;
  magicPerc = 0;
  magicCurr = 0;
  speedPerc = 0;
  speedCurr = 0;
  capacityPerc = 0;
  capacityCurr = 0;

  experiencePerc = 0;
  experienceXP = 0;
  capacityGenPerc = 0;
  capacityFree = 0;
  swordPerc = 0;
  swordLev = 0;
  axePerc = 0;
  axeLev = 0;
  hammerPerc = 0;
  hammerLev = 0;
  shieldingPerc = 0;
  shieldingLev = 0;
  bowPerc = 0;
  bowLev = 0;
  crossbowPerc = 0;
  crossbowLev = 0;
  wandPerc = 0;
  wardLev = 0;
  rodPerc = 0;
  rodLev = 0;
  woodCuttingPerc = 0;
  woodCuttingLev = 0;
  carpentryPerc = 0;
  carpentryLev = 0;
  miningPerc = 0;
  miningLev = 0;
  blackSmithingPerc = 0;
  blackSmithingLev = 0;
  herbologyPerc = 0;
  herbologyLev = 0;
  alchemyPerc = 0;
  alchemyLev = 0;
  sorceryPerc = 0;
  sorceryLev = 0;
  runePerc = 0;
  runeLev = 0;

  constructor(
    private characterInfoService: CharacterService
  ) { }

  ngOnInit(): void {
    this.characterInfo = this.characterInfoService.getCharacterInfo();
    this.characterInfoSub = this.characterInfoService.characterInfoChanged.subscribe((char) => {
      this.characterInfo = char;
      this.refreshSkills();
    });
    this.refreshSkills();
    this.setLevel();
  }

  refreshSkills() {
    this.setSkills();
    this.setMainSkills();
  }

  setLevel() {
    this.characterInfoService.checkLevel(this.characterInfo);
  }

  setMainSkills() {
    const a = this.characterInfo.attributes;
    const g = this.characterInfo.gamePlayInfo;

    this.hpMax = a.hp + g.extraHP;
    this.manaMax = a.mana + g.extraMana;
    this.hpCurr = g.currHealth;
    this.hpPerc = g.currHealth / this.hpMax * 100;
    this.manaCurr = g.currMana;
    this.manaPerc = g.currMana / this.manaMax * 100;
    this.strengthPerc = 100;
    this.strengthCurr = a.strength + g.extraStrength;
    this.accPerc = 100;
    this.accCurr = a.accuracy + g.extraAccuracy;
    this.magicPerc = 100;
    this.magicCurr = a.magic + g.extraMagic;
    this.speedPerc = 100;
    this.speedCurr = a.speed + g.eqSpeed;
    this.capacityGenPerc = 100;
    this.capacityCurr = a.capacity;

    this.skillsMainToDisplay = [
      new CharacterSkillsToDisplay(
        'Hp',
        this.hpPerc,
        this.hpCurr
      ),
      new CharacterSkillsToDisplay(
        'Mana',
        this.manaPerc,
        this.manaCurr
      ),
      new CharacterSkillsToDisplay(
        'Strength',
        this.strengthPerc,
        this.strengthCurr
      ),
      new CharacterSkillsToDisplay(
        'Accuracy',
        this.accPerc,
        this.accCurr
      ),
      new CharacterSkillsToDisplay(
        'Magic',
        this.magicPerc,
        this.magicCurr
      ),
      new CharacterSkillsToDisplay(
        'Speed',
        this.speedPerc,
        this.speedCurr
      ),
      new CharacterSkillsToDisplay(
        'Capacity',
        this.capacityPerc,
        this.capacityCurr
      ),
    ];
  }

  setSkills() {
    const a = this.characterInfo.attributes;
    const s = this.characterInfoService;
    const g = this.characterInfo.gamePlayInfo;

    this.experiencePerc = s.getPercToNextLevel(a.exp);
    this.experienceXP = a.exp;
    this.capacityPerc = g.currCap / a.capacity * 100;
    this.capacityFree = a.capacity - g.currCap;
    this.swordPerc = s.getPercToNextLevel(a.swordXP);
    this.swordLev =  s.getSkillLevel(a.swordXP) + g.extraSwordSkill;
    this.axePerc = s.getPercToNextLevel(a.axeXP);
    this.axeLev =  s.getSkillLevel(a.axeXP) + g.extraAxeSkill;
    this.hammerPerc = s.getPercToNextLevel(a.hammerXP);
    this.hammerLev = s.getSkillLevel(a.hammerXP) + g.extraHammerSkill;
    this.shieldingPerc = s.getPercToNextLevel(a.shieldingXP);
    this.shieldingLev = s.getSkillLevel(a.shieldingXP) + g.extraShieldingSkill;
    this.bowPerc = s.getPercToNextLevel(a.bowXP);
    this.bowLev = s.getSkillLevel(a.bowXP) + g.extraBowSkill;
    this.crossbowPerc = s.getPercToNextLevel(a.crossbowXP);
    this.crossbowLev = s.getSkillLevel(a.crossbowXP) + g.extraCrossbowSkill;
    this.wandPerc = s.getPercToNextLevel(a.wandXP);
    this.wardLev = s.getSkillLevel(a.wandXP) + g.extraWandSkill;
    this.rodPerc = s.getPercToNextLevel(a.rodXP);
    this.rodLev = s.getSkillLevel(a.rodXP) + g.extraRodSkill;
    this.woodCuttingPerc = s.getPercToNextLevel(a.woodcuttingXP);
    this.woodCuttingLev = s.getSkillLevel(a.woodcuttingXP)  + g.extraWoodcuttingSkill;
    this.carpentryPerc = s.getPercToNextLevel(a.carpentryXP);
    this.carpentryLev = s.getSkillLevel(a.carpentryXP) + g.extraCarpentrySkill;
    this.miningPerc = s.getPercToNextLevel(a.miningXP);
    this.miningLev = s.getSkillLevel(a.miningXP)  + g.extraMiningSkill;
    this.blackSmithingPerc = s.getPercToNextLevel(a.blacksmithingXP);
    this.blackSmithingLev = s.getSkillLevel(a.blacksmithingXP)  + g.extraBlackSmithingSkill;
    this.herbologyPerc = s.getPercToNextLevel(a.herbologyXP);
    this.herbologyLev = s.getSkillLevel(a.herbologyXP)  + g.extraHerbologySkill;
    this.alchemyPerc = s.getPercToNextLevel(a.alchemyXP);
    this.alchemyLev = s.getSkillLevel(a.alchemyXP)  + g.extraAlchemySkill;
    this.sorceryPerc = s.getPercToNextLevel(a.sorceryXP);
    this.sorceryLev = s.getSkillLevel(a.sorceryXP)  + g.extraSorcerySkill;
    this.runePerc = s.getPercToNextLevel(a.runeXP);
    this.runeLev = s.getSkillLevel(a.runeXP)  + g.extraRuneCraftingSkill;

    this.skillsToDisplay = [
      new CharacterSkillsToDisplay(
        'Experience',
        this.experiencePerc,
        this.experienceXP
      ),
      new CharacterSkillsToDisplay(
        'Capacity',
        this.capacityPerc,
        this.capacityFree
      ),
      new CharacterSkillsToDisplay(
        'Sword',
        this.swordPerc,
        this.swordLev
      ),
      new CharacterSkillsToDisplay(
        'Axe',
        this.axePerc,
        this.axeLev
      ),
      new CharacterSkillsToDisplay(
        'Hammer',
        this.hammerPerc,
        this.hammerLev
      ),
      new CharacterSkillsToDisplay(
        'Shielding',
        this.shieldingPerc,
        this.shieldingLev
      ),
      new CharacterSkillsToDisplay(
        'Bow',
        this.bowPerc,
        this.bowLev
      ),
      new CharacterSkillsToDisplay(
        'Crossbow',
        this.crossbowPerc,
        this.crossbowLev
      ),
      new CharacterSkillsToDisplay(
        'Wand',
        this.wandPerc,
        this.wardLev
      ),
      new CharacterSkillsToDisplay(
        'Rod',
        this.rodPerc,
        this.rodLev
      ),
      new CharacterSkillsToDisplay(
        'Woodcutting',
        this.woodCuttingPerc,
        this.woodCuttingLev
      ),
      new CharacterSkillsToDisplay(
        'Carpentry',
        this.carpentryPerc,
        this.carpentryLev
      ),
      new CharacterSkillsToDisplay(
        'Mining',
        this.miningPerc,
        this.miningLev
      ),
      new CharacterSkillsToDisplay(
        'Blacksmithing',
        this.blackSmithingPerc,
        this.blackSmithingLev
      ),
      new CharacterSkillsToDisplay(
        'Herbology',
        this.herbologyPerc,
        this.herbologyLev
      ),
      new CharacterSkillsToDisplay(
        'Alchemy',
        this.alchemyPerc,
        this.alchemyLev
      ),
      new CharacterSkillsToDisplay(
        'Sorcery',
        this.sorceryPerc,
        this.sorceryLev
      ),
      new CharacterSkillsToDisplay(
        'Rune Crafting',
        this.runePerc,
        this.runeLev
      ),
      ];
  }

  valueDisplay(n: number) {
    const nStr: string = n.toString();
    const x = nStr.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? '.' + x[1] : '';
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
     x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
  }

  turnSmallerFont() {
    let result = false;
    if (window.innerWidth < 1200) {
      result = true;
    }
    return result;
  }

  turnSmallerView() {
    let result = false;
    if (window.innerWidth < 1200) {
      result = true;
    }
    return result;
  }
}
