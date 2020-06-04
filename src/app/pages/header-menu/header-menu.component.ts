import { Component, OnInit } from '@angular/core';
import { IconDefinition,
  faBars,
  faHome,
  faToolbox,
  faGlobeAmericas,
  faDungeon,
  faGem,
  faTree,
  faFlask,
  faLeaf,
  faHammer,
  faBook,
  faTasks,
  faHandshake,
  faIndustry,
  faFire,
  faHatWizard,
   } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { CreationService } from 'src/app/shared/creation.service';
import { ApplicationStateService } from 'src/app/shared/app-state.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css']
})
export class HeaderMenuComponent implements OnInit {
  isMobile = false;
  isMobileSub: Subscription;
  loggedUser = null;
  loggeUserSub: Subscription;
  homeIcon = faHome;
  inventoryIcon = faToolbox;
  worldMapIcon = faGlobeAmericas;
  dungeonIcon = faDungeon;
  shopIcon = faGem;
  woodcuttingIcon = faTree;
  miningIcon = faIndustry;
  herbologyIcon = faLeaf;
  sorceryIcon = faBook;
  carpentryIcon = faHatWizard;
  blacksmithingIcon = faHammer;
  alchemyIcon = faFlask;
  runeIcon = faFire;
  questsIcon = faTasks;
  marketIcon = faHandshake;
  menuIcon = faBars;
  collectingType: string;
  collectingTypeChanged: Subscription;
  craftingType: string;
  craftingTypeChanged: Subscription;
  menu: {name: string, url: string, icon: IconDefinition, parent: string, creation?: string}[] = [
    {name: 'Inventory', url: 'inventory', icon: this.inventoryIcon, parent: 'inventory' },
    {name: 'Wold Map', url: 'world-map', icon: this.worldMapIcon, parent: 'adventures' },
    {name: 'Dungeon', url: 'dungeon', icon: this.dungeonIcon, parent: 'adventures' },
    {name: 'Quests', url: 'quests', icon: this.questsIcon, parent: 'adventures' },
    {name: 'Local Shop', url: 'shop', icon: this.shopIcon, parent: 'inventory' },
    // {name: 'Global Market', url: 'market', icon: this.marketIcon, parent: 'inventory' },
    {name: 'Woodcutting', url: 'woodcutting', icon: this.woodcuttingIcon, parent: 'collecting', creation: 'Woodcutting'},
    {name: 'Mining', url: 'mining', icon: this.miningIcon, parent: 'collecting', creation: 'Mining' },
    {name: 'Herbology', url: 'herbology', icon: this.herbologyIcon, parent: 'collecting', creation: 'Herbology' },
    {name: 'Sorcery', url: 'sorcery', icon: this.sorceryIcon, parent: 'collecting', creation: 'Sorcery' },
    {name: 'Carpentry', url: 'carpentry', icon: this.carpentryIcon, parent: 'crafting', creation: 'Carpentry' },
    {name: 'Blacksmithing', url: 'blacksmithing', icon: this.blacksmithingIcon, parent: 'crafting', creation: 'Blacksmithing' },
    {name: 'Alchemy', url: 'alchemy', icon: this.alchemyIcon, parent: 'crafting', creation: 'Alchemy' },
    {name: 'Rune Crafting', url: 'runecrafting', icon: this.runeIcon, parent: 'crafting', creation: 'Rune Crafting' },
    {name: 'Manage EQ', url: 'eqman', icon: this.inventoryIcon, parent: 'manage'},
    {name: 'Manage Creation', url: 'craftman', icon: this.inventoryIcon, parent: 'manage' },
    {name: 'Manage Creature', url: 'creatureman', icon: this.inventoryIcon, parent: 'manage' },
    {name: 'Manage Dungeon', url: 'dungeonman', icon: this.inventoryIcon, parent: 'manage' },
    {name: 'Manage Quests', url: 'questman', icon: this.inventoryIcon, parent: 'manage' },
    {name: 'Manage Spells', url: 'spellman', icon: this.inventoryIcon, parent: 'manage' },
  ];

  constructor(
    private creationService: CreationService,
    private authService: AuthService,
    private stateService: ApplicationStateService,
  ) {}

  ngOnInit(): void {
    this.subscriptionsOnInit();
  }

  subscriptionsOnInit() {
    this.isMobile = this.stateService.getWidthStatus();
    this.isMobileSub = this.stateService.isMobileResolutionChanged.subscribe((data) => {
      this.isMobile = data;
    });
    this.loggedUser = this.authService.user;
    this.loggeUserSub = this.authService.user.subscribe((data) => {
      this.loggedUser = data;
    });
    this.collectingType = this.creationService.getCollectorType();
    this.collectingTypeChanged = this.creationService.collectorTypeChanged.subscribe((coll) => {
      this.collectingType = coll;
    });
    this.craftingType = this.creationService.getCraftingType();
    this.craftingTypeChanged = this.creationService.craftingTypeChanged.subscribe((craft) => {
      this.craftingType = craft;
    });
  }

  changeCreationType(name: string) {
    const c = this.creationService;
    switch (name) {
      case 'Woodcutting':
        this.collectingType = 'Woodcutting';
        c.setCollectorType('Woodcutting');
        break;
      case 'Mining':
        this.collectingType = 'Mining';
        c.setCollectorType('Mining');
        break;
      case 'Herbology':
        this.collectingType = 'Herbology';
        c.setCollectorType('Herbology');
        break;
      case 'Sorcery':
        this.collectingType = 'Sorcery';
        c.setCollectorType('Sorcery');
        break;
      case 'Carpentry':
        this.craftingType = 'Carpentry';
        c.setCraftingType('Carpentry');
        break;
      case 'Blacksmithing':
        this.craftingType = 'Blacksmithing';
        c.setCraftingType('Blacksmithing');
        break;
      case 'Alchemy':
        this.craftingType = 'Alchemy';
        c.setCraftingType('Alchemy');
        break;
      case 'Rune Crafting':
        this.craftingType = 'Rune Crafting';
        c.setCraftingType('Rune Crafting');
        break;
      default:
        break;
    }
  }

  isAdmin() {
    let result = false;
    if (this.loggedUser) {
      result = this.loggedUser.email === 'luk.kalinski@gmail.com' ? true : false;
    }
    return result;
  }

  isShort() {
    let result = false;
    if (this.loggedUser) {
      result = window.innerWidth > 1060 ? false : true;
    } else {
      result = window.innerWidth > 915 ? false : true;
    }
    return result;
  }
}
