import { Component, OnDestroy , OnInit} from '@angular/core';

import { NavController, NavParams, ToastController, LoadingController, ViewController, Config } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { AppConfig } from '../../../app/config/app.config';
import { AppData } from '../../../shared/services/app-data';
import { MessageService } from '../services/message-service';
import * as _ from 'lodash';

declare var $;
@Component({
  selector: 'page-newmessage',
  templateUrl: 'newmessage.html',
  providers: [MessageService]
})
export class NewMessagePage implements OnDestroy , OnInit{
  isNew: boolean = true;
  token: string = "";
  lastItemIndex: number = 0;
  itemsPerPage: number = 15;
  createMessage: boolean = false;
  listOfRecipients: Array<Object> = [];
  recipients: Array<Object> = [];
  backgroundColor;
  somethingWrongMsg: string = "Something went wrong";
  reqRecipientErrorMsg: string = "Please select recipients";

  newMessagePageStr: any = {
    name: "Name", // from information
    newMessage: "New message",
    morningShiftCrew: "Morning shift crew", //from home
    selectType: "Select type",
    conversation: "Conversation",
    noreplies: "No replies",
    selectPeople: "Select one or few people",
  };

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, public viewCtrl: ViewController,
    private ionicConfig: Config, private _config: AppConfig, private appData: AppData,
    private toastCtrl: ToastController, private msgService: MessageService,
    private navParams: NavParams, public events: Events) {
    this.backgroundColor = this.appData.getBackgroundContrastColor();
    this.appData.getLanguage().subscribe(selectedLang => {
      this.recipients = navParams.get('recipients');
      this.isNew = navParams.get("isNew");
      for (let property in this.newMessagePageStr) {
        let moduleLang = property == "name" ? "information" : property == "morningShiftCrew" ? "home" : "messages";
        this.newMessagePageStr[property] = this._config.getModuleLangVars(moduleLang, property, selectedLang);
      }
      this.reqRecipientErrorMsg = this._config.getModuleLangVars("messages", "reqRecipientErrorMsg", selectedLang);
      // this code is required if app is refreshed
      let backBtn = this._config.getCommonLangVars("backBtn", selectedLang);
      this.viewCtrl.setBackButtonText(backBtn);
      this.ionicConfig.set('backButtonText', backBtn);
      this.token = this.appData.getToken();
      this.somethingWrongMsg = this._config.getCommonLangVars("somethingWrongMsg", selectedLang);
    });

    //call webservice to fetch recipients
    let loading = this.loadingCtrl.create({
      content: ''
    });
    loading.present();
    this.msgService.retriveRecipients(this.token).subscribe(
      data => {
        let recipients = _.map(this.recipients, this.getRecipients);
        this.recipients = _.pullAllBy(data['recipients'], recipients, "id");
        let promises = this.fetchPage(this.recipients, this.lastItemIndex, this.itemsPerPage);
        Promise.all(promises).then((list) => {
          _.each(list, (item) => {
            this.listOfRecipients.push(item);
          });
          loading.dismiss();
        }, () => {
          loading.dismiss();
          this.presentToast(this.somethingWrongMsg, 5000);
        });
      },
      error => {
        loading.dismiss();
        this.presentToast(this.somethingWrongMsg, 5000);
      }
    );
  }
  getRecipients(recipient) {
    let obj = {
      id: recipient.id,
      name: recipient.name
    };
    return obj;
  }
  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if (this.recipients.length > this.lastItemIndex) {
        let promises = this.fetchPage(this.recipients, this.lastItemIndex, this.itemsPerPage);
        Promise.all(promises).then((list) => {
          _.each(list, (item) => {
            this.listOfRecipients.push(item);
          });
          infiniteScroll.complete();
        }, () => {
          infiniteScroll.complete();
        });
      } else {
        infiniteScroll.complete();
      }
    }, 500);
  }
  fetchPage(data, lastIndex, totalItems) {
    let firstItem: number = lastIndex;
    let lastItem: number = firstItem + (totalItems - 1);
    let items = _.slice(data, firstItem, lastItem + 1);
    let promises = [];
    _.each(items, (item, indx) => {
      let promise = new Promise((resolve, reject) => {
        this.msgService.retriveRecipient(this.token, item.id).subscribe(
          data => {
            items[indx]['title'] = data['function'];
            items[indx]['avatar'] = data['avatar'];
            items[indx]['isAdded'] = false;
            resolve(items[indx]);
          },
          error => {
            resolve();
          });
      });
      promises.push(promise);
    });
    this.lastItemIndex = lastItem + 1;
    return promises;
  }
  addRemove(id: string) {
    let node = _.find(this.listOfRecipients, { id: id });
    node.isAdded = !node.isAdded;
    let index = _.indexOf(this.listOfRecipients, node);
    this.listOfRecipients.splice(index, 1, node);
  }
  openNewMsgScreen() {
    debugger;
    let recipients = _.filter(this.listOfRecipients, o => { return o.isAdded; });
    this.events.publish('addeed',recipients);
    this.events.publish('added',recipients);
    if (recipients.length) {
      if (this.isNew === true) {
        this.navCtrl.push(ChatPage, { recipients:recipients });
      }else{
        this.navCtrl.pop({animate:true, direction:"back"});
      }
    } else {
      this.presentToast(this.reqRecipientErrorMsg, 5000);
    }
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
  ngOnDestroy() { }
  ngOnInit(){
    $('.toolbar-background').css({"background-color":this.backgroundColor});
  }
}
