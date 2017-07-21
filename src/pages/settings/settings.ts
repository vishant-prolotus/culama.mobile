import { Component , OnInit} from '@angular/core';

import { NavController } from 'ionic-angular';
import { ProfilePage } from './profile/profile';
import { LanguagePage } from './language/language';
import { LanguagesPage } from '../registration/languages/languages';

import { AppConfig } from '../../app/config/app.config';
import { AppData } from '../../shared/services/app-data';

declare var $;
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage implements OnInit{
  settingsStr: string = "Settings";
  backgroundColor;
  settingPageStr: any = {
    profile: "Profile",
    language: "Language",
    helpContact: "Help & contacts",
    logout: "Log out"
  };

  constructor(public navCtrl: NavController, private _config: AppConfig, private appData: AppData) {
    this.appData.getLanguage().subscribe(selectedLang => {
      this.backgroundColor = this.appData.getBackgroundContrastColor();
      this.settingsStr = this._config.getModuleLangVars("tabs", "settings", selectedLang);
      for (let property in this.settingPageStr) {
        this.settingPageStr[property] = this._config.getModuleLangVars("setting", property, selectedLang);
      }
    });
  }
  ngOnInit(){
    $('.toolbar-background').css({"background-color":this.backgroundColor});
  }
  push(page) {
    if (page == 1)
      this.navCtrl.push(ProfilePage, {}, { animate: true, animation: 'md-transition', direction: 'forward', duration: 500 });
    else
      this.navCtrl.push(LanguagePage, {}, { animate: true, animation: 'md-transition', direction: 'forward', duration: 500 });
  }
  logout(){
    this.appData.reset();
    this.navCtrl.push(LanguagesPage, {}, { animate: true, animation: 'md-transition', direction: 'back', duration: 500 });
  }
}
