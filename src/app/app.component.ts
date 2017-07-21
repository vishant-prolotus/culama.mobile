import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AppData } from '../shared/services/app-data';

import { TabsPage } from '../pages/tabs/tabs';
import { LanguagesPage } from '../pages/registration/languages/languages';
// import { PostsPage } from '../pages/walls/posts/posts';
// import { TimelinePage } from '../pages/walls/timeline/timeline';
// import { NewMessagePage } from '../pages/messages/newmessage/newmessage';
// import { ChatPage } from '../pages/messages/chat/chat';
// import { DocumentInfoPage } from '../pages/documents/documentinfo/documentinfo';
// import { InformationPage } from '../pages/messages/information/information';
// import { WallInfoPage } from '../pages/walls/wallinfo/wallinfo';
// import { PostPage } from '../pages/walls/post/post';
// import { PostPollPage } from '../pages/walls/postpoll/postpoll';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  constructor(platform: Platform, private _appData: AppData) {
    if (!this._appData.isRegistered()) {
      this.rootPage = LanguagesPage;
    }

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
