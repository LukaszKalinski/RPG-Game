import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPageComponent } from './login-page/login-page.component';
import { AuthComponent } from './auth/auth.component';
import { MainComponent } from './pages/main/main.component';
import { FirstLoginComponent } from './pages/first-login/first-login.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { ShopComponent } from './pages/shop/shop.component';
import { WorldMapComponent } from './pages/world-map/world-map.component';
import { CreatureFightComponent } from './pages/creature-fight/creature-fight.component';
import { DungeonChoiceComponent } from './pages/dungeon-choice/dungeon-choice.component';
import { AuthGuard } from './auth/auth.guard';
import { EqManagementComponent } from './pages/eq-management/eq-management.component';
import { PostsComponent } from './pages/posts/posts.component';
import { CollectingComponent } from './pages/collecting/collecting.component';
import { CraftingComponent } from './pages/crafting/crafting.component';
import { CreationManagementComponent } from './pages/creation-management/creation-management.component';
import { CreatureManagementComponent } from './pages/creature-management/creature-management.component';
import { DungeonManagementComponent } from './pages/dungeon-management/dungeon-management.component';
import { QuestsComponent } from './pages/quests/quests.component';
import { MarketComponent } from './pages/market/market.component';
import { QuestsManagementComponent } from './pages/quests-management/quests-management.component';
import { SpellManagementComponent } from './pages/spell-management/spell-management.component';
import { HomeMessageComponent } from './pages/home-message/home-message.component';

const appRoutes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: MainComponent, children: [
    {path: '', component: HomeMessageComponent},
    {path: 'posts', component: PostsComponent},
    {path: 'login', component: LoginPageComponent, children: [
      {path: '', component: AuthComponent},
    ]},
    {path: 'firstlogin', component: FirstLoginComponent},
    {path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard]},
    {path: 'world-map', component: WorldMapComponent},
    {path: 'dungeon', component: DungeonChoiceComponent, canActivate: [AuthGuard]},
    {path: 'fight', component: CreatureFightComponent, canActivate: [AuthGuard]},
    {path: 'shop', component: ShopComponent, canActivate: [AuthGuard]},
    {path: 'eqman', component: EqManagementComponent, canActivate: [AuthGuard]},
    {path: 'craftman', component: CreationManagementComponent, canActivate: [AuthGuard]},
    {path: 'woodcutting', component: CollectingComponent, canActivate: [AuthGuard]},
    {path: 'mining', component: CollectingComponent, canActivate: [AuthGuard]},
    {path: 'herbology', component: CollectingComponent, canActivate: [AuthGuard]},
    {path: 'sorcery', component: CollectingComponent, canActivate: [AuthGuard]},
    {path: 'carpentry', component: CraftingComponent, canActivate: [AuthGuard]},
    {path: 'blacksmithing', component: CraftingComponent, canActivate: [AuthGuard]},
    {path: 'alchemy', component: CraftingComponent, canActivate: [AuthGuard]},
    {path: 'runecrafting', component: CraftingComponent, canActivate: [AuthGuard]},
    {path: 'creatureman', component: CreatureManagementComponent, canActivate: [AuthGuard]},
    {path: 'dungeonman', component: DungeonManagementComponent, canActivate: [AuthGuard]},
    {path: 'quests', component: QuestsComponent, canActivate: [AuthGuard]},
    {path: 'market', component: MarketComponent, canActivate: [AuthGuard]},
    {path: 'questman', component: QuestsManagementComponent, canActivate: [AuthGuard]},
    {path: 'spellman', component: SpellManagementComponent, canActivate: [AuthGuard]},
  ]},
];

@NgModule(
  {
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
  })

export class AppRoutingModule {

}
