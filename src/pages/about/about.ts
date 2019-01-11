import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Groups } from '../../providers/groups/groups';
import { PageProvider } from '../../providers/page/page';
import { EventsProvider } from '../../providers/events/events';
import { User } from '../../providers';
/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  public profile;
  public groupLists : any = [];
  public pageLists: any = [];
  public eventLists: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public page: PageProvider, public groups: Groups, public events: EventsProvider, public user: User) {
    this.profile = navParams.get('profile') || '';
  }

  ionViewDidLoad() {
    this.loadGroup('joined');
    this.loadPage('liked');
    this.loadEvent('interested');
  }

  loadGroup(type){
    this.groups.getgroups({type: type,id:parseInt(this.profile.user_id)})
    .then(data => {
		this.groupLists[type] = data[0];
    });
  }

  loadPage(type){
    this.page.getPages({type: type,id:parseInt(this.profile.user_id)})
    .then(data => {
		this.pageLists[type] = data[0];
    });
  }

  loadEvent(type){
    this.events.getevents({type: type,id:parseInt(this.profile.user_id)})
    .then(data => {
		this.eventLists[type] = data[0];
    });
  }

  viewEvent(eventProfile){
	  this.navCtrl.push("EventProfilePage",{eventProfile:eventProfile.event_id});
  }

  viewGroup(group){
    this.navCtrl.push("GroupProfilePage",{groupProfile:group});
  }
  
  viewPage(page){
    this.navCtrl.push("PageProfilePage",{pageProfile:page});
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
