import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventsProvider } from '../../providers/events/events';
/**
 * Generated class for the EventMembersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-members',
  templateUrl: 'event-members.html',
})
export class EventMembersPage {
  public event_id : any;	
  eventMembers: string = "event_going";
  public going = [];
  public interested = [];
  public invited = [];
  private imageURL = "https://followthebirds.com/content/uploads/";
  constructor(public navCtrl: NavController, public events: EventsProvider, public navParams: NavParams) {
	this.event_id = navParams.get('event_id') || '';
	this.eventMembers = navParams.get('type') || '';
  }

  ionViewDidLoad() {
	this.getMembers('going');
	this.getMembers('interested');
	this.getMembers('invited');
  }
  
  getMembers(type){
	this.events.getEventProfile(parseInt(this.event_id),{'user_id':localStorage.getItem('user_id'),'filter':type}).then(data => {
		if(type == 'going'){
			this.going = data['members'];
		}
		if(type == 'interested'){
			this.interested = data['members'];
		}
		if(type == 'invited'){
			this.invited = data['members'];
		}
		
	 });  
  }

}
