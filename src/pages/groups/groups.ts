import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Groups } from '../../providers/groups/groups';
import { User } from '../../providers';
/**
 * Generated class for the GroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {
	groupzone: string = "discover";
	public groupLists : any = [];
	private imageURL = "https://dev.followthebirds.com/content/uploads/";
  constructor(public navCtrl: NavController, public navParams: NavParams, public user: User, public groups: Groups) {
  }

  ionViewDidLoad() {
      this.loadGroup('suggested');
      this.loadGroup('joined');
      this.loadGroup('manage');
     
	  console.log(this.groupLists);
  }

  loadGroup(type){
    this.groups.getgroups({type: type,id:parseInt(localStorage.getItem('user_id'))})
    .then(data => {
		this.groupLists[type] = data[0];
    });
  }
  
  viewGroup(group){
	 this.navCtrl.push("GroupProfilePage",{groupProfile:group});
  }
  
  createGroup(){
	  this.navCtrl.push("GroupCreatePage");
  }
  
  leaveGroupAction(event,type,group_id){
    event.target.parentNode.parentNode.parentNode.remove()
    this.connectAction(type,group_id)
  }

  joinGroupAction(event,type,group_id){
    event.target.parentNode.parentNode.parentNode.remove()
    this.connectAction(type,group_id)
  }

  connectAction(type,group_id){
		let params :any = {
			'do': type,
			'id': group_id,
			'my_id' : localStorage.getItem('user_id')
		};
		this.user.connection(params).subscribe((resp) => {						
			
		}, (err) => {
		
		});
	}
  

}
