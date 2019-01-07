import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav , LoadingController, ToastController} from 'ionic-angular';

import { ForgetPasswordProvider } from '../../providers/forget-password/forget-password'
/**
 * Generated class for the ForgetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
})
export class ForgetPasswordPage {
  public loading;
  account: { user_email: string } = {
		user_email: '',
	};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public nav: Nav,
    public forgetPass : ForgetPasswordProvider,
    public loadingController: LoadingController,
    public toastCtrl: ToastController
    ) {

      this.loading = this.loadingController.create({
        content: 'Generating OTP',
        dismissOnPageChange: true
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPasswordPage');
  }

  sendUserAuth(){
    this.loading.present();
    if(this.account){
      
      var datas = {email: '',code: ''};      
      this.forgetPass.getToken(this.account).subscribe((resp) => {    
        console.log(resp);   
       datas.code = resp['user_reset_key'];
        datas.email = resp['user_email'];
        this.loading.dismiss();
        this.nav.push('OtpPage', datas);       
      }, (err) => {
        this.loading.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Email id doesnot exist!',
          duration: 3000,
          position: 'top'
        });
      
        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });
      
        toast.present();

        this.nav.push('ForgetPasswordPage')
      });



    }
  }
  signup(){
    this.nav.push('SignupPage')
  }
  login(){
    this.nav.push('WelcomePage')
  }

}
