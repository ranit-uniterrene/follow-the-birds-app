import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
/*
  Generated class for the PageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PageProvider {

  constructor(public http: HttpClient,public api: Api) {
    console.log('Hello PageProvider Provider');
  }
  
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
  getPages(params?: any) {
	let pagelist = [];	
	let seq = this.api.get('pages', params).share();

	// don't have the data yet
	return new Promise(resolve => {
		seq.subscribe((res: any) => {
			pagelist.push(res);
			resolve(pagelist);
		}, err => {
			console.error('ERROR', err);
		});
	});
  }
  
  create_page(pageInfo: any){
	let seq = this.api.post('create_page', pageInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
	}
	
	getPageProfile(id:number,params: any){
		let event :any;
		let seq = this.api.get('page-profile/'+id, params).share();
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
