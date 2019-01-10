import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../providers';
/**
 * Generated class for the BlockSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-block-settings',
  templateUrl: 'block-settings.html',
})
export class BlockSettingsPage {
  private users : any = [];
  private imageURL = "https://dev.followthebirds.com/content/uploads/";
  constructor(public navCtrl: NavController, public user: User, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.user.getBlocked({'my_id':localStorage.getItem('user_id')})
		.then(data => {
			let item = data[0];
			for (var key in item) {
			  this.users.push(item[key]);
			}
		});
  }

  unblockAction(event,member){
    event.target.parentNode.parentNode.parentNode.remove();
    this.connectAction('unblock',member.user_id);
  }

  connectAction(type,id,uid?: any){
    let params :any = {
      'do': type,
      'id': id,
      'uid': uid,
      'my_id' : localStorage.getItem('user_id')
    };
    this.user.connection(params).subscribe((resp) => {						
      
    }, (err) => {
    
    });
  }

}
