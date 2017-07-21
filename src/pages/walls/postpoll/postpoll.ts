import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { PopoverPage } from '../../../shared/popovers/popovers';
import { AppConfig } from '../../../app/config/app.config';
import { AppData } from '../../../shared/services/app-data';
import { PopoverController } from 'ionic-angular';

declare var $;
@Component({
  selector: 'page-postpoll',
  templateUrl: 'postpoll.html'
})
export class PostPollPage implements OnInit {
  postStr: string = "Post";
  backgroundColor;
  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController,
    private _config: AppConfig, private appData: AppData, private popoverCtrl: PopoverController) {
    this.backgroundColor = this.appData.getBackgroundContrastColor();
    this.appData.getLanguage().subscribe(selectedLang => {
      this.postStr = this._config.getModuleLangVars("walls", "post", selectedLang);
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
