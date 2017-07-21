import { Component , OnInit } from '@angular/core';

import { NavController, NavParams, ViewController, Config } from 'ionic-angular';
import { AppConfig } from '../../../app/config/app.config';
import { AppData } from '../../../shared/services/app-data';
import { NewMessagePage } from '../newmessage/newmessage';
import { Events } from 'ionic-angular';
import * as _ from 'lodash';

declare var $;
@Component({
  selector: 'page-information',
  templateUrl: 'information.html'
})
export class InformationPage implements OnInit{

  conversationPageStr: any = {
    conversationStr: "Conversation Info",
    name: "Name", // from information
    creator: "Creator",// from information
    addNew: "Add new",
    description: "Description",// from information
    participants: "Participants"// from information
  };
  recipients:any;
  backgroundColor;

  constructor(public navCtrl: NavController, private _config: AppConfig,
    private appData: AppData, public viewCtrl: ViewController,
    private navParams: NavParams, private ionicConfig: Config,public events: Events) {
    this.backgroundColor = this.appData.getBackgroundContrastColor();
    let scope = this;
    events.subscribe('addeed', (data) => {
      _.each(data,function(index){
        let i=0;
        _.each(scope.recipients,function(position){
            if(index.name==position.name){
              i++;
            }
        });
        if(i==0){
          scope.recipients.push(index)
        }
      });
     });

    this.appData.getLanguage().subscribe(selectedLang => {
      this.recipients = navParams.get('recipients');
      for (let property in this.conversationPageStr) {
        let moduleLang = (property == "conversationStr" || property == "addNew") ? "messages" : "information";
        this.conversationPageStr[property] = this._config.getModuleLangVars(moduleLang, property, selectedLang);
      }

      // this code is required if app is refreshed
      let backBtn = this._config.getCommonLangVars("backBtn", selectedLang);
      this.viewCtrl.setBackButtonText(backBtn);
      this.ionicConfig.set('backButtonText', backBtn);
    });
  }
  remove(user) {
    debugger;
    for(var i=0;i<this.recipients.length-1;i++){
      if(this.recipients[i].name==user.name){
          this.recipients.splice(i,1);
          this.events.publish('recipient:removed', user);
      }
    }
}
     addRecipients() {
    this.navCtrl.push(NewMessagePage, { recipients: this.recipients, isNew: false });
  }

  ngOnInit(){
    $('.toolbar-background').css({"background-color":this.backgroundColor});
  }

}
