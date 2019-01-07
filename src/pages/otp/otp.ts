import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav , LoadingController, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {
  public loading;
  account: { user_email: string } = {
		user_email: '',
  };
  userData : { email: string, code: string } = { email: '', code: '' };
  code1 : string;
  code2 : string;
  code3 : string;
  code4 : string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public nav: Nav,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController
    ) {
   
    this.userData.email = this.navParams.data.email;
    this.userData.code = this.navParams.data.code;    
    if(this.userData.code){

      this.loading = this.loadingCtrl.create({
        content: 'Checking...',
        dismissOnPageChange: true,
        duration:1000
      });

    }else{
      this.nav.push('ForgetPasswordPage');
    }
      
  }


  checkAllVal(){
    if(this.code1 && this.code2 && this.code3 && this.code4){
      return true;
    }else{
      return false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpPage');
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  
  }

  sendUserAuth(){
   // this.loading.present();
   this.presentLoadingDefault(); 

      var code : String = this.code1 + this.code2 +this.code3 +this.code4;
      console.log('Original code: '+this.userData.code);
      console.log('user input: '+ code);
      if(this.userData.code == code){
        this.presentToast('OTP Matched!');
        this.nav.push('ResetPasswordPage', this.userData);
        
      }else{       
        
        this.presentToast('OTP not Matched!');
      }     
    
  }

  signup(){
    this.nav.push('SignupPage')
  }
  login(){
    this.nav.push('WelcomePage')
  }
  resendOTP( email: string){
    this.nav.push('ForgetPasswordPage')
  }

}
