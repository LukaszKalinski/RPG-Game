import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthComponent } from './auth/auth.component';
import { MainComponent } from './pages/main/main.component';
import { FirstLoginComponent } from './pages/first-login/first-login.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { EquippedComponent } from './pages/equipped/equipped.component';
import { CharStatsComponent } from './pages/char-stats/char-stats.component';
import { SafeBoxComponent } from './pages/safe-box/safe-box.component';
import { SingleitemComponent } from './pages/singleitem/singleitem.component';
import { HeaderComponent } from './pages/header/header.component';
import { ShopComponent } from './pages/shop/shop.component';
import { WorldMapComponent } from './pages/world-map/world-map.component';
import { DungeonComponent } from './pages/dungeon/dungeon.component';
import { SingleCreatureComponent } from './pages/single-creature/single-creature.component';
import { CreatureFightComponent } from './pages/creature-fight/creature-fight.component';
import { FightchatboxComponent } from './pages/fightchatbox/fightchatbox.component';
import { CreatureFightPopupComponent } from './pages/creature-fight-popup/creature-fight-popup.component';
import { DungeonChoiceComponent } from './pages/dungeon-choice/dungeon-choice.component';
import { TravellingComponent } from './pages/travelling/travelling.component';
import { LoadingSpinnerComponent } from './pages/loading-spinner/loading-spinner.component';
import { AlertComponent } from './shared/alert/alert.component';
import { EqManagementComponent } from './pages/eq-management/eq-management.component';
import { PostsComponent } from './pages/posts/posts.component';
import { CollectingComponent } from './pages/collecting/collecting.component';
import { CraftingComponent } from './pages/crafting/crafting.component';
import { TravellingCollectingComponent } from './pages/travelling-collecting/travelling-collecting.component';
import { CreationManagementComponent } from './pages/creation-management/creation-management.component';
import { CreatureManagementComponent } from './pages/creature-management/creature-management.component';
import { DungeonManagementComponent } from './pages/dungeon-management/dungeon-management.component';
import { QuestsComponent } from './pages/quests/quests.component';
import { MarketComponent } from './pages/market/market.component';
import { SingleQuestComponent } from './pages/single-quest/single-quest.component';
import { SingleMarketitemComponent } from './pages/single-marketitem/single-marketitem.component';
import { QuestsManagementComponent } from './pages/quests-management/quests-management.component';
import { SpellManagementComponent } from './pages/spell-management/spell-management.component';
import { HeaderMenuComponent } from './pages/header-menu/header-menu.component';
import { FooterComponent } from './pages/footer/footer.component';
import { HomeMessageComponent } from './pages/home-message/home-message.component';

import { ImagesService } from './shared/image-service.service';
import { ApplicationStateService } from './shared/app-state.service';
import { CharacterService } from './shared/character.service';
import { DragAndDropService } from './shared/draganddrop.service';
import { EquipmentService } from './shared/equipment.service';
import { CreatureService } from './shared/creature.service';
import { DungeonService } from './shared/dungeon.service';
import { FightService } from './shared/fight.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { ServerService } from './shared/server-data.service';
import { CreationService } from './shared/creation.service';
import { QuestService } from './shared/quest.service';

import { BoldSpanPipe } from './pipes/bold-span.pipe';

import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthComponent,
    MainComponent,
    FirstLoginComponent,
    InventoryComponent,
    EquippedComponent,
    CharStatsComponent,
    SafeBoxComponent,
    SingleitemComponent,
    HeaderComponent,
    ShopComponent,
    WorldMapComponent,
    DungeonComponent,
    SingleCreatureComponent,
    CreatureFightComponent,
    FightchatboxComponent,
    CreatureFightPopupComponent,
    DungeonChoiceComponent,
    TravellingComponent,
    LoadingSpinnerComponent,
    AlertComponent,
    EqManagementComponent,
    PostsComponent,
    CollectingComponent,
    CraftingComponent,
    TravellingCollectingComponent,
    CreationManagementComponent,
    CreatureManagementComponent,
    DungeonManagementComponent,
    QuestsComponent,
    MarketComponent,
    SingleQuestComponent,
    SingleMarketitemComponent,
    QuestsManagementComponent,
    SpellManagementComponent,
    HeaderMenuComponent,
    FooterComponent,
    HomeMessageComponent,
    BoldSpanPipe,

  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatProgressBarModule,
    MatBadgeModule,
    DragDropModule,
    HttpClientModule,
    ScrollingModule,
    MatMenuModule,
    MatTabsModule,

    AngularFireModule.initializeApp(environment),
    AngularFireDatabaseModule
  ],
  exports: [],
  providers: [
    ImagesService,
    ApplicationStateService,
    CharacterService,
    DragAndDropService,
    EquipmentService,
    CreatureService,
    DungeonService,
    FightService,
    ServerService,
    CreationService,
    QuestService,
    BoldSpanPipe,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
