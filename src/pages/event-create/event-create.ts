import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams } from 'ionic-angular';
import { EventsProvider } from '../../providers/events/events';
/**
 * Generated class for the EventCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-create',
  templateUrl: 'event-create.html',
})
export class EventCreatePage {
  private event : any = {
	  event_title:'',
	  event_location:'',
	  event_start_date:'',
	  event_end_date:'',
	  event_privacy:'',
	  event_description:'',
	  my_id:localStorage.getItem('user_id'),
  };
  public eventCategories : any = [];
  constructor(public navCtrl: NavController, public events: EventsProvider, public toastCtrl: ToastController, public navParams: NavParams) {
	 this.loadEventsCategories();
	 console.log(this.eventCategories);
  }
  
  loadEventsCategories(){
    this.events.geteventCategories()
    .then(data => {
		this.eventCategories = data[0];
    });
	
  }
  
  createEvent(){
	this.events.create_event(this.event).subscribe((resp) => {
		let toast = this.toastCtrl.create({
			message: "Event has been successfully created",
			duration: 3000,
			position: 'top'
		});
		toast.present();
		this.navCtrl.push("EventsPage",{eventzone:'manage'});
	}, (err) => {
		let toast = this.toastCtrl.create({
			message: "Failed to create event! Try Again later",
			duration: 3000,
			position: 'top'
		});
		toast.present();
	});
  }

}
