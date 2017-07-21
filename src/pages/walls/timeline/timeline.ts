import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController ,NavParams} from 'ionic-angular';
import { PopoverPage } from '../../../shared/popovers/popovers';
import { AppConfig } from '../../../app/config/app.config';
import { AppData } from '../../../shared/services/app-data';
import { PopoverController } from 'ionic-angular';
import { WallInfoPage } from '../wallinfo/wallinfo';
import { ReplyPage } from '../reply/reply';
import * as _ from 'lodash';

declare var $;
@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html'
})
export class TimelinePage implements OnInit {
  
  postStr: string = "";
  readFullPost: "Read full post...";
  reply;
  show:boolean;
  timelineData:any[];
  WallData;
  UserToken;
  backgroundColor;
  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController,
    private _config: AppConfig, private appData: AppData, private popoverCtrl: PopoverController, 
    private navParams: NavParams) {
    this.backgroundColor = this.appData.getBackgroundContrastColor();
    this.timelineData =[];
    this.UserToken = this.appData.getToken();
    this.WallData = navParams.get('WallData');
    _.each(navParams.get('timelineData'),(data , Index)=>{
        this.timelineData[Index] = data;
    });
    _.sortBy(this.timelineData, [function(o) { return o.date; }]);
    // console.log(this.timelineData);
    this.appData.getLanguage().subscribe(selectedLang => {
      this.postStr = this._config.getModuleLangVars("walls", "postStr", selectedLang);
      this.readFullPost = this._config.getModuleLangVars("home", "readFullPost", selectedLang);
      this.reply = this._config.getModuleLangVars("home", "reply", selectedLang);
    });
  }
   openInfo() {
    this.navCtrl.push(WallInfoPage, {Description:this.WallData}, { animate: true, animation: 'md-transition', direction: 'forward', duration: 500 });
  }
  openNew() {
    //this.navCtrl.push(WallInfoPage, {}, { animate: true, animation: 'md-transition', direction: 'forward', duration: 500 });
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
    $('.toolbar-background').css({"background-color":this.backgroundColor});
  }

  Likes(value){debugger;
    value.likes= value.likes+1;
  }
  Reply(value){
    this.navCtrl.push(ReplyPage,{});
  }
  AddReply(){
    this.show = false;
  }
}
