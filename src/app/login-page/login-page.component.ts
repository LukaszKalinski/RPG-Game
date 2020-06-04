import { Component, OnInit } from '@angular/core';

import { faUserAlt, faKey } from '@fortawesome/free-solid-svg-icons';
import { EquipmentService } from '../shared/equipment.service';
import { ServerService } from '../shared/server-data.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginMode = true;
  backgroundImage = null;
  userIcon = faUserAlt;
  pwdIcon = faKey;

  constructor(
    private serverService: ServerService,
    private eqService: EquipmentService,
  ) { }

  ngOnInit(): void {
    this.loadDataFromServer();
  }

  loadDataFromServer() {
    const list = this.eqService.getAllEquipment();
    if (list.length === 0) {
      this.serverService.loadAllEquipmentFromServer();
      this.serverService.loadAllCreationsFromServer();
      this.serverService.loadAllCreaturesFromServer();
      this.serverService.loadAllDungeonsFromServer();
      this.serverService.loadAllQuestsFromServer();
      this.serverService.loadAllSpellsFromServer();
    }
  }
}
