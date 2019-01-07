import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageProvider {
	database: SQLiteObject;
	private databaseReady: BehaviorSubject<boolean>;
	private imageURL = "https://dev.followthebirds.com/content/uploads/";
  constructor(
	public httpclient: HttpClient,
	public sqlitePorter: SQLitePorter, 
	private storage: Storage, 
	private sqlite: SQLite, 
	private platform: Platform, 
	private transfer: FileTransfer,
	private file: File,
	private http: Http
  ) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'followthebirds.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              this.databaseReady.next(true);
            } else {
              this.fillDatabase();
            }
          });
        });
    });
  }
  
  fileTransfer: FileTransferObject = this.transfer.create();
  
  fillDatabase() {
    this.http.get('assets/followthebirds.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
          .catch(e => console.error(e));
      });
  }

  getUser(id:number){
	return this.database.executeSql("SELECT * FROM users WHERE user_id=?", [id]).then((data) => {
      let user : any = [];
      if(data.rows.length > 0) {		  
        for(var i = 0; i < data.rows.length; i++) {
          user.push({ user_id: data.rows.item(i).user_id, user_name: data.rows.item(i).user_name, user_email: data.rows.item(i).user_email, user_picture: data.rows.item(i).user_picture, user_picture_id: data.rows.item(i).user_picture_id, user_cover: data.rows.item(i).user_cover});
        }
      }
	  
      return user;
    }, err => {
      console.log('Error: ', err);
      return [];
    });  
  }
  
	users() {
		return this.database.executeSql("SELECT * FROM users", []).then((data) => {
		  let users = [];
		  if(data.rows.length > 0) {
			for(var i = 0; i < data.rows.length; i++) {
			  users.push({ id: data.rows.item(i).user_id, user_name: data.rows.item(i).user_name, user_email: data.rows.item(i).user_email, user_picture: data.rows.item(i).user_picture, user_cover: data.rows.item(i).user_cover, user_cover_id: data.rows.item(i).user_cover_id });
			}
		  }
		  return users;
		}, err => {
		  console.log('Error: ', err);
		  return [];
		});
	}

	insertUser(data) {
		let arr = [data.user_id, data.user_name, data.user_email, data.user_picture, data.user_picture_id, data.user_cover, data.user_cover_id];
		return this.database.executeSql("INSERT INTO users (user_id, user_name, user_email, 'user_picture', 'user_picture_id', 'user_cover', 'user_cover_id') VALUES (?, ?, ?, ?, ?, ?, ?)", arr).then(data => {
		  return data;
		}, err => {
		  return err;
		});
	}
	
	
	setUser(user : any){
		for (var key in user) {
		  if (user.hasOwnProperty(key)) {          
			  localStorage.setItem(key,user[key])
		  }
		}
		
		/* alert(" existed user id : "+this.isExistUser(user.user_id));
		if(this.isExistUser(user.user_id)){
			alert(" Not Exist ");
			this.insertUser(user);
		} */
	}
	
	
	isExistUser(id:number){
		return this.database.executeSql("SELECT * FROM users WHERE user_id=?", [id]).then((data) => {
		  let user_id : any ;
		  if(data.rows.length > 0) {		  
			for(var i = 0; i < data.rows.length; i++) {
				return data.rows.item(i).user_id;
			}
		  } else {
				return false;
		  }		  
		}, err => {
		  console.log('Error: ', err);
		  return [];
		}); 
	}

  // profie Picutre module

  checkprofilePic( picure: any ){
    return true; // if previously stored image and current image is same;
  }

	createFolder(){
		this.platform.ready().then(() =>{
			if(this.platform.is('android')) {
				this.file.checkDir(this.file.externalRootDirectory, 'FollowTheBirds').then(response => {
				}).catch(err => {
					this.file.createDir(this.file.externalRootDirectory, 'FollowTheBirds', false).then(response => {
						this.file.createDir(this.file.externalRootDirectory, 'FollowTheBirds/ProfilePic', false);
						this.file.createDir(this.file.externalRootDirectory, 'FollowTheBirds/CoverPic', false);
						this.file.createDir(this.file.externalRootDirectory, 'FollowTheBirds/Vault', false);
					}).catch(err => {
					
					}); 
				});
			}
		});
	}
	
	imageDownload(url,folder){
	  var arr = url.split("/");
	  var pic_name = arr[arr.length - 1];
	  const absurl = this.imageURL+url;
	  this.fileTransfer.download(absurl, this.file.externalRootDirectory + 'FollowTheBirds/'+folder+'/'+pic_name).then((entry) => {
		  return true;
	  }, (error) => {
		// handle error
	  });
	}

	
	getDatabaseState() {
		return this.databaseReady.asObservable();
	}




}
