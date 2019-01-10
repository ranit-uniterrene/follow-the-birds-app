import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
/*
  Generated class for the EventsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Pages {

  constructor(public api: Api) { }
  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */

  getpageCategories(params?: any) {
		let categories = [];	
		let seq = this.api.get('events_categories', params).share();

		// don't have the data yet
		return new Promise(resolve => {
			seq.subscribe((res: any) => {
				categories.push(res);
				resolve(categories);
			}, err => {
				console.error('ERROR', err);
			});
		});
  }
  
  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  getgroups(params?: any) {
		let grouplist = [];	
		let seq = this.api.get('pages', params).share();

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
	
  
}