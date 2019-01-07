import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, NavParams, Platform, ActionSheetController, ToastController, MenuController, ModalController, AlertController } from 'ionic-angular';
import { FirstRunPage} from '../';
import { Post } from '../../providers/post/post';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { User } from '../../providers';
import { StorageProvider } from '../../providers/storage/storage';
import { PhotoViewer,PhotoViewerOptions } from '@ionic-native/photo-viewer';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Observable, Subject, ReplaySubject} from 'rxjs';
/**
 * Generated class for the PostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  @ViewChild('videoPlayer') mVideoPlayer: any;	
  postFeeds: any = [];
  post_type: any = {
	shared: 'shared',
	link: 'shared a link',
	poll: 'created a poll',
	product: 'added new product for sell',
    article: 'added new article',
    video : 'added a video',
    audio: 'added an audio',
    file: 'added a file',
    photos: 'added a photo',
	profile_picture: 'updated his profile picture',
	profile_cover: 'updated his cover photo',
	page_picture: 'updated page picture',
	page_cover: 'updated cover photo',
	group_picture: 'updated group picture',
	group_cover: 'updated group cover',
	event_cover: 'updated event cover'
  };
   sub : any = '';
   public postElement = [];
   public sharedInfo = [];
   private pageCount = 2;
   private arrayPosition = 0;
   private isAndroid = false;
   private mediapath = "https://dev.followthebirds.com/content/uploads/";
   constructor(
    public navCtrl: NavController, 
    public user: User,
    public post: Post,  
    public storage: StorageProvider,
    public toastCtrl: ToastController,
    public navParams: NavParams,  
    private camera: Camera,
	public actionSheetCtrl: ActionSheetController,
    public menu: MenuController,
	private photoViewer: PhotoViewer,
    public nav: Nav,
	public modalCtrl: ModalController,
	private transfer: FileTransfer,
	private file: File,
	private platform: Platform,
	private alertCtrl: AlertController	
  ) {
	  
  }
  
  ionViewDidLoad() {
	this.isAndroid = this.platform.is("android");
	this.postElement['handle'] = "me";
	this.postElement['id'] = '';  
    this.post.getfeeds('newsfeed',localStorage.getItem('user_id'),localStorage.getItem('user_id'),{})
    .then(data => {
		this.postFeeds = [];
		let item = data[0];
		localStorage.setItem('last_post_live','newsfeed-'+item[0].post_id);
		for (var key in item) {
		  this.postFeeds.push(item[key]);
		}
    });
	
	
  }
  
  ionViewDidEnter(){
	this.sub = Observable.interval(3000)
		.subscribe((val) => { this.getLiveLitePost() });
  }
  
  ionViewDidLeave() {
	this.sub.unsubscribe();
  }
  
  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.post.getfeeds('newsfeed',localStorage.getItem('user_id'),localStorage.getItem('user_id'),{'page': this.pageCount})
		.then(data => {			
			if(data[0].length > 0) {
				let item = data[0];
				for (var key in item) {
				  this.postFeeds.push(item[key]);
				}
			}
		});
	  this.pageCount = this.pageCount + 1;
      infiniteScroll.complete();
    }, 500);
  }
  
  doRefresh(refresher) {
	this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
 
  viewImage(url){
	const option : PhotoViewerOptions = {
		  share: true
		};
	this.photoViewer.show(this.mediapath+url,"Image Preview",option);
  }
  
  
  
  viewPost(post) {
	this.nav.push('ViewPostPage', {post: post});
  }
  
  viewProfile(user_name,user_id) {
	this.nav.setRoot('ProfilePage', {user_name: user_name,user_id:user_id});
  } 

  downloadAttachment(filePath){
	  let arr = filePath.split('/');
	  var filename = arr.pop();
	  let url = encodeURI(filePath);  
	  const fileTransfer: FileTransferObject = this.transfer.create();
	  fileTransfer.download(this.mediapath+filePath, this.file.dataDirectory + filename).then((entry) => {
		let toast = this.toastCtrl.create({
			message: "Attachment bas been download",
			duration: 3000,
			position: 'top'
		});
	  }, (error) => {
		// handle error
		 let toast = this.toastCtrl.create({
			message: "Downloading failure! retry.",
			duration: 3000,
			position: 'top'
		});
	 });
  }
  
  viewComments(comments,post_id){
	const commentsModal = this.modalCtrl.create('CommentsPage',{comments,'post_id':post_id,'handle':'post'});
	commentsModal.present();
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
		console.log("cancel clicked");
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
	
  postActivity(event,post): void
  {
	let  buttons : any = [
		{
		  icon: !this.platform.is('ios') ? 'ios-bookmark' : null,	
		  text: 'Save Post',
		  handler: () => {
			this.reactAction('save_post',post.post_id);
		  }
		}
	];	
	if(post.author_id != localStorage.getItem('user_id')){
		let report : any = {
		  icon: !this.platform.is('ios') ? 'ios-flag' : null,		
		  text: 'Report Post',
		  handler: () => {
			this.reportAction("post",post.post_id)
		  }
		};
		
		let hide : any = {
		  icon: !this.platform.is('ios') ? 'ios-eye-off' : null,		
		  text: 'Hide Post',
		  handler: () => {
			event.target.parentNode.parentNode.parentNode.parentNode.remove();
			this.reactAction("hide_post",post.post_id)
		  }
		};
		
		
		buttons.push(report);
		buttons.push(hide);
	}
	if(post.author_id == localStorage.getItem('user_id')){
		let btn : any = {
		  icon: !this.platform.is('ios') ? 'ios-trash' : null,		
		  text: 'Delete Post',
		  handler: () => {
			const confirm = this.alertCtrl.create({
			  title: 'Delete post?',
			  message: 'Once you delete you can not undo this step.',
			  buttons: [
				{
				  text: 'Cancel',
				  handler: () => {
					
				  }
				}
				,{
				  text: 'Delete',
				  handler: () => {
					event.target.parentNode.parentNode.parentNode.parentNode.remove();
					this.reactAction("delete_post",post.post_id)
				  }
				}
			  ]
			});
			confirm.present();  
		  }
		};
		buttons.push(btn);
	}
	const actionSheet = this.actionSheetCtrl.create({
	  buttons
	});
	actionSheet.present();
  }
  
	getBackgroundStyle(url) {
		if(!url){
			return 'url(assets/followthebirdImgs/no-profile-img.jpeg)'
		} else {
			return 'url(' + this.mediapath+url + ')'
		}
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
	
  reactAction(type,post_id){
	let params :any = {
		'do': type,
		'id': post_id,
		'my_id' : localStorage.getItem('user_id')
	};
	this.post.reaction(params).subscribe((resp) => {						
		
	}, (err) => {
	
	});
  }
  
  
  reportAction(handle,id){
	let params :any = {
		'handle': handle,
		'id': id,
		'my_id' : localStorage.getItem('user_id')
	};
	this.user.report(params).subscribe((resp) => {						
	  let toast = this.toastCtrl.create({
		message: "Report has been submitted successfully",
		duration: 3000,
		position: 'top',
		dismissOnPageChange: true
	  });
	  toast.present();
	}, (err) => {
	  let toast = this.toastCtrl.create({
		message: "Failed to Submit Report. Please Try Again",
		duration: 3000,
		position: 'top',
		dismissOnPageChange: true
	  });
	  toast.present();
	});
  }
  
  getLiveLitePost(){
	this.user.getLiveLitePost({user_id: localStorage.getItem('user_id'),last_post_live: localStorage.getItem('last_post_live')}).then((data) => {	
		let item : any = data;
		if(item.length > 0){
			localStorage.setItem('last_post_live','newsfeed-'+data[0].post_id);
			for (var key in item) {
			  this.postFeeds.unshift(item[key]);
			}
		}
	}, (err) => {
			
	});	
  }	
}
  
