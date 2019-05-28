import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, AlertController, LoadingController   } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { User } from '../../providers';

import { FirebaseProvider } from '../../providers/firebase/firebase';
/**
 * Generated class for the UserSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-settings',
  templateUrl: 'user-settings.html',
})
export class UserSettingsPage {
  private imageURL = "https://followthebirds.com/content/uploads/";
  private profile : any = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl : AlertController,
    public loadingCtrl: LoadingController,
    private camera: Camera,
  public user: User,
  public firebaseProvider: FirebaseProvider,
    public nav: Nav) {
		for (var i = 0; i < localStorage.length; i++){
			this.profile[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));
			// do something with localStorage.getItem(localStorage.key(i));
		}
  }


  ionViewDidEnter() {
	this.user.updateProfile(parseInt(localStorage.getItem('user_id'))).subscribe(data => {
		if(data){
			this.profile = data;
		} else {
		
		}
		
	});
  }
  
  openTerm(){
	this.navCtrl.push("TermsPage");	
  }
  
  viewProfile(){
	  this.nav.push('ProfilePage', {user_name: this.profile.user_name,user_id:this.profile.user_id});  
  }
  
  listFriends(){
	  this.nav.push('FriendsPage',{'user_id':this.profile.user_id});
  }
  
  listGroups(){
	  this.nav.push('GroupsPage',{'user_id':this.profile.user_id});
  }
  
  listEvents(){
	  this.nav.push('EventsPage',{'user_id':this.profile.user_id});
  }
  
  listPages(){
  	this.nav.push('PagesPage',{'user_id':this.profile.user_id});
  }
  
  accoutSettings(){
	  this.nav.push('AccountSettingsPage');
  }
  
  privacySettings(){
	  this.nav.push('PrivacySettingsPage');
  }
  
  securitySettings(){
	  this.nav.push('SecuritySettingsPage');
  }
  
  blockSettings(){
	  this.nav.push('BlockSettingsPage');
  }
  
  goVaults(){
	  this.nav.push('VaultsPage');
  }
  
  logouta(){
    localStorage.clear();
    this.nav.setRoot('LoginPage')
  }
  
  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Logging out...",
      duration: 1000
    });
    loader.present();

    loader.onDidDismiss(() => {
      localStorage.clear();
       this.nav.setRoot('WelcomePage')
      console.log('Dismissed loading');
    });
  }

  logout() {
    const confirm = this.alertCtrl.create({
      title: 'Logout?',
      message: 'Are you sure want to logout?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Logout',
          handler: () => {
            console.log('Agree clicked');
            this.firebaseProvider.setUserOffline().then(()=>{
              this.presentLoading();
            }).catch(err=>{ 

            })
            
            
          }
        }
      ]
    });
    confirm.present();
  }

}
