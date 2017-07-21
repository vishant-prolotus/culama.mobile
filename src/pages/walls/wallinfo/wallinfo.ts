import { Component , OnInit} from '@angular/core';
import { NavController, ViewController, Config ,NavParams } from 'ionic-angular';
import { AppConfig } from '../../../app/config/app.config';
import { AppData } from '../../../shared/services/app-data';

declare var $;
@Component({
  selector: 'page-wallinfo',
  templateUrl: 'wallinfo.html'
})
export class WallInfoPage implements OnInit {
  wallInfo: string = "Wall Info";
  description;
  backgroundColor;
  constructor(public navCtrl: NavController, private _config: AppConfig, private appData: AppData,
    public viewCtrl: ViewController, private ionicConfig: Config ,private navParams: NavParams) {
    this.backgroundColor = this.appData.getBackgroundContrastColor();
    this.description = this.navParams.get('Description');
    this.appData.getLanguage().subscribe(selectedLang => {
      this.wallInfo = this._config.getModuleLangVars("walls", "wallinfo", selectedLang);

      // this code is req uired if app is refreshed
      let backBtn = this._config.getCommonLangVars("backBtn", selectedLang);
      this.viewCtrl.setBackButtonText(backBtn);
      this.ionicConfig.set('backButtonText', backBtn);
    });
  }

  ngOnInit(){
    $('.toolbar-background').css({"background-color":this.backgroundColor});
  }

}
