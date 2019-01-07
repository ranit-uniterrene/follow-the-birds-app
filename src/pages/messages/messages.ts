import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../providers';
/**
 * Generated class for the MessagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
	public user_live_messages_counter = '';
  public onlineUsers = [];
  public offlineUsers = [];
  messagezone: string = "messages";
  public messages : any = [];
  public groups : any = [];
  private imageURL = "https://dev.followthebirds.com/content/uploads/";
  constructor(public navCtrl: NavController, public user: User, public navParams: NavParams) {
	  this.getOnlineUsers();
		this.getOfflineUsers();
		this.getProfileData(localStorage.getItem('user_id'));
  }

  ionViewDidLoad() {
	this.user.resetAlert({my_id:localStorage.getItem('user_id'),type:'messages'}).subscribe((resp) => {
		localStorage.setItem('user_live_messages_counter','0')
	}, (err) => {
		
	});	    
    this.user.getConversations({user_id:localStorage.getItem('user_id')}).then(data => {
		let item = data[0];
		for (var key in item) {
			if(item[key].multiple_recipients){
				this.groups.push(item[key]);
			} else {
				this.messages.push(item[key]);
			}
		 
		}		
	});
	}
	
	getProfileData(id){
		this.user.updateProfile(id).subscribe((resp) => {	
			this.user_live_messages_counter = resp['user_live_messages_counter'];
			if(this.user_live_messages_counter == '0'){
				this.user_live_messages_counter = '';
			}
		}, (err) => {
			
		});	
  }
  
  getOnlineUsers(){
	 this.user.getOnlineUsers({user_id: parseInt(localStorage.getItem('user_id'))})
	.then(data => {
		this.onlineUsers = data[0];
	}); 
  }
  
  getOfflineUsers(){
	 this.user.getOfflineUsers({user_id: parseInt(localStorage.getItem('user_id'))})
	.then(data => {
		this.offlineUsers = data[0];
	}); 
  }
  
  
  
  viewMessage(conversation){
	  this.navCtrl.setRoot('ViewMessagePage', {conversation: conversation});
  }
  
  viewMessageGroup(conversation,group){
	  this.navCtrl.setRoot('ViewMessagePage', {conversation: conversation,group:group});
  }
  
  
  createConversation(){
	this.navCtrl.setRoot('CreateMessagePage');
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
	messageAction(profile){
		let recipient = {
			name:profile.user_firstname+' '+profile.user_lastname,
			picture:profile.user_picture,
			id:profile.user_id
		};
		this.navCtrl.push('ViewMessagePage', {conversation: recipient});
	}
	
  goBack(){
	this.navCtrl.setRoot('HomePage');
  }
  

}
