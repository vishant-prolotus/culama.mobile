import { Component, OnInit } from '@angular/core';
import { WallService } from './services/wall.service';
import { NavController, LoadingController , ToastController} from 'ionic-angular';

import { AppConfig } from '../../app/config/app.config';
import { AppData } from '../../shared/services/app-data';
import { PostsPage } from './posts/posts';
import { TimelinePage } from './timeline/timeline';
import * as _ from 'lodash';

declare var $;
@Component({
  selector: 'page-walls',
  templateUrl: 'walls.html',
  providers: [WallService]
})
export class WallsPage implements OnInit {
  hasContent: boolean = false;
  wallPageContent:any[];
  wallsStr: string = "Walls";
  noWallsStr: string = "Oops, the wall is empty";
  managePost: string = "Manage your post";
  backgroundColor;
  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController,
    private _config: AppConfig, private appData: AppData , private wallService: WallService ,
    private toastCtrl: ToastController ) {
    this.backgroundColor = this.appData.getBackgroundContrastColor();
    this.appData.getLanguage().subscribe(selectedLang => {
      this.wallsStr = this._config.getModuleLangVars("tabs", "walls", selectedLang);
      this.noWallsStr = this._config.getModuleLangVars("walls", "noWallsStr", selectedLang);
      this.managePost = this._config.getModuleLangVars("walls", "managePost", selectedLang);
    });
  }
  ionViewDidEnter() {
    let loading = this.loadingCtrl.create({
      content: ''
    });
     loading.present();
    this.wallService.retriveActiveItems(this.appData.getToken()).subscribe(
      data => {
        if (data.walls.length) {
          this.wallPageContent =[];
          this.fetchThreadData(data.walls).then((list) => {
            _.sortBy(this.wallPageContent, [function(o) { return o.wallData.title;}]);
            loading.dismiss();
            console.log(this.wallPageContent);
          }, () => {
            loading.dismiss();
          });
        } else {
          loading.dismiss();
          this.presentToast(this.noWallsStr, 5000);
        }
      },
      error => {
        loading.dismiss();
        this.presentToast('Please Refresh the Page', 5000);
      }
    );
  }
  fetchThreadData(threads) {
      let promise = new Promise((resolve, reject) => {
    _.each(threads, (thread, thIndex) => {
        this.wallService.retriveExistingWalls(this.appData.getToken(), thread.masterId, thread.detailId).subscribe(
          data => {
                this.wallPageContent.push(data);
                resolve(this.wallPageContent);
          },
          error => {
            resolve();
          }
        );
      });
    });
    return promise;
  }
  ngOnInit(){
     $('.toolbar-background').css({"background-color":this.backgroundColor});
  }
  openManage() {
    this.navCtrl.push(PostsPage, {postData:this.wallPageContent}, { animate: true, animation: 'md-transition', direction: 'forward', duration: 500 });
  }
  openPost(content , walldata){
    this.navCtrl.push(TimelinePage, {timelineData:content, WallData:walldata}, { animate: true, animation: 'md-transition', direction: 'forward', duration: 500 });
  } 
   presentToast(msg, duration) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: duration,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      //console.log('Dismissed toast');
    });
    toast.present();
  }

}
