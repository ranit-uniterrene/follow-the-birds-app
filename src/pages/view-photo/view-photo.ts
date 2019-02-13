import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, NavParams, ActionSheetController, AlertController, ToastController, Platform, MenuController, ModalController, LoadingController } from 'ionic-angular';
import { User } from '../../providers';
import { Post } from '../../providers/post/post';
import { File } from '@ionic-native/file';
//import { FileOpener } from '@ionic-native/file-opener';
import { SocialSharing } from '@ionic-native/social-sharing';
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
	private file: File, 
    //private fileOpener: FileOpener, 
	private socialSharing: SocialSharing,
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
  
  viewComments(){
	if(this.photo.is_single){
		const commentsModal = this.modalCtrl.create('CommentsPage',{comments:this.photo.post.post_comments,'post_id':this.photo.post_id,'handle':'post'});
		commentsModal.present();
	} else {
		let comments = '';
		const commentsModal = this.modalCtrl.create('CommentsPage',{comments,'post_id':this.photo.photo_id,'handle':'photo'});
		commentsModal.present();
	}
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
  
  photoActivity(photo){
	  const actionSheet = this.actionSheetCtrl.create({
	  buttons: [
		{
		  icon: !this.platform.is('ios') ? 'ios-download' : null,	
		  text: 'Save to phone',
		  handler: () => {
			 // this.saveImg();
			//this.socialSharing.saveToPhotoAlbum(this.imageURL+photo.source)
		  }
		},{
		  icon: !this.platform.is('ios') ? 'share-alt' : null,		
		  text: 'Share External',
		  handler: () => {
			this.socialSharing.share("text", this.imageURL+photo.source,  '', this.imageURL+photo.source)
		  }
		},{
		  icon: !this.platform.is('ios') ? 'ios-alert' : null,		
		  text: 'Report Photo',
		  handler: () => {
			
		  }
		}
	  ]
	});
	actionSheet.present();
  }
  
  sharePostCtrl(post_id): void
	{
		let prompt = this.alertCtrl.create({
		title: 'Share this post',	
		inputs : [
		{
			type:'radio',
			label:'Share post now ',
			value:post_id
		},
		{
			type:'radio',
			label:'Write Post',
			value:post_id
		}],
		buttons : [
		{
			text: "Cancel",
			handler: data => {
			}
		},
		{
			text: "Share",
			handler: data => {
				this.sharePost('share',post_id);
			}
		}]});
		prompt.present();
	}
	
	sharePost(type,id){
		this.post.sharePost({'do':type,id:id,my_id:localStorage.getItem('user_id')}).subscribe((resp) => {
		  let toast = this.toastCtrl.create({
			message: "Post has been shared successfully",
			duration: 3000,
			position: 'top',
			dismissOnPageChange: true
		  });
        toast.present();	
		}, (err) => {
        let toast = this.toastCtrl.create({
          message: "Unable to post. Retry",
          duration: 3000,
          position: 'top',
          dismissOnPageChange: true
        });
        toast.present();
      });
	}
	
	//Save Image Function
 /*  saveImg() {
    let imageName = "followthebirds_"+Math.ceil(Math.random()*999999)+".jpg";
    //Copy our asset/img/FreakyJolly.jpg to folder we created
	this.file.copyFile(this.imageURL + "photos/2019/02/", "sngine_a7edf4bb5868494d5a1a394dda89e3e0.jpg", this.file.externalRootDirectory + "FollowTheBirds/ShareImage" + '//', imageName)
	  .then((entries) => {
		//Open copied file in device's default viewer
		this.fileOpener.open(this.file.externalRootDirectory + "FollowTheBirds/ShareImage" + "/" + imageName, 'image/jpeg')
		  .then(() => console.log('File is opened'))
		  .catch(e => alert('Error' + JSON.stringify(e)));
	  })
	  .catch((error) => {
		alert('error ' + JSON.stringify(error));
	  });
  }
 
  shareImg() { 
    let imageName = "FreakyJolly.jpg";
    const ROOT_DIRECTORY = 'file:///sdcard//';
    const downloadFolderName = 'tempDownloadFolder';
    
    //Create a folder in memory location
    this.file.createDir(ROOT_DIRECTORY, downloadFolderName, true)
      .then((entries) => {
 
        //Copy our asset/img/FreakyJolly.jpg to folder we created
        this.file.copyFile(this.file.applicationDirectory + "www/assets/imgs/", imageName, ROOT_DIRECTORY + downloadFolderName + '//', imageName)
          .then((entries) => {
 
            //Common sharing event will open all available application to share
            this.socialSharing.share("Message","Subject", ROOT_DIRECTORY + downloadFolderName + "/" + imageName, imageName)
              .then((entries) => {
                console.log('success ' + JSON.stringify(entries));
              })
              .catch((error) => {
                alert('error ' + JSON.stringify(error));
              });
          })
          .catch((error) => {
            alert('error ' + JSON.stringify(error));
          });
      })
      .catch((error) => {
        alert('error ' + JSON.stringify(error));
      });
  } */

}
