import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, NavParams, ActionSheetController, AlertController, ToastController, Platform, MenuController, ModalController, LoadingController } from 'ionic-angular';
import { User } from '../../providers';
import { Post } from '../../providers/post/post';

/**
 * Generated class for the ViewPhotoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-photo',
  templateUrl: 'view-photo.html',
})
export class ViewPhotoPage {
  public photo : any = [];
  private imageURL = "https://dev.followthebirds.com/content/uploads/";
  constructor(public navCtrl: NavController, 
    public user: User,
    public post: Post,  
    public toastCtrl: ToastController,
    public navParams: NavParams,  
	public actionSheetCtrl: ActionSheetController,
	public alertCtrl: AlertController,
    public menu: MenuController,
    public nav: Nav,
	public modalCtrl: ModalController,
	private platform: Platform) {
	  this.photo = this.navParams.get('photo') || [];
  }

  ionViewDidLoad() {
    this.user.getPhoto(parseInt(localStorage.getItem('user_id')),{'photo_id':this.photo.photo_id})
		.then(data => {
		this.photo = data;
	});
  }
  
  viewComments(comments,post_id,handle){
	const commentsModal = this.modalCtrl.create('CommentsPage',{comments,'post_id':post_id,'handle':handle});
	commentsModal.present();
  }
  
  getBackgroundStyle(url) {
	if(!url){
		return 'url(assets/followthebirdImgs/no-profile-img.jpeg)'
	} else {
		return 'url(' + this.imageURL+url + ')'
	}
  }
  
  openSearch(){
    this.navCtrl.setRoot("SearchPage");
  }
  
  goBack(){
	 this.navCtrl.pop(); 
  }

}
