import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { LocalStorageService } from 'angular-2-local-storage';

interface AppDataInterface {
  isRegister: boolean;
  selectedLang: string;
  phoneNumber:string,
  uniqueId: string;
  token: string,
  backgroundColor: string;
  companyLogo: string;
  userProfile: any;
  companyName: string;
}

@Injectable()
export class AppData {
  private _langSub: BehaviorSubject<string> = new BehaviorSubject("en");
  private appData: AppDataInterface = {
    isRegister: false,
    selectedLang: "en",
    phoneNumber:null,
    uniqueId: null,
    token: null,
    backgroundColor: null,
    companyLogo: null,
    userProfile: null,
    companyName: null
  };

  constructor(private storageServ: LocalStorageService) {
  }
  /**
   * load storage
   */
  public load() {
    let data: any = this.storageServ.get("appData");
    if (data !== null) {
      this.appData = data;
    }
  }
  /**
   * phone registration
   */
  public register() {
    this.appData.isRegister = true;
    this.storageServ.set("appData", this.appData);
  }
  /**
   * check if user has been registered
   */
  public isRegistered() {
    return this.appData['isRegister'];
  }
  /**
   * get unique device id
   */
  public getUniqueId() {
    return this.appData['uniqueId'];
  }
  /**
   * Store unique Id
   * @param uniqueId
   */
  public setUniqueId(uniqueId){
    this.appData.uniqueId = uniqueId;
    this.storageServ.set("appData", this.appData);
  }
  /**
   * store selected language
   * @param lang 
   */
  public setLanguage(lang) {
    this.appData.selectedLang = lang;
    this.storageServ.set("appData", this.appData);
    this._langSub.next(lang)
  }
  /**
   * get selected language
   */
  public getLanguage() {
    this._langSub.next(this.appData.selectedLang);
    return this._langSub.asObservable();
  }

  /**
   * Reset Storage
   */
  public reset() {
    this.appData.isRegister = false;
    this.appData.selectedLang = "en";
    this.storageServ.set("appData", this.appData);
  }
  /**
   * store user token
   * @param token 
   */
  public setToken(token) {
    this.appData.token = token;
    this.storageServ.set("appData", this.appData);
  }
  /**
   * get stored token
   * @param token 
   */
  public getToken() {
    return this.appData['token'];
  }
  /**
   * store company name
   * @param name 
   */
  public setCompanyName(name) {
    this.appData.companyName = name;
    this.storageServ.set("appData", this.appData);
  }
  /**
   * get company name
   * 
   */
  public getCompanyName() {
    return this.appData['companyName'];
  }
    /**
   * store phone number
   * @param num 
   */
  public setPhoneNumber(num) {
    this.appData.phoneNumber = num;
    this.storageServ.set("appData", this.appData);
  }
  /**
   * get phone number
   * 
   */
  public getPhoneNumber() {
    return this.appData['phoneNumber'];
  }


  public setBackgroundContrastColor(color){
    this.appData.backgroundColor = color;
    this.storageServ.set("appData", this.appData);
  }

  public getBackgroundContrastColor(){
    return this.appData['backgroundColor'];
  }


  public setCompanyLogo(logo){
    this.appData.companyLogo = logo;
    this.storageServ.set("appData", this.appData);
  }


  public getCompanyLogo(){
    return this.appData['companyLogo'];
  }


  public setProfile(obj){
    this.appData.userProfile = obj;
    this.storageServ.set("appData", this.appData);
  }


  public getProfile(){
    return this.appData['userProfile'];
  }
}
