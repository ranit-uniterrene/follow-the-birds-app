import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { EventsProvider } from '../../providers/events/events';
import { User } from '../../providers';

/**
 * Generated class for the EventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {
    eventzone: string = "suggested";
	eventLists: any = [];
	eventCategories: any = [];
	private imageURL = "https://dev.followthebirds.com/content/uploads/";
  constructor(public navCtrl: NavController, public events: EventsProvider, public navParams: NavParams, public user: User) {
	  this.loadEvent('suggested');
  }

  ionViewDidLoad() {
      this.loadEvent('going');
      this.loadEvent('interested');
      this.loadEvent('invited');
      this.loadEvent('manage');
      this.loadEventsCategories();
	  console.log(this.eventLists);
  }

  loadEvent(type){
    this.events.getevents({type: type,id:parseInt(localStorage.getItem('user_id'))})
    .then(data => {
		this.eventLists[type] = data[0];
    });
  }
  
  loadEventsCategories(){
    this.events.geteventCategories()
    .then(data => {
		this.eventCategories = data[0];
    });
  }
  
  viewEvent(eventProfile){
	this.navCtrl.push("EventProfilePage",{eventProfile:eventProfile.event_id});
  }
  
  createPage(){
	this.navCtrl.push("EventCreatePage");
  }
  
  eventInterestAction(type,event_id){
	this.connectAction(type,event_id);
  }

  eventUninterestAction(type,event_id){
	this.connectAction(type,event_id);
  }
  
  
  connectAction(type,event_id,uid?: any){
	let params :any = {
		'do': type,
		'id': event_id,
		'uid': uid,
		'my_id' : localStorage.getItem('user_id')
	};
	this.user.connection(params).subscribe((resp) => {						
		
	}, (err) => {
	
	});
  }
}
