import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';
import { Observable, Subject, ReplaySubject} from 'rxjs';
import { FirstRunPage } from '../pages';
import { Settings } from '../providers';
import { AlertController } from 'ionic-angular';
import { Badge } from '@ionic-native/badge';
import { User } from '../providers';
import { AndroidPermissions } from '@ionic-native/android-permissions';
@Component({
  template: `<ion-menu [content]="content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Pages</ion-title>
      </ion-toolbar>
    </ion-header>    

    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = FirstRunPage;
  public alertShown:boolean = false;
  @ViewChild(Nav) nav: Nav;
  pages: any[] = [
    { title: 'Tutorial', component: 'TutorialPage' },
    { title: 'Welcome', component: 'WelcomePage' },
    { title: 'Tabs', component: 'TabsPage' },
    { title: 'Cards', component: 'CardsPage' },
    { title: 'Content', component: 'ContentPage' },
    { title: 'Login', component: 'LoginPage' },
    { title: 'Signup', component: 'SignupPage' },
    { title: 'Master Detail', component: 'ListMasterPage' },
    { title: 'Friends', component: 'FriendsPage' },
    { title: 'Photos', component: 'PhotosPage' },
    { title: 'Events', component: 'EventsPage' },
    { title: 'Groups', component: 'GroupsPage' },
    { title: 'Menu', component: 'MenuPage' },
    { title: 'Settings', component: 'SettingsPage' },
    { title: 'Search', component: 'SearchPage' },
    { title: 'Forget Password', component: 'ForgetPasswordPage' },
    { title: 'OTP page', component: 'OtpPage' },
    { title: 'Reset Password page', component: 'ResetPasswordPage' },
    { title: 'Profile page', component: 'ProfilePage' }
    
  ]
  public notificationCount = '';
  sub : any = '';
  constructor(private translate: TranslateService, private androidPermissions: AndroidPermissions, public badge: Badge,public user: User, private alertCtrl: AlertController, platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#750bb5');
      //this.statusBar.styleBlackOpaque();
      this.splashScreen.hide();
	  this.sub = Observable.interval(3000)
			.subscribe((val) => { this.getNotifictionData() });
	 /*  platform.registerBackButtonAction(() => {
        if (this.alertShown==false) {
          this.presentConfirm();  
        }
	 }, 0) */
	 this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.STORAGE, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
   });
    this.initTranslate();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }
  
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Exit',
      message: 'Do you want Exit?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.alertShown=false;
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            navigator['app'].exitApp();         
          }
        }
      ]
    });
     alert.present().then(()=>{
      this.alertShown=true;
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  getNotifictionData(){
	this.user.getLiveLiteData({id: localStorage.getItem('user_id')}).subscribe((resp) => {	
		if(resp['user_live_notifications_counter'] > this.notificationCount){
		}
		this.badge.set(resp['user_live_notifications_counter']);
	}, (err) => {
		
	});	
  }
}
