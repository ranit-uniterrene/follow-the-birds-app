import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController  } from 'ionic-angular';
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
  private imageURL = "https://followthebirds.com/content/uploads/";
  constructor(public navCtrl: NavController, public user: User, public navParams: NavParams, private alertCtrl: AlertController,public toastCtrl: ToastController) {
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
    const confirm = this.alertCtrl.create({
			title: 'Unblock '+member.user_firstname+' '+member.user_lastname+'?',
			message: 'If you unblock, '+member.user_firstname+' may be able to see your timeline and connect to you.',
			buttons: [
			{
				text: 'Cancel',
				handler: () => {
				
				}
			}
			,{
				text: 'Delete',
				handler: () => {
          event.target.parentNode.parentNode.parentNode.remove();
          this.connectAction('unblock',member.user_id);
				}
			}
			]
		});
		confirm.present();  
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
