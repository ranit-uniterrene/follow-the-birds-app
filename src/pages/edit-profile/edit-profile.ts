import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  profile : any = {
	'user_firstname':'',
	'user_lastname':'',
	'user_gender':'',
	'user_birthdate':'',
	'user_relationship':'',
	'user_website':'',
  };
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
	  this.profile = navParams.get('profile');
  }

  ionViewDidLoad() {
    console.log(this.profile);
  }
  
  goBack(){
	this.navCtrl.setRoot("HomePage");
  } 
}
