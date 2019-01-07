import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the ForgetPasswordProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ForgetPasswordProvider {

  constructor(
    public http: HttpClient,
    public api: Api
    ) {
    console.log('Hello ForgetPasswordProvider Provider');
  }


  getToken(emailData: any){
    
    let seq =  this.api.post('lost_pwd', emailData).share();
    seq.subscribe((res: any) => {      
      // If the API returned a successful response, mark the user as logged in
      if(res.user_activation_key != ''){        
        
      }else{
        return 'Please check your email! '
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
   
  }


  changePassword(password_data: any){
    let seq =  this.api.post('change_password', password_data).share();
    seq.subscribe((res: any) => {      
      // If the API returned a successful response, mark the user as logged in
      if(res.user_activation_key != ''){        
        
      }else{
        return 'Please check your email! '
      }
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }


}
