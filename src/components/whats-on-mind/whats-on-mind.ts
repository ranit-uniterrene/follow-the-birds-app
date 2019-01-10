import { Component, Input } from '@angular/core';
import { IonicPage, NavController, Nav, NavParams, ActionSheetController,Platform,  ViewController,ToastController,LoadingController,ModalController } from 'ionic-angular';

import { User } from '../../providers';
/**
 * Generated class for the WhatsOnMindComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'whats-on-mind',
  templateUrl: 'whats-on-mind.html'
})
export class WhatsOnMindComponent {

  @Input('handle') handle;
  text: string;
  userName: string ;
  userPic: string;
  
  constructor(
    private navCtrl: NavController,
	public user: User,
	public nav: Nav,
  ) {
    this.userPic = this.user.getProfilePic();
    
  }
  
  updateStatus(){
    this.nav.push('WhatsOnMindPage',this.handle);
  }
  
  
}
