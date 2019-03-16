import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, NavParams, ActionSheetController, ToastController, Platform, MenuController, LoadingController, Slides } from 'ionic-angular';
import { FirstRunPage} from '../';
import { User } from '../../providers';
/**
 * Generated class for the PhotosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-photos',
  templateUrl: 'photos.html',
})
export class PhotosPage {
  page="0";
  photos : any = [];
  albums : any = [];
	private profile_id;
	photoalbum: string = "uploads";
  private imageURL = "https://followthebirds.com/content/uploads/";
  private pageCount = 2;
  private arrayPosition = 0;
  
  constructor(
	public navCtrl: NavController, 
	public user: User,
	public toastCtrl: ToastController,
	public navParams: NavParams, 
	public platform: Platform, 
	public menu: MenuController,
	public nav: Nav,
	public actionSheetCtrl: ActionSheetController,
	public loadingCtrl: LoadingController	
  ) {
		this.profile_id = navParams.get('user_id') || localStorage.getItem('user_id');
  }

  ionViewDidLoad() {
    this.user.getphotos(parseInt(localStorage.getItem('user_id')),{'type':'user','id':this.profile_id})
	.then(data => {
		let item = data[0];
		for (var key in item) {
		  this.photos.push(item[key]);
		}
		console.log(this.photos);
	});
	
	this.user.getalbums(parseInt(localStorage.getItem('user_id')),{'type':'user','id':this.profile_id})
	.then(data => {
		let item = data[0];
		for (var key in item) {
		  this.albums.push(item[key]);
		}
		console.log(this.albums);
	});
	
	
  }
  
  viewImage(photo){
		this.nav.push('ViewPhotoPage', {photo: photo});
  }
  
	
	getAlbum(album_id){
		this.navCtrl.push("AlbumPage",{'album_id':album_id});
	}
	
	goBack(){
	  this.navCtrl.setRoot("HomePage");
    }
  
  
  getBackgroundStyle(url) {
		if(!url){
			return 'url(assets/followthebirdImgs/no-profile-img.jpeg)'
		} else {
			return 'url(' + this.imageURL+url + ')'
		}
  }
  
  doInfinitePhotos(infiniteScroll) {
		
		setTimeout(() => {
		  this.user.getphotos(parseInt(localStorage.getItem('user_id')),{'type':'user','id':this.profile_id,'page': this.pageCount})	
			.then(data => {
				
				let item = data[0];
				console.log(data);
				for (var key in item) {
				  this.photos.push(item[key]);
				}
				
				console.log(this.photos);
			});
		  this.pageCount = this.pageCount + 1;
		  infiniteScroll.complete();
		}, 500);
  }
}
