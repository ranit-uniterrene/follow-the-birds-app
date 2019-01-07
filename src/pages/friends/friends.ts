import { Component } from '@angular/core';
import { IonicPage, Nav, NavController, NavParams } from 'ionic-angular';

import { User } from '../../providers';
/**
 * Generated class for the FriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {
	public onlineUsers = [];
	private profile_id : number;
	friendLists: any;
	friendzone: string = "suggested";
	pendindFriendLists: any;
	getSuggestedUsers: any = [];
	constructor(public navCtrl: NavController, public user: User, public navParams: NavParams, nav:Nav ) {
	  this.profile_id = navParams.get('user_id') || localStorage.getItem('user_id');
	}

  ionViewDidLoad() {
	this.user.getfriends(this.profile_id)
	.then(data => {
		this.friendLists = data[0];
	});
	
	this.user.getSentRequest('sent_requests',parseInt(localStorage.getItem('user_id')))
	.then(data => {
		this.pendindFriendLists = data[0];
	});
	
	this.user.getSuggestedUser('all',parseInt(localStorage.getItem('user_id')))
	.then(data => {
		this.getSuggestedUsers = data[0];
		console.log(this.getSuggestedUsers);
	});
		
  }
  
  getOnlineUsers(){
	 this.user.getOnlineUsers({user_id: parseInt(localStorage.getItem('user_id'))})
	.then(data => {
		this.onlineUsers = data[0];
	}); 
  }
  
	addAction(event,user) {
	//	console.log(event.target.parentNode.parentNode.parentNode.innerText = "You are now Friends");
		this.connectAction("friend-add",user.user_id);
		event.target.parentNode.parentNode.innerText = "Friend request sent";	
		this.pendindFriendLists.push(user);	
	}
	
	removeAction(event,user_id) {
		event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
		this.connectAction("friend-remove",user_id);
	}
	cancelRequestAction(event,user_id) {
		this.connectAction("friend-cancel",user_id);
		event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
	}
	
	messageAction(profile){
		let recipient = {
			name:profile.user_firstname+' '+profile.user_lastname,
			picture:profile.user_picture,
			id:profile.user_id
	    };
		this.navCtrl.push('ViewMessagePage', {conversation: recipient});
	}
	
	connectAction(type,user_id){
		let params :any = {
			'do': type,
			'id': user_id,
			'my_id' : localStorage.getItem('user_id')
		};
		this.user.connection(params).subscribe((resp) => {						
			
		}, (err) => {
		
		});
	}
	

  viewProfile(user_name,user_id) {
		this.navCtrl.setRoot('ProfilePage', {user_name: user_name,user_id:user_id});
  } 
  
  goBack(){
	  this.navCtrl.setRoot("HomePage");
  }
}
