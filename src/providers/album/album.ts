import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Api } from '../api/api';
/*
  Generated class for the AlbumProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlbumProvider {

  constructor(public http: HttpClient,public api: Api) {
    console.log('Hello AlbumProvider Provider');
  }
   getalbums(user_id:number,params?: any) {
    
    }
  getAlbum(user_id:number,params?: any){
    let album :any;
    let seq = this.api.get('album/'+user_id, params).share();
    // don't have the data yet
    return new Promise(resolve => {
      seq.subscribe((res: any) => {
        album = res;
        resolve(album);
      }, err => {
        console.error('ERROR', err);
      });
    });
  }
}
