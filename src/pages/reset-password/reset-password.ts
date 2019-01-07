import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav , LoadingController, ToastController, MenuController} from 'ionic-angular';

import { ForgetPasswordProvider } from '../../providers/forget-password/forget-password'
/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  public loading;
  account: { user_new_pass: string, user_confirm_pass:string } = {
    user_new_pass: '',
    user_confirm_pass: '',
  };
  
  reset_data : { user_email : string, user_password: string}= {  user_email : '', user_password: '' }
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public nav: Nav,
    public forgetPass : ForgetPasswordProvider,
    public loadingController: LoadingController,
    public menu: MenuController,
    public toastCtrl: ToastController
  ) {

    this.menu.enable(false); 

    if(this.navParams.data.email){
      this.reset_data.user_email = this.navParams.data.email;
    }else{
      this.nav.push('ForgetPasswordPage')
    }
    
    
    this.loading = this.loadingController.create({
      content: 'Changing Password...',
      dismissOnPageChange: true
    });

  }

  checkPassword(){
    if(this.account.user_new_pass && this.account.user_confirm_pass){
      if(this.account.user_new_pass == this.account.user_confirm_pass){
        if(this.account.user_new_pass.length >= 8 && this.account.user_confirm_pass.length >= 8){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    }else{  
      return false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }
  changePassword(){
    this.loading.present();
    if(this.account){
      
      this.reset_data.user_password = this.account.user_confirm_pass;
      var datas = {email: '',code: ''};      
      this.forgetPass.changePassword(this.reset_data).subscribe((resp) => {    
        console.log(resp);   
        if(resp['user_id']){
          this.presentToast('Password changed successfully!');
          this.nav.push('WelcomePage');
        }else{
          this.presentToast('Password not changed!');
          this.nav.push('WelcomePage');
        }
        this.loading.dismiss();
        //this.nav.push('OtpPage', datas);       
      }, (err) => {
        
      });



    }
  }
  signup(){
    this.nav.push('SignupPage')
  }
  login(){
    this.nav.push('WelcomePage')
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

}
