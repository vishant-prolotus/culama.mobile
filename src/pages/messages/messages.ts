import { Component, OnInit } from '@angular/core';

import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { ChatPage } from './chat/chat';
import { NewMessagePage } from './newmessage/newmessage';

import { AppConfig } from '../../app/config/app.config';
import { AppData } from '../../shared/services/app-data';
import { MessageService } from './services/message-service';
import * as _ from 'lodash';

declare var $;
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
  providers: [MessageService]
})
export class MessagesPage implements OnInit {
  hasContent: number = 0;
  messagesStr: string = "Messages";
  noMessageStr: string = "Oops, you have no messages yet";
  somethingWrongMsg: string = "Something went wrong";
  msgThreads: Array<Object> = [];
  loading;
  backgroundColor;

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController,
    private toastCtrl: ToastController, private _config: AppConfig,
    private appData: AppData, private msgService: MessageService) {
    this.backgroundColor = this.appData.getBackgroundContrastColor();
    this.appData.getLanguage().subscribe(selectedLang => {
      this.messagesStr = this._config.getModuleLangVars("tabs", "messages", selectedLang);
      this.noMessageStr = this._config.getModuleLangVars("messages", "noMessageStr", selectedLang);
      this.somethingWrongMsg = this._config.getCommonLangVars("somethingWrongMsg", selectedLang);
    });
  }

  ionViewDidEnter() {
    
    this.msgService.retriveActiveItems(this.appData.getToken()).subscribe(
      data => {
        if (data.messages.length) {
          let promiseList = this.fetchThreadData(data.messages);
          Promise.all(promiseList).then((list) => {
            this.hasContent = 2;
            this.msgThreads = list;
            this.loading.dismiss();
          }, () => {
            this.loading.dismiss();
            this.presentToast(this.somethingWrongMsg, 5000);
          });
        } else {
          this.hasContent = 1;
          this.loading.dismiss();
        }
      },
      error => {
        this.loading.dismiss();
        this.presentToast(this.somethingWrongMsg, 5000);
      }
    );
  }
  fetchThreadData(threads) {
    let promises = [];
    _.each(threads, (thread, thIndex) => {
      let promise = new Promise((resolve, reject) => {
        this.msgService.retriveMessages(this.appData.getToken(), thread.masterId, thread.detailId).subscribe(
          data => {
            threads[thIndex]['date'] = new Date(data.messages[data.messages.length-1].date).toISOString();
            threads[thIndex]['content'] = data.messages[data.messages.length-1].content;
            threads[thIndex]['messages'] = data.messages; 
            threads[thIndex]['type'] = data.messages[data.messages.length-1].type;
            threads[thIndex]['recipients'] = data.recipients;
            let rcount = 0;
            _.each(data.recipients, (rval, rindex) => {
                this.msgService.retriveRecipient(this.appData.getToken(), rval).subscribe(
                recipient => {
                  if (data.recipients.length === rcount) {
                    // if (data.messages[0].from === rval) {
                      threads[thIndex]['from'] = recipient['name'];
                      threads[thIndex]['avatar'] = recipient['avatar'];
                      data.recipients[rindex] ={
                        name:recipient['name'],
                        id:rval
                      }
                    // }else{
                      // data.recipients[rindex] = {
                      //   name:recipient['name'],
                      //   id:rval
                      // }
                    // }
                    resolve(threads[thIndex]);
                  }
                });
              rcount++;
            });
          },
          error => {
            resolve(threads[thIndex]);
          }
        );
      });
      promises.push(promise);
    });
    return promises;
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
  push(id, name, recipients , messages) {
    //master chnages
    this.navCtrl.push(ChatPage,{
      messages:messages,
      id:id,
      name:name,
      recipients:recipients
    });
  }
  openNew() {
    this.navCtrl.push(NewMessagePage, { recipients: [], isNew: true }, { animate: true, animation: 'md-transition', direction: 'forward', duration: 500 });
  }
  ngOnInit() {
    $('.toolbar-background').css({"background-color":this.backgroundColor});
    this.loading = this.loadingCtrl.create({
      content: ''
    });
    this.loading.present();
  }
}
