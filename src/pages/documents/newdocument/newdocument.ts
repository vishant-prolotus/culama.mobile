import { Component , OnInit} from '@angular/core';

import { NavController, ViewController, Config } from 'ionic-angular';

import { AppConfig } from '../../../app/config/app.config';
import { AppData } from '../../../shared/services/app-data';
import { DocumentInfoPage } from '../documentinfo/documentinfo';

declare var $;
@Component({
  selector: 'page-newdocument',
  templateUrl: 'newdocument.html'
})
export class NewDocumentPage implements OnInit{
  newDocument: string = "New document";
  backgroundColor;

  constructor(public navCtrl: NavController, private _config: AppConfig, private appData: AppData,
    public viewCtrl: ViewController, private ionicConfig: Config) {
    this.backgroundColor = this.appData.getBackgroundContrastColor();
    this.appData.getLanguage().subscribe(selectedLang => {
      this.newDocument = this._config.getModuleLangVars("home", "newDocument", selectedLang);

      // this code is required if app is refreshed
      let backBtn = this._config.getCommonLangVars("backBtn", selectedLang);
      this.viewCtrl.setBackButtonText(backBtn);
      this.ionicConfig.set('backButtonText', backBtn);
    });
  }

  openInfo() {
    this.navCtrl.push(DocumentInfoPage, {}, { animate: true, animation: 'md-transition', direction: 'forward', duration: 500 });
  }

  ngOnInit(){
    $('.toolbar-background').css({"background-color":this.backgroundColor});
  }
}
