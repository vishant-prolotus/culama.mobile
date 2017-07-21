import { Component , OnInit} from '@angular/core';
import { NavController, ViewController, Config } from 'ionic-angular';
import { AppConfig } from '../../../app/config/app.config';
import { AppData } from '../../../shared/services/app-data';

declare var $;
@Component({
  selector: 'page-documentinfo',
  templateUrl: 'documentinfo.html'
})
export class DocumentInfoPage implements OnInit{
  documentInfo: string = "Document Info";
  backgroundColor
  documentInfoPageStr: any = {
    name: "Name", // from information
    creator: "Creator",// from information
    date: "Date", // from information
    description: "Description",// from information
  };
  constructor(public navCtrl: NavController, private _config: AppConfig, private appData: AppData,
    public viewCtrl: ViewController, private ionicConfig: Config) {
    this.backgroundColor = this.appData.getBackgroundContrastColor();
    this.appData.getLanguage().subscribe(selectedLang => {
      this.documentInfo = this._config.getModuleLangVars("documents", "documentInfo", selectedLang);

      for (let property in this.documentInfoPageStr) {
        this.documentInfoPageStr[property] = this._config.getModuleLangVars("information", property, selectedLang);
      }

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
