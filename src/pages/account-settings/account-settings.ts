import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { User } from '../../providers';

/**
 * Generated class for the AccountSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-settings',
  templateUrl: 'account-settings.html',
})
export class AccountSettingsPage {
  settingszone: string = "email";
  
  emailForm : any = {
	'user_email':localStorage.getItem('user_email'), 
	'user_id':localStorage.getItem('user_id'), 
  }
  
  settings : any = {
	'user_id':localStorage.getItem('user_id'),  
	'current':'',
	'new':'',
	'confirm':'',
  }
  
  constructor(
	public navCtrl: NavController, 
	public navParams: NavParams, 
	public user: User,
	public loadingCtrl: LoadingController,
	public toastCtrl: ToastController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountSettingsPage');
  }
  
  onSegmentChange(){
	console.log(this.settingszone);
  }
  
  saveEmail(){
	let loading = this.loadingCtrl.create({
			content: 'Updating Email...'
	});
	loading.present();
	this.user.saveEmailAddress(this.emailForm).subscribe((resp) => {
		loading.dismiss();	
		let toast = this.toastCtrl.create({
			message: "Email has been saved!",
			duration: 3000,
			position: 'top'
		});
		toast.present();
		for (var key in this.emailForm) {
			localStorage.setItem(key,this.emailForm[key])
		}
	}, (err) => {
	  loading.dismiss();		
	  let toast = this.toastCtrl.create({
		message: "Failed to save email",
		duration: 3000,
		position: 'top'
	  });
	  toast.present();
	});
  }
  
  savePassword(){
	let loading = this.loadingCtrl.create({
			content: 'Updating Email...'
	});
	loading.present();
	this.user.savePassword(this.settings).subscribe((resp) => {
		loading.dismiss();	
		let toast = this.toastCtrl.create({
			message: "Password has been saved!",
			duration: 3000,
			position: 'top'
		});
		toast.present();
		/* for (var key in this.emailForm) {
			localStorage.setItem(key,this.emailForm[key])
		} */
	}, (err) => {
	  loading.dismiss();		
	  let toast = this.toastCtrl.create({
		message: "Failed to save password",
		duration: 3000,
		position: 'top'
	  });
	  toast.present();
	});
  }
  
	
}
