import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

import { AppConfig } from '../../app/config/app.config';
import { AppData } from '../../shared/services/app-data';

import { HomePage } from '../home/home';
import { MessagesPage } from '../messages/messages';
import { DocumentsPage } from '../documents/documents';
import { WallsPage } from '../walls/walls';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html',
  providers:[Network]
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = MessagesPage;
  tab3Root: any = DocumentsPage;
  tab4Root: any = WallsPage;
  tab5Root: any = SettingsPage;

  homeTab: string = "Home";
  messagesTab: string = "Messages";
  documentsTab: string = "Documents";
  wallsTab: string = "Walls";
  settingsTab: string = "Settings";

  constructor(public navCtrl: NavController, private _config: AppConfig, private appData: AppData) {
    this.appData.getLanguage().subscribe(selectedLang => {
      this.homeTab = this._config.getModuleLangVars("tabs", "home", selectedLang);
      this.messagesTab = this._config.getModuleLangVars("tabs", "messages", selectedLang);
      this.documentsTab = this._config.getModuleLangVars("tabs", "documents", selectedLang);
      this.wallsTab = this._config.getModuleLangVars("tabs", "walls", selectedLang);
      this.settingsTab = this._config.getModuleLangVars("tabs", "settings", selectedLang);
    });
  }
}
