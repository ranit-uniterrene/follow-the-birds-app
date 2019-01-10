import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { PageProvider } from '../../providers/page/page';
/**
 * Generated class for the PageEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-edit',
  templateUrl: 'page-edit.html',
})
export class PageEditPage {
  
  public editPage = {
	  page_id:'',
	  page_title:'',
	  page_username:'',
	  page_category:'',
	  page_description:'',
	  my_id :'',
  }
  public pageCategories : any = [];
  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams, public page: PageProvider) {
    this.editPage = navParams.get('page');
    this.loadPagesCategories();
  }

  loadPagesCategories(){
    this.page.getpageCategories()
    .then(data => {
		this.pageCategories = data[0];
    });
	
  }

  editPageAction(){
    this.editPage.my_id = localStorage.getItem('user_id');
    this.page.edit_page(this.editPage).subscribe((resp) => {
			let toast = this.toastCtrl.create({
				message: "Page has been successfully updated",
				duration: 3000,
				position: 'top'
			});
			toast.present();
			this.navCtrl.pop();
		}, (err) => {
			let toast = this.toastCtrl.create({
				message: "Failed to update Page! Try Again later",
				duration: 3000,
				position: 'top'
			});
			toast.present();
		});
  }

}
