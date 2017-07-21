import { Component, OnInit, OnDestroy } from '@angular/core';

import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

import { AppConfig } from '../../app/config/app.config';
import { AppData } from '../../shared/services/app-data';
import { HomeService } from './services/home-service';
import { MessagesPage } from '../messages/messages';
 
declare var $;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HomeService]
})

export class HomePage implements OnInit, OnDestroy {
  msgBadgeClassMap = { 'badge-orange': false, 'badge-grey': true };
  msgFontClassMap = { 'font-orange': false, 'font-grey': true };
  docBadgeClassMap = { 'badge-orange': false, 'badge-grey': true };
  docFontClassMap = { 'font-orange': false, 'font-grey': true };
  selectedLang = "en";
  backgroundColor: string;
  isConnected: boolean = true;
  newMsgCount: number = 0;
  newDocumentsCount: number = 0;
  newPostsCount: number = 0;

  homeStr: any = "Home";
  somethingWrongMsg: string = "Something went wrong";

  homePageStr: any = {
    noInternetConnection: "No Internet Connection",
    postNotPublished: "Post was not published",
    newMessages: "New messages",
    newMessage: "New message",
    noNewMessages: "No New Messages",
    newDocuments: "New Documents",
    newDocument: "New document",
    noNewDocuments: "No New Documents",
    newPost: "new posts",
    morningShiftCrew: "Morning shift crew",
    readFullPost: "Read full post...",
    reply: "Reply"
  };
  disconnectSubscription = this.network.onDisconnect().subscribe(() => {
    this.isConnected = false;
    let msg = this._config.getModuleLangVars("home", "noInternetConnection", this.selectedLang);
    this.presentToast(msg, 5000);
  });
  connectSubscription = this.network.onConnect().subscribe(() => {
    this.isConnected = true;
  });
  ngOnInit() {
    $('.toolbar-background').css({"background-color":this.backgroundColor});
    let isoDate = (new Date()).toISOString();
    if (this.network.type === "none") {
      this.isConnected = false;
    }
    let loading = this.loadingCtrl.create({
      content: ''
    });

    loading.present();
    this.homeService.retriveUnreadItems(this.appData.getToken(), isoDate).subscribe(
      data => {
        this.newMsgCount = data.messageCount;
        this.newDocumentsCount = data.documentCount;
        this.newPostsCount = data.postCount;
        if (this.newMsgCount) {
          this.msgBadgeClassMap['badge-orange'] = true;
          this.msgBadgeClassMap['badge-grey'] = false;
          this.msgFontClassMap['font-orange'] = true;
          this.msgFontClassMap['font-grey'] = false;
          if (this.newMsgCount === 1) {
            this.homePageStr.newMessages = this.homePageStr.newMessage;
          }
        }
        if (this.newDocumentsCount) {
          this.docBadgeClassMap['badge-orange'] = true;
          this.docBadgeClassMap['badge-grey'] = false;
          this.docFontClassMap['font-orange'] = true;
          this.docFontClassMap['font-grey'] = false;
          if (this.newDocumentsCount === 1) {
            this.homePageStr.newDocuments = this.homePageStr.newDocument;
          }
        }
        loading.dismiss();
      },
      error => {
        loading.dismiss();
      }
    );

  }

  ngOnDestroy() {
    this.disconnectSubscription.unsubscribe();
    this.connectSubscription.unsubscribe();
  }

  constructor(public navCtrl: NavController, private toastCtrl: ToastController,
    private _config: AppConfig, private appData: AppData, private network: Network,
    private loadingCtrl: LoadingController, private homeService: HomeService) {
    this.backgroundColor = this.appData.getBackgroundContrastColor();
    this.appData.getLanguage().subscribe(selectedLang => {
      this.selectedLang = selectedLang;
      let companyName = this.appData.getCompanyName();
      this.homeStr = companyName || this._config.getModuleLangVars("tabs", "home", selectedLang);
      this.somethingWrongMsg = this._config.getCommonLangVars("somethingWrongMsg", this.selectedLang);
      for (let property in this.homePageStr) {
        this.homePageStr[property] = this._config.getModuleLangVars("home", property, selectedLang);
      }
      if (this.newMsgCount === 1) {
        this.homePageStr.newMessages = this.homePageStr.newMessage;
      }
      if (this.newDocumentsCount === 1) {
        this.homePageStr.newDocuments = this.homePageStr.newDocument;
      }
    });
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

  openMSGpage(){
    this.navCtrl.push(MessagesPage);
  }

}
