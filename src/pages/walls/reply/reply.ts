import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController ,Platform} from 'ionic-angular';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { PopoverPage } from '../../../shared/popovers/popovers';
import { AppConfig } from '../../../app/config/app.config';
import { AppData } from '../../../shared/services/app-data';
import { PopoverController } from 'ionic-angular';

declare var $;
@Component({
  selector: 'reply-page',
  templateUrl: 'reply.html',
  providers: [Transfer, File , FileChooser]
})
export class ReplyPage implements OnInit {
  backgroundColor;

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController,
    private _config: AppConfig, private appData: AppData, private popoverCtrl: PopoverController,
    private transfer: Transfer,public platform: Platform, private file: File,private fileChooser: FileChooser) {
    this.backgroundColor = this.appData.getBackgroundContrastColor();
  }

  UploadFile(){
    console.log('kii');
      this.fileChooser.open()
  .then(uri => {
    this.platform.ready().then(() => {
      const fileTransfer: TransferObject = this.transfer.create();
      let options: FileUploadOptions = {
           fileKey: 'file',
           fileName: 'name.jpg',
           headers: {}
        }
        fileTransfer.upload(uri, '<api endpoint>', options)
         .then((data) => {
           console.log(data);
         }, (err) => {
              console.log(err);
         })
    });
  })
  .catch(e => console.log(e));
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: ''
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);
  }

presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  ngOnInit() {
    //this.presentLoadingDefault();
    $('.toolbar-background').css({"background-color":this.backgroundColor});
  }
}
