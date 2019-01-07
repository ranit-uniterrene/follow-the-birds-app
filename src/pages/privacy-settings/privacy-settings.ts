import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { User } from '../../providers';

/**
 * Generated class for the PrivacySettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-privacy-settings',
  templateUrl: 'privacy-settings.html',
})
export class PrivacySettingsPage {
  private privacySettings = {
	user_id:'',  
	user_privacy_basic:'',
	user_privacy_birthdate:'',
	user_chat_enabled:'',
	user_privacy_education:'',
	user_privacy_events:'',
	user_privacy_friends:'',
	user_privacy_groups:'',
	user_privacy_location:'',
	user_privacy_other:'',
	user_privacy_pages:'',
	user_privacy_photos:'',
	user_privacy_relationship:'',
	user_privacy_wall:'',
	user_privacy_work:''
  }  
  constructor(
	public navCtrl: NavController, 
	public navParams: NavParams, 
	public user: User,
	public loadingCtrl: LoadingController,
	public toastCtrl: ToastController
  ) {
	for (var key in this.privacySettings) {
		this.privacySettings[key] = localStorage.getItem(key);
	}
  }

  ionViewDidLoad() {
    console.log(this.privacySettings);
  }
  
  saveChanges(){
	let loading = this.loadingCtrl.create({
			content: 'Updating Records...'
	});
	loading.present();
	this.user.saveUserRecord(this.privacySettings).subscribe((resp) => {
		loading.dismiss();	
		let toast = this.toastCtrl.create({
			message: "Records has been saved!",
			duration: 3000,
			position: 'top'
		});
		toast.present();
		for (var key in this.privacySettings) {
			localStorage.setItem(key,this.privacySettings[key])
		}
	}, (err) => {
		loading.dismiss();		
	  let toast = this.toastCtrl.create({
		message: "Failed to save records",
		duration: 3000,
		position: 'top'
	  });
	  toast.present();
	});
  }

}
