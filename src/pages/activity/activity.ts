import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../providers';
/**
 * Generated class for the ActivityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})
export class ActivityPage {
  profile = '';
  activities : any = [];
  public imageURL : any = "https://followthebirds.com/content/uploads/";	
  constructor(public navCtrl: NavController, public user: User, public navParams: NavParams) {
    this.profile = navParams.get('profile') || '';
  }

  ionViewDidLoad() {
    this.user.getActivitylog().then(data => {
			let item = data[0];
			for (var key in item) {
				this.activities.push(item[key]);
			}		
		});
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

}
