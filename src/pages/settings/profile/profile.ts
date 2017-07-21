import { Component , OnInit} from '@angular/core';
import { NavController, ViewController, Config } from 'ionic-angular';

import { AppConfig } from '../../../app/config/app.config';
import { AppData } from '../../../shared/services/app-data';

declare var $;
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit {
  profileStr: string = "Profile";
  profilePageStr: any;
  backgroundColor;

  constructor(public navCtrl: NavController, private _config: AppConfig, private appData: AppData,
    public viewCtrl: ViewController, private ionicConfig: Config) {
    this.backgroundColor = this.appData.getBackgroundContrastColor();
    this.profilePageStr = this.appData.getProfile();
    this.appData.getLanguage().subscribe(selectedLang => {
      this.profileStr = this._config.getModuleLangVars("setting", "profile", selectedLang);
      // this code is required if app is refreshed
      let backBtn = this._config.getCommonLangVars("backBtn", selectedLang);
      this.viewCtrl.setBackButtonText(backBtn);
      this.ionicConfig.set('backButtonText', backBtn);
    });
  }

  ngOnInit(){
    $('.toolbar-background').css({"background-color":this.backgroundColor});
  }

}
