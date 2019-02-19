import { Component } from '@angular/core';
import { IonicPage, NavController, Nav, NavParams, ActionSheetController, ToastController, Platform, MenuController, LoadingController, } from 'ionic-angular';
import { FirstRunPage} from '../';
import { User } from '../../providers';
import { Badge } from '@ionic-native/badge';
/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  public notifications : any = [];
  private imageURL = "https://dev.followthebirds.com/content/uploads/";
  private pageCount = 1;
  constructor(
		public navCtrl: NavController, 
		public user: User,
		public toastCtrl: ToastController,
		public navParams: NavParams, 
		public platform: Platform, 
		public menu: MenuController,
		public nav: Nav,
		public badge: Badge,
		public actionSheetCtrl: ActionSheetController,
		public loadingCtrl: LoadingController
	) {
		this.user.resetAlert({my_id:localStorage.getItem('user_id'),type:'notifications'}).subscribe((resp) => {
			this.badge.clear();
			localStorage.setItem('user_live_notifications_counter','0');
		}, (err) => {
			
		});  
	}

  ionViewDidLoad() {
	
    this.user.getNotifications().then(data => {
			let item = data[0];
			for (var key in item) {
				this.notifications.push(item[key]);
			}		
		});
  }
  doRefresh(refresher) {
	this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  
  viewProfile(user_name,user_id) {
		this.nav.push('ProfilePage', {user_name: user_name,user_id:user_id});
  }
  
  isToday(data){
	 var date = data.split(' ');
	 var today = new Date();
	 var dd = today.getDate();
	 var mm = today.getMonth()+1; 
	 var yyyy = today.getFullYear();
	 
	 var pDate = date[0].split('-');
	 if(pDate[0] != yyyy ){
		 return false;
	 }else{
		 if(pDate[1] != mm){
			 return false;
		 }else{
			 if(pDate[2] != dd){
				 return false;
			 }else{
				 return true;
			 }
		 }
	 }
	 
  }
  
  doInfinite(infiniteScroll) {
	setTimeout(() => {
	  this.user.getNotifications({'page': this.pageCount}).then(data => {
		let item = data[0];
		for (var key in item) {
		  this.notifications.push(item[key]);
		}		
	});	
	  this.pageCount = this.pageCount + 1;
	  infiniteScroll.complete();
	}, 500);
  }

}
