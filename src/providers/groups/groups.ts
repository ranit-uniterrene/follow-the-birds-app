import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
/*
  Generated class for the EventsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Groups {

  constructor(public api: Api) { }
  
   /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  getgroups(params?: any) {
	let grouplist = [];	
	let seq = this.api.get('groups', params).share();

	// don't have the data yet
	return new Promise(resolve => {
		seq.subscribe((res: any) => {
			grouplist.push(res);
			resolve(grouplist);
		}, err => {
			console.error('ERROR', err);
		});
	});
  }
  
  create_group(groupInfo: any){
	let seq = this.api.post('create_group', groupInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
	}
	
	edit_group(groupInfo: any){
		let seq = this.api.post('edit_group', groupInfo).share();
		seq.subscribe((res: any) => {
			// If the API returned a successful response, mark the user as logged in
		}, err => {
			console.error('ERROR', err);
		});
		return seq;
	}
		
		

  getGroupProfile(id:number,params: any){
		let event :any;
		let seq = this.api.get('group-profile/'+id, params).share();
		// don't have the data yet
		return new Promise(resolve => {
			seq.subscribe((res: any) => {
				event = res;
				resolve(event);
			}, err => {
				console.error('ERROR', err);
			});
		});
  }

}