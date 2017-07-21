import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { PopoverPage } from '../../../shared/popovers/popovers';
import { AppConfig } from '../../../app/config/app.config';
import { AppData } from '../../../shared/services/app-data';
import { PopoverController } from 'ionic-angular';

declare var $;
@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage implements OnInit {
  
  postStr: string = "";
  readFullPost: "Read full post...";
  reply: "Reply";
  morningShiftCrew: "Morning shift crew";
  backgroundColor;

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController,
    private _config: AppConfig, private appData: AppData, private popoverCtrl: PopoverController) {
    this.appData.getLanguage().subscribe(selectedLang => {
      this.backgroundColor = this.appData.getBackgroundContrastColor();
      this.postStr = this._config.getModuleLangVars("walls", "postStr", selectedLang);
      this.readFullPost = this._config.getModuleLangVars("home", "readFullPost", selectedLang);
      this.reply = this._config.getModuleLangVars("home", "reply", selectedLang);
      this.morningShiftCrew = this._config.getModuleLangVars("home", "morningShiftCrew", selectedLang);
    });
  }
  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: ''
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);
  }

presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  ngOnInit() {
    //this.presentLoadingDefault();
    $('.toolbar-background').css({"background-color":this.backgroundColor});

  }
}
