import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Slides } from 'ionic-angular';
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
	@ViewChild('slides') slides: Slides;
	private story : any = [];
	private mediaStory : any = [];
	private imageURL = "https://followthebirds.com/content/uploads/";
	public loaderWidth : number = 0;
	sub : any = '';
	constructor(private navCtrl: NavController, private navParams: NavParams, private platform: Platform) {
	  this.story = navParams.get('story');
	   if(this.story.media != 'null'){
		this.mediaStory = JSON.parse(this.story.media);
	  } 
	}

  ionViewDidLoad() {	
	/* for(var key in this.story.media){
		console.log(this.story);
	} */   
  }
  
  ionViewDidLeave() {	
	//alert(); 
  }
  
  slideNext() {
    this.slides.slideNext();
	
  }
  
  lineLoader(){	
	let timer = 5000;
	this.loaderWidth = 0;
	this.lineIncrement(timer);
  }
  
  lineIncrement(timer){
	var interval;
	clearInterval(interval);
	var smooth = 10;
	var unit = (smooth*100)/timer;
    var width = unit;
	interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            this.loaderWidth = 0;
        } else {
            width = width + unit;
            this.loaderWidth = width
        }
    }, smooth);
  }
  
  closeModal(){
	 this.navCtrl.pop();
  }

}
