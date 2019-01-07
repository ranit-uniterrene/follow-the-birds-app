import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers';
import { User } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  currentItems: any = [];
  event : any;
  item : any;
  private imageURL = "https://dev.followthebirds.com/content/uploads/";
  constructor(public navCtrl: NavController, public navParams: NavParams, public items: Items, public user: User) { 
	this.event = navParams.get('event');
  }
  
  ionViewDidEnter(){
	this.getItems(this.event);
  }

  /**
   * Perform a service for the proper items.
   */
  getItems(ev) {
	let val = '';  
	if(ev.target){
		val = ev.target.value;
	} else {
		val = ev;
	}
    
    if (!val || !val.trim()) {
      this.currentItems = [];
      return;
    }
	this.user.queryUsers(parseInt(localStorage.getItem('user_id')),{
      query: val
    })
	.then(data => {
		this.currentItems = data[0];
	});
  }
  /**
   * Navigate to the detail page for this item.
   */

	viewProfile(user_name,user_id) {
		this.navCtrl.setRoot('ProfilePage', {user_name: user_name,user_id:user_id});
	} 
  
	/* addAction(item) {
		this.connectAction(item,"friend-add");
	}
	
	cancelRequestAction(item) {
		this.connectAction(item,"friend-cancel");
	}
	
	connectAction(item,type){
		console.log(item);
		let params :any = {
			'do': type,
			'id': item.user_id,
			'my_id' : localStorage.getItem('user_id')
		};
		this.user.connection(params).subscribe((resp) => {						
			
		}, (err) => {
		
		});
	} */
	goBack(){
	  this.navCtrl.setRoot("HomePage");
	}

}
