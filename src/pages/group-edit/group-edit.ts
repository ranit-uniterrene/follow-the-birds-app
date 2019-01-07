import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams } from 'ionic-angular';
import { Groups } from '../../providers/groups/groups';

/**
 * Generated class for the GroupEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-edit',
  templateUrl: 'group-edit.html',
})
export class GroupEditPage {
  private group; 
  
  public editGroup = {
	  group_id:'',
	  group_title:'',
	  group_name:'',
	  group_privacy:'',
	  group_description:'',
	  my_id :''
  }
  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams, public groups: Groups) {
	   this.editGroup = navParams.get('group');
  }

  
  editGroupAction(){
		this.editGroup.my_id = localStorage.getItem('user_id');
		this.groups.edit_group(this.editGroup).subscribe((resp) => {
			let toast = this.toastCtrl.create({
				message: "Group has been successfully updated",
				duration: 3000,
				position: 'top'
			});
			toast.present();
			this.navCtrl.pop();
		}, (err) => {
			let toast = this.toastCtrl.create({
				message: "Failed to update Group! Try Again later",
				duration: 3000,
				position: 'top'
			});
			toast.present();
		});
  }

}
