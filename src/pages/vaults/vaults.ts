import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { User } from '../../providers';
/**
 * Generated class for the VaultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vaults',
  templateUrl: 'vaults.html',
})
export class VaultsPage {
  
  public vaults = [];
  public filter = 'all';
  private handle = '';
  private handle_id = '';
  constructor(public navCtrl: NavController, public user: User, public navParams: NavParams, public modalCtrl: ModalController) {	  
	if(navParams.get('filter')){
		this.filter = navParams.get('filter');
	}
	this.handle = navParams.get('handle');
	this.handle_id = navParams.get('handle_id');
	console.log(this.handle+this.handle_id);
  }

  ionViewDidLoad() {
	this.user.getVaultStorage({my_id:localStorage.getItem('user_id'),filter:this.filter})
		.then(data => {
			let item = data[0];
			for (var key in item) {
			  this.vaults.push(item[key]);
			}
	});
	console.log(this.vaults);
  }
  
  goBack(){
	this.navCtrl.pop();
  }
  
  createVault(){
	const modal = this.modalCtrl.create('VaultCreatePage');
    modal.present();
  }
  
  viewVault(vault){
	this.navCtrl.push('ViewVaultPage', {vault:vault,handle:this.handle,handle_id:this.handle_id});
  }

}
