import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';

import { User } from '../../providers';
/**
 * Generated class for the VaultCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vault-create',
  templateUrl: 'vault-create.html',
})
export class VaultCreatePage {

  public createVault = {
	  title:'',
	  vaultname:'',
	  file_type:'',
	  my_id: localStorage.getItem('user_id')
  }
  
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public toastCtrl: ToastController, public user: User) { }

  checkValid(){
	  if(this.createVault.title != '' && this.createVault.vaultname != '' && this.createVault.file_type != ''){
		  console.log(this.createVault);
		  return true;	  
	  } else {
		  return false;
	  }
  }
  
  createNewVault(){
	  
	this.user.createNewVault(this.createVault).subscribe((resp) => {
		let toast = this.toastCtrl.create({
			message: "Post has been shared successfully",
			duration: 3000,
			position: 'top',
			dismissOnPageChange: true
		  });
        toast.present();
        this.navCtrl.push("VaultsPage");
		}, (err) => {
        let toast = this.toastCtrl.create({
          message: "Unable to post. Retry",
          duration: 3000,
          position: 'top',
          dismissOnPageChange: true
        });
        toast.present();
    });
  }
  
  goBack(){
	  this.navCtrl.pop();
  }
 
}
