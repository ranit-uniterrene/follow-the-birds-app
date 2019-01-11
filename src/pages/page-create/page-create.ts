import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams } from 'ionic-angular';
import { PageProvider } from '../../providers/page/page';
/**
 * Generated class for the PageCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-create',
  templateUrl: 'page-create.html',
})
export class PageCreatePage {
  private pageC : any = {
	  page_title:'',
	  page_username:'',
	  page_category:'',
	  page_description:'',
	  my_id:localStorage.getItem('user_id'),
  };
  public pageCategories : any = [];
  constructor(public navCtrl: NavController, public page: PageProvider, public toastCtrl: ToastController,  public navParams: NavParams) {
	  this.loadPagesCategories();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PageCreatePage');
  }
  
  loadPagesCategories(){
    this.page.getpageCategories()
    .then(data => {
		this.pageCategories = data[0];
    });
	
  }
  
  createPage(){
		this.page.create_page(this.pageC).subscribe((resp) => {
			let toast = this.toastCtrl.create({
				message: "Page has been successfully created",
				duration: 3000,
				position: 'top'
			});
			toast.present();
			this.navCtrl.push("PagesPage",{pageszone:'manage'});
		}, (err) => {
			let toast = this.toastCtrl.create({
				message: "Failed to create Page! Try Again later",
				duration: 3000,
				position: 'top'
			});
			toast.present();
		});
  }
}
