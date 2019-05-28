import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';
import { Firebase } from '@ionic-native/firebase/ngx';

import { AngularFireAuth } from '@angular/fire/auth';
import { Platform } from 'ionic-angular';



/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  constructor(
    public http: HttpClient,
    public firebase: Firebase,
    public afDB: AngularFireDatabase,
    public afAU: AngularFireAuth,
    public platform: Platform
    ) {
   
  }


  // adduser

  addUser(userDetails){  
    

    var promise = new Promise((resolve, reject)=>{

      this.afAU.auth.createUserWithEmailAndPassword(userDetails.user_email, userDetails.user_password)

      .then((res)=>{
        
        this.get_token().then((token)=>{        

            var userData = {
              firstName: userDetails.user_firstname,
              lastName: userDetails.user_lastname,
              email: userDetails.user_email,
              deviceToken: token,
              status: 'online'
            }

            this.afDB.database.ref('/users').child(this.get_current_user()).set(userData).then((res: any)=>{

              resolve(true);
      
            }).catch((err)=>{
              reject(true);
              console.log(err);
            })


        }).catch(err=>{

            var userData = {
              firstName: userDetails.user_firstname,
              lastName: userDetails.user_lastname,
              email: userDetails.user_email,
              deviceToken: 'No-token',
              status: 'online'
            }

            this.afDB.database.ref('/users').child(this.get_current_user()).set(userData).then((res: any)=>{

              resolve(true);
      
            }).catch((err)=>{
              reject(true);
              console.log(err);
            })
        })


      }).catch((err)=>{
        // user not created

      });    

    })  

    return promise;
  }


  // login to firebase

  firebaseLogin(userDetails){
    var promise = new Promise((resolve, reject)=>{

        this.afAU.auth.signInWithEmailAndPassword(userDetails.user_name, userDetails.user_password)
        .then((res)=>{
          this.afDB.database.ref('/users').child(this.get_current_user()).update({
            status: 'online'
          }).then(()=>{
            resolve(true);
          }).catch(err=>{
            reject(err);
          })
        })
        .catch(err=>{
          reject(err);
        })

    })
    return promise;
  }



  //  get token

  get_token(){

    var promise = new Promise((resolve, reject)=>{

        this.firebase.getToken().then((token)=>{
          resolve(token);
        }).catch(err=>{
          reject(err);
        })

    })

    return promise;
    
  }


  get_current_user(){

    return this.afAU.auth.currentUser.uid;    

  }

  setUserOffline(){
    
    var promise = new Promise((resolve, reject)=>{
      var uid = this.afAU.auth.currentUser.uid;
      this.afDB.database.ref('/users').child(uid).update({
        status: 'offline'
      }).then(()=>{ resolve(true); }).catch((err)=>{ reject(err); })
    })

    return promise;

  }


}
