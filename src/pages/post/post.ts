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
	slidesPerView : number = 1;
	public postElement = [];
	public sharedInfo = [];
	private pageCount = 2;
	private arrayPosition = 0;
	private isAndroid = false;
	private mediapath = "https://dev.followthebirds.com/content/uploads/";
	usermayknow : any = [];
	stories : any = [];
	height : number = 300;
	width : number = 300;
	private user_picture = localStorage.getItem('user_picture')
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
		platform.ready().then((readySource) => {
			this.width = platform.width();
			this.height = platform.height();
		});
		this.sub = Observable.interval(3000)
			.subscribe((val) => { this.getLiveLitePost() });
  }
  
  ionViewDidLoad() {
	this.isAndroid = this.platform.is("android");
	this.postElement['handle'] = "me";
	this.postElement['id'] = '';  
	this.post.getfeeds('newsfeed',localStorage.getItem('user_id'),localStorage.getItem('user_id'),{})
    .then(data => {
			this.postFeeds = [];
			let item = data[0];
			localStorage.setItem('last_post_live',item[0].post_id);
			for (var key in item) {
				this.postFeeds.push(item[key]);
			}
	});
	this.getStories()
  }
  
  /* ionViewDidLeave() {
		this.sub.unsubscribe();
  } */
  
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
  
  getPeopleYouMayKnow(){
	this.user.getPeopleYouMayKnow('may_know',parseInt(localStorage.getItem('user_id')))
	.then(data => {
		this.usermayknow = data[0];
	});
  }
  
  getStories(){
	this.user.getStories({user_id:localStorage.getItem('user_id')})
	.then(data => {
		this.stories = data[0];
		console.log(this.stories[0].media[0].src)
	});
  }
  
  viewStory(story){
	this.nav.push('StoryPage',{story: story});
  }
  
  viewPost(post) {
	if(post.photos_num == '1'){
		this.nav.push('ViewPhotoPage', {photo: post.photos[0]});
	} else {	
		this.nav.push('ViewPostPage', {post: post});
	}
  }
  
  viewProfile(post) {
		if(post.user_type == 'user'){
			this.nav.push('ProfilePage', {user_name: post.user_name,user_id:post.user_id});
		}
		if(post.user_type == 'page'){
			this.nav.push("PageProfilePage",{pageProfile:post});
		}
		if(post.user_type == 'group'){
			this.nav.push("GroupProfilePage",{groupProfile:post});
		}	
		if(post.user_type == 'event'){
			this.nav.push("EventProfilePage",{eventProfile:post});
		}	
		
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
  
  viewComments(index,comments,post_id){
	const commentsModal = this.modalCtrl.create('CommentsPage',{comments,'post_id':post_id,'handle':'post'});
	 commentsModal.onDidDismiss(data => {
		this.postFeeds[index].comments = data;
	});
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
	  let items :any = {
		type:'newsfeed',
		user_id:localStorage.getItem('user_id'),
		last_post_live:localStorage.getItem('last_post_live')
	  }
	this.user.getLiveLitePost(items).then((data) => {	
		let item : any = data;
		if(item.length > 0){
			localStorage.setItem('last_post_live',data[0].post_id);
			for (var key in item) {
			  this.postFeeds.unshift(item[key]);
			}
		}
	}, (err) => {
			
	});	
  }	
}
  
