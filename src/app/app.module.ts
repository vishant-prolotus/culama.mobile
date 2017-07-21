import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { LocalStorageModule } from 'angular-2-local-storage';
import { OneSignal } from '@ionic-native/onesignal';
import {MomentModule} from 'angular2-moment';

import { AppConfig } from './config/app.config';
import { AppData } from '../shared/services/app-data';

import { MyApp } from './app.component';
import { MessagesPage } from '../pages/messages/messages';
import { DocumentsPage } from '../pages/documents/documents';
import { WallsPage } from '../pages/walls/walls';
import { SettingsPage } from '../pages/settings/settings';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { OtpPage } from '../pages/registration/otp/otp';
import { PhonePage } from '../pages/registration/phone/phone';
import { LanguagesPage } from '../pages/registration/languages/languages';
import { LanguagePage } from '../pages/settings/language/language';
import { ProfilePage } from '../pages/settings/profile/profile';
import { ChatPage } from '../pages/messages/chat/chat';
import { InformationPage } from '../pages/messages/information/information';
import { NewMessagePage } from '../pages/messages/newmessage/newmessage';
import { DocumentInfoPage } from '../pages/documents/documentinfo/documentinfo';
import { NewDocumentPage } from '../pages/documents/newdocument/newdocument';
import { PostsPage } from '../pages/walls/posts/posts';
import { TimelinePage } from '../pages/walls/timeline/timeline';
import { WallInfoPage } from '../pages/walls/wallinfo/wallinfo';
import { PopoverPage } from '../shared/popovers/popovers';
import { PostPage } from '../pages/walls/post/post';
import { PostPollPage } from '../pages/walls/postpoll/postpoll';
import { ReplyPage } from '../pages/walls/reply/reply';

@NgModule({
  declarations: [
    MyApp,
    MessagesPage,
    DocumentsPage,
    WallsPage,
    SettingsPage,
    HomePage,
    TabsPage,
    LanguagesPage,
    PhonePage,
    OtpPage,
    ProfilePage,
    LanguagePage,
    ChatPage,
    InformationPage,
    NewMessagePage,
    DocumentInfoPage,
    NewDocumentPage,
    PostsPage,
    PopoverPage,
    TimelinePage,
    WallInfoPage,
    PostPage,
    PostPollPage,
    ReplyPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {tabsHideOnSubPages :true}),
    LocalStorageModule.withConfig({
      storageType: 'localStorage'
    }),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MessagesPage,
    DocumentsPage,
    WallsPage,
    SettingsPage,
    HomePage,
    TabsPage,
    LanguagesPage,
    PhonePage,
    OtpPage,
    ProfilePage,
    LanguagePage,
    ChatPage,
    InformationPage,
    NewMessagePage,
    DocumentInfoPage,
    NewDocumentPage,
    PostsPage,
    PopoverPage,
    TimelinePage,
    WallInfoPage,
    PostPage,
    PostPollPage,
    ReplyPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: (config: AppConfig) => () => config.load(), deps: [AppConfig], multi: true },

    AppData,
    { provide: APP_INITIALIZER, useFactory: (data: AppData) => () => data.load(), deps: [AppData], multi: true },
    OneSignal
  ]
})
export class AppModule { }
