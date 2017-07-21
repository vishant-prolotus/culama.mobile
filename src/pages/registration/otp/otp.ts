import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Observable } from "rxjs/Rx";

import { TabsPage } from '../../tabs/tabs';

import { language } from '../../../shared/interfaces/language';
import { AppConfig } from '../../../app/config/app.config';
import { AppData } from '../../../shared/services/app-data';
import { VerifyOtpService } from './services/verify-otp';
import { PhoneRegisterService } from '../phone/services/phone-register';

@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
  providers: [VerifyOtpService, PhoneRegisterService]
})
export class OtpPage {
  welcomeTitle: string = "Welcome to Culama!";
  phoneSubTitle: string = "First we have to link your account";
  smsInstructions: string = "Enter the confirmation code sent to you by SMS";
  unknownRegErrorMsg: string = "There was an error while registering your phone number";
  codeInvalidMsg: string = "Code is invalid";

  resendCode: string = "Resend the code";
  nextBtn: string = "Next";
  backBtn: string = "Back";

  codeIsEmptyMsg: string = "Please enter the confirmation code sent to you by SMS";

  selectedLang: language = null;
  confirmationCode: number = null;
  phoneNumber: string = null;
  uuid: string = null;

  constructor(public navCtrl: NavController, private navParams: NavParams,
    private _config: AppConfig, private appData: AppData, private loadingCtrl: LoadingController,
    private verifyOtpService: VerifyOtpService,
    private phoneRegister: PhoneRegisterService, private toastCtrl: ToastController) {

    this.selectedLang = this.navParams.get('LanguageCode');
    this.uuid = this.navParams.get('UniqueId');
    this.phoneNumber = this.navParams.get('PhoneNumber');

    this.welcomeTitle = _config.getModuleLangVars("registration", "welcomeTitle", this.selectedLang);
    this.nextBtn = this._config.getCommonLangVars("nextBtn", this.selectedLang);
    this.backBtn = this._config.getCommonLangVars("backBtn", this.selectedLang);
    this.phoneSubTitle = _config.getModuleLangVars("registration", "phoneSubTitle", this.selectedLang);
    this.resendCode = _config.getModuleLangVars("registration", "resendCode", this.selectedLang);
    this.smsInstructions = _config.getModuleLangVars("registration", "smsInstructions", this.selectedLang);
    this.codeIsEmptyMsg = _config.getModuleLangVars('registration', "codeIsEmptyMsg", this.selectedLang);
    this.unknownRegErrorMsg = _config.getModuleLangVars("registration", "unknownRegisterErrorMsg", this.selectedLang);
    this.codeInvalidMsg = _config.getModuleLangVars("registration", "codeInvalidMsg", this.selectedLang);
  }
  pop() {
    this.navCtrl.pop({ animate: true, animation: 'md-transition', direction: 'back', duration: 200 });
  }
  resend() {
    let accountInfo = {
      "UniqueId": this.appData.getUniqueId(),
      "PhoneNumber": this.appData.getPhoneNumber(),
      "LanguageCode": this.appData.getLanguage()
    };
    let loading = this.loadingCtrl.create({
      content: ''
    });

    loading.present();
    this.phoneRegister.register(accountInfo).subscribe(
      data => {
        loading.dismiss();
        return true;
      },
      error => {
        loading.dismiss();
        return Observable.throw(error);
      }
    );
  }
  verifyCode() {
    let loading = this.loadingCtrl.create({
      content: ''
    });

    loading.present();

    this.verifyOtpService.check(this.confirmationCode).subscribe(
      data => {
        loading.dismiss();
        console.log(data);
        this.appData.setToken(data['token']);
        this.appData.setCompanyName(data['companyData']['name']);
        this.appData.register();
        this.appData.setBackgroundContrastColor(data['companyData']['backgroundContrastColor']);
        this.appData.setCompanyLogo(data['companyData']['companyLogo']);
        this.appData.setProfile(data['profileData']);
        this.navCtrl.insert(0, TabsPage).then(() => {
          this.navCtrl.popToRoot();
        });
      },
      error => {
        loading.dismiss();
        if (error.status === 404) {
          this.presentToast(this.codeInvalidMsg, 5000);
        } else {
          this.presentToast(this.unknownRegErrorMsg, 5000);
        }
      }
    )
  }
  push() {
    if (this.confirmationCode === null) {
      this.presentToast(this.codeIsEmptyMsg, 3000);
    } else {
      this.verifyCode();
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
}
