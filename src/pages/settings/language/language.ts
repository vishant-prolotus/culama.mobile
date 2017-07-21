import { Component, AfterViewInit , OnInit} from '@angular/core';
import { NavController, ViewController, Config } from 'ionic-angular';
//import { PhonePage } from '../phone/phone';
import { language } from '../../../shared/interfaces/language';
import { AppConfig } from '../../../app/config/app.config';
import { AppData } from '../../../shared/services/app-data';

const LANGS: Array<language> = [
  { image: "./assets/images/english@3x.png", name: 'English', code: 'en' },
  { image: "./assets/images/francais@3x.png", name: 'Français', code: 'fr' },
  { image: "./assets/images/nederlands@3x.png", name: 'Nederlands', code: 'nl' },
  { image: "./assets/images/espanol@3x.png", name: 'Español', code: 'es' }
];
declare var $;

@Component({
  selector: 'page-language',
  templateUrl: 'language.html'
})
export class LanguagePage implements AfterViewInit , OnInit {
  langs = LANGS;
  backgroundColor;
  selectedLang: language = LANGS[0];
  languageStr: string = "Language";

  constructor(public navCtrl: NavController, private _config: AppConfig, private appData: AppData,
   public viewCtrl: ViewController, private ionicConfig: Config) {
    this.backgroundColor = this.appData.getBackgroundContrastColor();
    this.appData.getLanguage().subscribe(selLang => {
      for (let lang of LANGS) {
        if (lang.code === selLang) {
          this.selectedLang = lang;
        }
      }
      this.languageStr = this._config.getModuleLangVars("setting", "language", selLang);
      // for global change in back button
      let backBtn = this._config.getCommonLangVars("backBtn", selLang);
      this.viewCtrl.setBackButtonText(backBtn);
      this.ionicConfig.set('backButtonText', backBtn);
    });
  
  }

  ngOnInit(){
    $('.toolbar-background').css({"background-color":this.backgroundColor});
  }

  onSelect(selectedLang) {
    this.selectedLang = selectedLang;
    this.appData.setLanguage(selectedLang.code);
  }
  push() {
    //this.navCtrl.push(PhonePage,{language:this.selectedLang},{animate: true, animation:'md-transition', direction: 'forward', duration:500});
  }
  ngAfterViewInit() {
    //setTimeout(()=>{this.navCtrl.push(TabsPage);},5000);
  }
}
