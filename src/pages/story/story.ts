import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

/**
 * Generated class for the StoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-story',
  templateUrl: 'story.html',
})
export class StoryPage {
	private story;
	private mediaStory = [];
	private imageURL = "https://dev.followthebirds.com/content/uploads/";
	public loaderWidth : number = 0;
  constructor(private navCtrl: NavController, private navParams: NavParams, private platform: Platform) {
	  this.story = navParams.get('story');
	  this.mediaStory = JSON.parse(this.story.media);
  }

  ionViewDidLoad() {	
	/* for(var key in this.story.media){
		console.log(this.story);
	} */   
  }
  
  lineLoader(){	
    this.loaderWidth = 0;
	//this.lineIncrement();
  }
  
  lineIncrement(){
	let width = this.platform.width();
	setTimeout(() => {
			this.loaderWidth++;
			this.lineIncrement();
			console.log(this.loaderWidth);
	}, 1000);
  }

}
