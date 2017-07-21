import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { PopoverPage } from '../../../shared/popovers/popovers';
import { ToastController, ViewController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../app/config/app.config';
import { AppData } from '../../../shared/services/app-data';
import { PopoverController } from 'ionic-angular';
import * as _ from 'lodash';

declare var $;
@Component({
  selector: 'page-posts',
  templateUrl: 'posts.html'
})
export class PostsPage implements OnInit {
  postData;
  postStr: string = "Manage posts";
  readFullPost: "Read full post...";
  reply: "Reply";
  backgroundColor;
  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController,
    private _config: AppConfig, private appData: AppData, private popoverCtrl: PopoverController,
    private navParams: NavParams) {
    this.backgroundColor = this.appData.getBackgroundContrastColor();
    this.postData =[];
    _.each(navParams.get('postData'),(data , Index)=>{
        this.postData[Index] = data;
    });
    this.appData.getLanguage().subscribe(selectedLang => {
      this.postStr = this._config.getModuleLangVars("walls", "postStr", selectedLang);
      this.readFullPost = this._config.getModuleLangVars("home", "readFullPost", selectedLang);
      this.reply = this._config.getModuleLangVars("home", "reply", selectedLang);
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
