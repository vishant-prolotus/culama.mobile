import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AppConfig } from '../../app/config/app.config';
import { AppData } from '../../shared/services/app-data';
import { NewDocumentPage } from './newdocument/newdocument';

declare var $;
@Component({
  selector: 'page-documents',
  templateUrl: 'documents.html'
})
export class DocumentsPage implements OnInit {
  hasContent = true;
  documentsStr: string = "Documents";
  backgroundColor;
  noDocumentsStr: string = "Oops, you have no documents yet";
  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController,
    private _config: AppConfig, private appData: AppData) {
    this.backgroundColor = this.appData.getBackgroundContrastColor();
    this.appData.getLanguage().subscribe(selectedLang => {
      this.documentsStr = this._config.getModuleLangVars("tabs", "documents", selectedLang);
      this.noDocumentsStr = this._config.getModuleLangVars("documents", "noDocumentsStr", selectedLang);
    });
  }
  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: ''
    });

    loading.present();

    setTimeout(() => {
      this.hasContent = false;
      loading.dismiss();
    }, 3000);
  }

  push() {
    this.navCtrl.push(NewDocumentPage, {}, { animate: true, animation: 'md-transition', direction: 'forward', duration: 500 });
  }

  ngOnInit() {
    $('.toolbar-background').css({"background-color":this.backgroundColor});
    this.presentLoadingDefault();
  }
}
