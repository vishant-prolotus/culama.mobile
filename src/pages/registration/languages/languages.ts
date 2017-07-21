import { Component, AfterViewInit } from '@angular/core';

import { NavController, Config } from 'ionic-angular';

import { PhonePage } from '../phone/phone';
import { language } from '../../../shared/interfaces/language';
import { AppConfig } from '../../../app/config/app.config';
import { AppData } from '../../../shared/services/app-data';

const LANGS: Array<language> = [
  { image: "./assets/images/english@3x.png", name: 'English', code: 'en' },
  { image: "./assets/images/francais@3x.png", name: 'Français', code: 'fr' },
  { image: "./assets/images/nederlands@3x.png", name: 'Nederlands', code: 'nl' },
  { image: "./assets/images/espanol@3x.png", name: 'Español', code: 'es' }
];

@Component({
  selector: 'page-languages',
  templateUrl: 'languages.html'
})
export class LanguagesPage implements AfterViewInit {
  nextBtn = "Next";
  langScrTitle = "Select your language";
  langs = LANGS;
  selectedLang: language = LANGS[0];
  constructor(public navCtrl: NavController, private _config: AppConfig, private appData: AppData, private ionicConfig: Config) {
    this.appData.setLanguage("en");
  }
  onSelect(selectedLang) {
    this.selectedLang = selectedLang;
    this.nextBtn = this._config.getCommonLangVars("nextBtn", selectedLang.code);
    this.langScrTitle = this._config.getModuleLangVars("registration", "langScrTitle", selectedLang.code);
    this.appData.setLanguage(selectedLang.code);

    // for global change in back button
    let backBtn = this._config.getCommonLangVars("backBtn", selectedLang.code);
    this.ionicConfig.set('backButtonText', backBtn);
  }
  push() {
    this.navCtrl.push(PhonePage, { language: this.selectedLang }, { animate: true, animation: 'md-transition', direction: 'forward', duration: 500 });
  }
  ngAfterViewInit() {
    //setTimeout(()=>{this.navCtrl.push(TabsPage);},5000);
  }
}
