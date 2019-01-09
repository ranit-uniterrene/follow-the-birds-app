import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../providers';
import { PageProvider } from '../../providers/page/page';
/**
 * Generated class for the PagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages',
  templateUrl: 'pages.html',
})
export class PagesPage {
  pageszone: string = "suggested";
  pageLists: any = [];
  pageCategories: any = [];
  private imageURL = "https://dev.followthebirds.com/content/uploads/";
  constructor(public navCtrl: NavController, public navParams: NavParams, public page: PageProvider, public user: User) {
	  
  }

  ionViewDidLoad() {
      this.loadPage('suggested');
      this.loadPage('liked');
      this.loadPage('manage');
  }
  
  getItems(ev) {
	  this.navCtrl.setRoot("SearchPage",{'event':ev.target.value});
  }
  
  loadPagesCategories(){
    this.page.getpageCategories()
    .then(data => {
		this.pageCategories = data[0];
    });
  }
  
  loadPage(type){
    this.page.getPages({type: type,id:parseInt(localStorage.getItem('user_id'))})
    .then(data => {
		this.pageLists[type] = data[0];
    });
  }
  
  createPage(){
	this.navCtrl.push("PageCreatePage");
  }

  viewPage(page){
    this.navCtrl.push("PageProfilePage",{pageProfile:page});
   }
  
  pageLikeAction(event,type,id){
    this.connectAction(type,id);
    event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
  }
  
  pageUnlikeAction(event,type,id){
    this.connectAction(type,id);
    event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
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
