import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-popovers',
  templateUrl: 'popovers.html'

})
export class PopoverPage {


  constructor(private navParams: NavParams, public viewCtrl: ViewController) {

  }

  ngOnInit() {

  }

  close() {
    this.viewCtrl.dismiss();
  }
}