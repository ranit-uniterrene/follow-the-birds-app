import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams } from 'ionic-angular';
import { Groups } from '../../providers/groups/groups';
/**
 * Generated class for the GroupCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-create',
  templateUrl: 'group-create.html',
})
export class GroupCreatePage {
  private group : any = {
	  group_title:'',
	  group_username:'',
	  group_privacy:'',
	  group_description:'',
	  my_id:localStorage.getItem('user_id'),
  };
  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams, public groups: Groups) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupCreatePage');
  }
  
  createGroup(){
	  console.log(this.group);
	this.groups.create_group(this.group).subscribe((resp) => {
		let toast = this.toastCtrl.create({
			message: "Group has been successfully created",
			duration: 3000,
			position: 'top'
		});
		toast.present();
	}, (err) => {
		let toast = this.toastCtrl.create({
			message: "Failed to create Group! Try Again later",
			duration: 3000,
			position: 'top'
		});
		toast.present();
	});
  }

}
