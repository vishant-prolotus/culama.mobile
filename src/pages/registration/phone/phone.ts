import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { Observable } from "rxjs/Rx";
import { OneSignal } from '@ionic-native/onesignal';

import { OtpPage } from '../otp/otp';
import { language } from '../../../shared/interfaces/language';

import { AppConfig } from '../../../app/config/app.config';
import { PhoneRegisterService } from './services/phone-register';
import { AppData } from "../../../shared/services/app-data";

@Component({
  selector: 'page-phone',
  templateUrl: 'phone.html',
  providers: [PhoneRegisterService, Device]
})
export class PhonePage {
  welcomeTitle: string = "Welcome to Culama!";
  phoneSubTitle: string = "First we have to link your account";
  phoneInstructions: string = "Enter your mobile number, please";
  nextBtn: string = "Next";
  backBtn: string = "Back";
  unknownRegErrorMsg: string = "There was an error while registering your phone number";
  invalidPhoneNumber: any = "Phone number is emptry, or invalid";
  phoneNotFoundMsg: string = "Phone number not found";
  tooManyReqMsg: string = "Too many requests in a single timespan - Wait for 5 minutes";

  selectedLang: language = null;
  countryCode: number = null;
  phone1: number = null;
  phone2: number = null;
  patternCountryCode: string = "^\+?\d{2}$";
  patternPhone1: string = "^\d{3}$";
  patternPhone2: string = "^\d{5}$";

  constructor(public navCtrl: NavController, private navParams: NavParams,
    private _config: AppConfig, private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private _phoneService: PhoneRegisterService,
    private appData: AppData,
    private device: Device,
    private platform: Platform,
    private oneSignal: OneSignal) {
    this.selectedLang = this.navParams.get('language');
    this.welcomeTitle = _config.getModuleLangVars("registration", "welcomeTitle", this.selectedLang.code);
    this.nextBtn = this._config.getCommonLangVars("nextBtn", this.selectedLang.code);
    this.backBtn = this._config.getCommonLangVars("backBtn", this.selectedLang.code);
    this.phoneSubTitle = _config.getModuleLangVars("registration", "phoneSubTitle", this.selectedLang.code);
    this.phoneInstructions = _config.getModuleLangVars("registration", "phoneInstructions", this.selectedLang.code);
    this.unknownRegErrorMsg = _config.getModuleLangVars("registration", "unknownRegisterErrorMsg", this.selectedLang.code);
    this.invalidPhoneNumber = _config.getModuleLangVars("registration", "invalidPhoneNumber", this.selectedLang.code);
    this.phoneNotFoundMsg = _config.getModuleLangVars("registration", "phoneNotFoundMsg", this.selectedLang.code);
    this.tooManyReqMsg = _config.getModuleLangVars("registration", "tooManyReqMsg", this.selectedLang.code);
  }
  pop() {
    this.navCtrl.pop({ animate: true, animation: 'md-transition', direction: 'back', duration: 200 });
  }
  push() {
    let regexp = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
    let phoneNumber: any = this.countryCode + this.phone1 + this.phone2;
    let uuid: any = this.device.uuid !== null ? this.device.uuid : Date.now();
    /*if (this.platform.is('cordova')) {
      this.oneSignal.startInit('8c78f235-ecc8-4e90-9262-7e4a856514ef', '928084122200');
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
      this.oneSignal.handleNotificationReceived().subscribe(() => this.handleNotificationReceived());
      this.oneSignal.handleNotificationOpened().subscribe(() => this.handleNotificationOpened());
      this.oneSignal.endInit();
      this.oneSignal.getIds().then((ids) => {
        this.appData.uniqueId = ids.userId;
        //   alert(ids.userId);
      });
    } else {
      this.appData.uniqueId = Date.now().toString();
    }*/
    let langCode: string = this.selectedLang.code;
    if (phoneNumber.length > 10 && regexp.test(phoneNumber)) {
      this.register(phoneNumber, uuid, langCode);
    } else {
      this.presentToast(this.invalidPhoneNumber, 5000);
    }
  }
  register(number: string, uuid: string, langCode: string) {
    let loading = this.loadingCtrl.create({
      content: ''
    });

    loading.present();
    let accountInfo = {
      "UniqueId": uuid,
      "PhoneNumber": number,
      "LanguageCode": langCode
    };
    this.appData.setLanguage(accountInfo.LanguageCode);
    this.appData.setPhoneNumber(accountInfo.PhoneNumber);
    this.appData.setUniqueId(uuid);
    this._phoneService.register(accountInfo).subscribe(
      data => {
        loading.dismiss();
        this.navCtrl.push(OtpPage,
          accountInfo,
          { animate: true, animation: 'md-transition', direction: 'forward', duration: 500 });
        return true;
      }, error => {
        loading.dismiss();
        if (error.status === 404) {
          this.presentToast(this.phoneNotFoundMsg, 5000);
        } else if (error.status === 429) {
          this.presentToast(this.tooManyReqMsg, 5000);
        } else {
          this.presentToast(this.unknownRegErrorMsg, 5000);
        }
        return Observable.throw(error);
      });
  }
  onKey(event: any, target: string) {
    let keyCode = event.keyCode;
    if (keyCode > 31 &&
      (keyCode < 48 || keyCode > 57) &&
      keyCode != 61 && !(keyCode >= 96 &&
        keyCode <= 105) && (target === 'countryCode' && keyCode != 107 && keyCode != 187)) {
      this[target] = event.target.value.slice(0, -1);
    }
  }
  presentToast(msg, duration) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: duration,
      position: 'bottom'
    });

    toast.onDidDismiss(() => { });
    toast.present();
  }
  public handleNotificationReceived() { }

  public handleNotificationOpened() { }
}
