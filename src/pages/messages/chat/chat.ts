import { Component, ViewChild , OnInit} from '@angular/core';
import { Events } from 'ionic-angular';
import { NavController, ToastController, ViewController, Content, Config, NavParams } from 'ionic-angular';

import { AppConfig } from '../../../app/config/app.config';
import { AppData } from '../../../shared/services/app-data';
import { InformationPage } from '../information/information';
import { MessageService } from '../services/message-service';
import * as _ from 'lodash';

declare var $;
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers: [MessageService]
})
export class ChatPage implements OnInit{
  @ViewChild(Content) content: Content;
  messagesStr: string = "Messages";
  recipients: Array<String> = [];
  threadId: string;
  isEdited:Boolean;
  message: string = "";
  token: string = "";
  somethingWrongMsg: string = "Something went wrong";
  messages: Array<Object> = [];
  fromName:string = "";
  recipientsListName:string = "";
  recipientsList:any;
  backgroundColor;

  constructor(public navCtrl: NavController, private _config: AppConfig, private appData: AppData,
    public viewCtrl: ViewController, private ionicConfig: Config, private navParams: NavParams,
    private msgService: MessageService,
    private toastCtrl: ToastController,public events: Events) {
    this.backgroundColor = this.appData.getBackgroundContrastColor();
    let scope = this;
     events.subscribe('recipient:removed', (user) => {
       debugger;
       this.isEdited=true;
       for(var i=0;i<this.recipientsList.length-1;i++){
         if(this.recipientsList[i].name==user.name){
           scope.recipientsList.splice(i, 1);
         }
       }
        this.recipientsListName="";
        _.each(this.recipientsList,function(index){scope.recipientsListName += index.name +' ,';})
     });
     events.subscribe('added', (data) => {
       debugger;
       this.isEdited=true;
      _.each(data,function(index){
        let i=0;
        _.each(scope.recipientsList,function(position){
            if(index.name==position.name){
              i++;
            }
        });
        if(i==0){
          scope.recipientsList.push(index)
        }
      });
     });
    this.appData.getLanguage().subscribe(selectedLang => {
        this.recipientsListName="";
        this.threadId = navParams.get("id");
        this.fromName = navParams.get("name");
        this.messages = navParams.get("messages");
        this.recipientsList = navParams.get("recipients");
        this.setRead();
        let xyz = this.getNames();
        Promise.all(xyz).then((data) => {
            console.log(data);
        }, () => {
          this.presentToast(this.somethingWrongMsg, 5000);
        });
        _.each(this.recipientsList,function(index){scope.recipientsListName += index.name +' ,';});
      this.messagesStr = this._config.getModuleLangVars("tabs", "messages", selectedLang);
      this.somethingWrongMsg = this._config.getCommonLangVars("somethingWrongMsg", selectedLang);

      // this code is required if app is refreshed
      let backBtn = this._config.getCommonLangVars("backBtn", selectedLang);
      this.viewCtrl.setBackButtonText(backBtn);
      this.ionicConfig.set('backButtonText', backBtn);
    });
    this.token = this.appData.getToken();
  }

  openInfo() {
    this.navCtrl.push(InformationPage, {recipients:this.recipientsList});
  }
  ionViewDidEnter() {
    this.content.scrollToBottom(1);
  }
  send(message: string) {
    //TODO: make call for createMessage which return threadId
    let content = [{
      type: "text",
      content: message
    }]
    let promise = new Promise((resolve, reject) => { 
      let recivers:Array<String> = [];
      debugger;
      recivers.push(this.appData.getToken());
      for(var data in this.recipientsList)
      {
        recivers.push(this.recipientsList[data].id);
      }
      //master changes
      if(this.threadId==undefined || this.isEdited==true)
      {
        this.messages=[];
       this.msgService.createMessage(this.token, recivers, content).subscribe(
        data => {
          this.isEdited=false;
            this.threadId = data['threadId'];
          resolve(data);
        },
        error => {
          reject();
        }); 
      }
      else{
         this.msgService.addtoMessages(this.token, this.threadId , content).subscribe(
        data => {
          resolve(data);
        },
        error => {
          reject();
        }); 
      }
    });
    promise.then((data) => {
      this.messages.push({
        from:this.appData.getToken(),
        type:content[0]['type'],
        date:new Date().toISOString(),
        content:content[0]['content']
      });
      this.message = "";
    }, () => {
      //loading.dismiss();
      this.presentToast(this.somethingWrongMsg, 5000);
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
  getNames() {
     let promises = [];
    _.each(this.messages, (Index) => {
      let promise = new Promise((resolve, reject) => {
        this.msgService.retriveRecipient(this.appData.getToken(), Index.from).subscribe(
          data => {
            Index.name = data.name;
            Index.avatar = data.avatar;
            resolve(Index);
          },
          error => {
            resolve(Index);
          }
        );
      });
      promises.push(promise);
    });
    return promises;
  }
  setRead(){
    let recent = 0;
    _.each(this.messages,function(index){
        if(index.id>recent){
          recent=index.id;
        }
    });
      let content ={
        MessageThreadId:this.threadId,
        DetailThreadId:recent
      }
    this.msgService.markasRead(this.appData.getToken(),content).subscribe(
      res=>{
        console.log(res);
      },
      error=>{
        console.log(error)
      }
    );
  }

  ngOnInit(){
    $('.toolbar-background').css({"background-color":this.backgroundColor});
  }
}
