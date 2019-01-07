import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { User } from '../../providers';
/**
 * Generated class for the EditDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-details',
  templateUrl: 'edit-details.html',
})
export class EditDetailsPage {
  profile : any = {
	'user_id':'',
	'user_firstname':'',
	'user_lastname':'',
	'user_gender':'',
	'user_birthdate':'',
	'user_relationship':'',
	'user_biography':'',
	'user_website':'',
	'user_work_title':'',
	'user_work_place':'',
	'user_current_city':'',
	'user_hometown':'',
	'user_edu_school':'',
	'user_edu_major':'',
	'user_edu_class':'',
  };
  edit_info: string = "basic";
  constructor(	
	public navCtrl: NavController, 
	public navParams: NavParams, 
	public user: User,
	public loadingCtrl: LoadingController,
	public toastCtrl: ToastController
  ) {
	  let records = navParams.get('profile');
	  for (var key in this.profile) {
		this.profile[key] = records[key]
	  }
	  
  }

  ionViewDidLoad() {
    
  }
  
  goBack(){
	  this.navCtrl.setRoot("HomePage");
  }
  
  saveChanges(){
	let loading = this.loadingCtrl.create({
			content: 'Updating Records...'
	});
	loading.present();
	this.user.saveUserRecord(this.profile).subscribe((resp) => {
		loading.dismiss();	
		let toast = this.toastCtrl.create({
			message: "Records has been saved!",
			duration: 3000,
			position: 'top'
		});
		toast.present();
		console.log(resp);
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
