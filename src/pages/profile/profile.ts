import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, NavParams, ActionSheetController, AlertController, ToastController, Platform, MenuController, LoadingController,ModalController } from 'ionic-angular';
import { FirstRunPage} from '../';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Post } from '../../providers/post/post';
import { User } from '../../providers';
import { StorageProvider } from '../../providers/storage/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhotoViewer,PhotoViewerOptions } from '@ionic-native/photo-viewer';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Observable, Subject, ReplaySubject} from 'rxjs';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
	@ViewChild('profilePhoto') profilePhoto;
	@ViewChild('coverPhoto') coverPhoto;	
	profileName : string;
	profile : any = [];
	friendLists : any = [];
	photos : any = [];
	profilePhotoOptions: FormGroup;
	coverPhotoOptions: FormGroup;
	sub : any = '';
	private imageURL = "https://dev.followthebirds.com/content/uploads/";
	private myId :number = parseInt(localStorage.getItem('user_id'));
	headerActive = false;
	private pageCount = 2;
	private arrayPosition = 0;
	private profile_id;
	public postElement = [];
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
  
  
	constructor(
		public navCtrl: NavController, 
		public user: User,
		public post: Post,
		public storage: StorageProvider,
		public toastCtrl: ToastController,
		public navParams: NavParams, 
		formBuilder: FormBuilder,	
		private camera: Camera,
		public platform: Platform, 
		public menu: MenuController,
		public nav: Nav,
		public actionSheetCtrl: ActionSheetController,
		private photoViewer: PhotoViewer,
		public loadingCtrl: LoadingController,
		public modalCtrl: ModalController,
		private transfer: FileTransfer,
		private file: File,
		private alertCtrl: AlertController			
    ) {
		this.profileName = navParams.get('user_name') || localStorage.getItem('user_name');
		this.profile_id = navParams.get('user_id') || localStorage.getItem('user_id');
		if(navParams.get('user_name')){
			this.headerActive = true;
		}
		this.profilePhotoOptions = formBuilder.group({
			file: "assets/followthebirdImgs/no-profile-img.jpeg",
			type: "photos",
			handle: "picture-user",
			multiple: false,
			user_id : localStorage.getItem('user_id')
		});
	  
		this.coverPhotoOptions = formBuilder.group({
			file: "assets/followthebirdImgs/coverimage.png",
			type: "photos",
			handle: "cover-user",
			multiple: false,
			user_id : localStorage.getItem('user_id')
		});
		
		this.post.getfeeds('posts_profile',this.profile_id,localStorage.getItem('user_id'),{'filter':'all'})
		.then(data => {
			let item = data[0];
			localStorage.setItem('last_post_live','posts_profile-'+item[0].post_id);
			for (var key in item) {
			  this.postFeeds.push(item[key]);
			}
		});
	}
	
	ionViewDidLoad(){
		this.user.getProfile(parseInt(localStorage.getItem('user_id')),{'user_name':this.profileName}).then(data => {
			this.profile = data;
			this.postElement['handle'] = "user";
			this.postElement['id'] = this.profile_id;
		});
		
		this.photos = [];
		this.friendLists = [];
		
		this.user.getphotos(parseInt(localStorage.getItem('user_id')),{'type':'user','id':this.profile_id})
		.then(data => {
			let item = data[0];
			for (var key in item) {
			  this.photos.push(item[key]);
			}
		});
		
		this.user.getfriends(parseInt(this.profile_id))
		.then(data => {
			let item = data[0];
			for (var key in item) {
			  this.friendLists.push(item[key]);
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
	
	doRefresh(refresher) {
		this.ionViewDidLoad();
		setTimeout(() => {
		  refresher.complete();
		}, 2000);
	}
	
	viewPost(post) {
		this.nav.push('ViewPostPage', {post: post});
	}
	  
	viewImage(photo){
		this.nav.push('ViewPhotoPage', {photo: photo});
	}
  
	viewProfile(user_name,user_id) {
		this.nav.setRoot('ProfilePage', {user_name: user_name,user_id:user_id});
	}
	
	viewPhotos(user_id){
		this.nav.setRoot('PhotosPage', {user_id: user_id});
	}
	
	editProfile(profile){
		this.nav.setRoot('EditProfilePage', {'profile': profile});
	}
	
	editDetails(profile){
		this.nav.setRoot('EditDetailsPage', {'profile': profile});
	}
	

	uploadProfilePicture() {
		const actionSheet = this.actionSheetCtrl.create({
		  title: 'Upload Profile Picture',
		  buttons: [
			{
			  icon: !this.platform.is('ios') ? 'ios-camera' : null,	
			  text: 'Take a Picture',
			  handler: () => {
				this.takeCameraSnap('profile')
			  }
			},{
			  icon: !this.platform.is('ios') ? 'ios-images' : null,		
			  text: 'Upload from gallery',
			  handler: () => {
				this.uploadFromGallery("profile")
			  }
			},{
			  icon: !this.platform.is('ios') ? 'trash' : null,
			  text: 'Remove profile photo',
			  handler: () => {
				  this.removePhoto({"my_id":localStorage.getItem('user_id'),"handle":"picture-user","id":this.profile_id})
			  }
			},{
			  icon: !this.platform.is('ios') ? 'close' : null,
			  text: 'Cancel',
			  role: 'cancel',
			  handler: () => {
			  }
			}
		  ]
		});
		actionSheet.present();
	}
	
	uploadCoverPicture() {
		const actionSheet = this.actionSheetCtrl.create({
		  title: 'Upload Cover Picture',
		  buttons: [
			{
			  icon: !this.platform.is('ios') ? 'ios-camera' : null,	
			  text: 'Take a Picture',
			  handler: () => {
				this.takeCameraSnap('cover')
			  }
			},{
			  icon: !this.platform.is('ios') ? 'ios-images' : null,		
			  text: 'Upload from gallery',
			  handler: () => {
				this.uploadFromGallery("cover")
			  }
			},{
			  icon: !this.platform.is('ios') ? 'trash' : null,
			  text: 'Remove cover photo',
			  handler: () => {
				  this.removePhoto({"my_id":localStorage.getItem('user_id'),"handle":"cover-user","id":this.profile_id})
			  }
			},{
			  icon: !this.platform.is('ios') ? 'close' : null,
			  text: 'Cancel',
			  role: 'cancel',
			  handler: () => {
			  }
			}
		  ]
		});
		actionSheet.present();
	}
  
	takeCameraSnap(type){
		const options: CameraOptions = {
		  quality: 500,
		  destinationType: this.camera.DestinationType.DATA_URL,
		  sourceType: this.camera.PictureSourceType.CAMERA,
		  encodingType: this.camera.EncodingType.JPEG,
		  mediaType: this.camera.MediaType.PICTURE,
		  allowEdit:true,
		  targetWidth: 500,
		  targetHeight: 500,
		  saveToPhotoAlbum: true,
		  correctOrientation: true //Corrects Android orientation quirks
		};	
		
		this.camera.getPicture(options).then((imageData) => {
		  // imageData is either a base64 encoded string or a file URI
		  if(type == 'profile'){			  
			this.profilePhotoOptions.patchValue({ 'file': "data:image/jpeg;base64,"+imageData }); 
			this.uploadProfilePhoto(this.profilePhotoOptions);
		  } else {
			this.coverPhotoOptions.patchValue({ 'file': "data:image/jpeg;base64,"+imageData }); 
			this.uploadCoverPhoto(this.coverPhotoOptions); 
		  }
		 }, (err) => {
			alert('Unable to take photo');
		 });
	}
	
	uploadFromGallery(type){
		if(type == 'profile'){ 
			this.profilePhoto.nativeElement.click(); 
		} else { 
			this.coverPhoto.nativeElement.click(); 
		}
	}
	
	processWebImage(event,type) {
		let reader = new FileReader();
		reader.onload = (readerEvent) => {
		let imageData = (readerEvent.target as any).result;
		 if(type == 'profile'){
			this.profilePhotoOptions.patchValue({ 'file': imageData }); 
			this.uploadProfilePhoto(this.profilePhotoOptions);
		 } else {
			this.coverPhotoOptions.patchValue({ 'file': imageData });  
			this.uploadCoverPhoto(this.coverPhotoOptions); 
			
		 }		  
		};
		reader.readAsDataURL(event.target.files[0]);
	}
	  
	uploadProfilePhoto(params){

		let loading = this.loadingCtrl.create({
			content: 'Uploading...'
		});
		loading.present();

		 this.user.photoUploader(params).subscribe((resp) => {
			loading.dismiss();	
			this.profile.user_picture = resp;
			localStorage.setItem('user_picture',this.profile.user_picture);	
			let toast = this.toastCtrl.create({
				message: "Profile photo updated!",
				duration: 3000,
				position: 'top'
			});
			toast.present();

		}, (err) => {
			loading.dismiss();		
		  let toast = this.toastCtrl.create({
			message: "image uploading failed",
			duration: 3000,
			position: 'top'
		  });
		  toast.present();
		});
	}
	
	
	uploadCoverPhoto(params){
		let loading = this.loadingCtrl.create({
			content: 'Uploading...'
		});
		loading.present();
		this.user.photoUploader(params).subscribe((resp) => {	
			loading.dismiss();
			this.profile.user_cover = resp;
			localStorage.setItem('user_cover',this.profile.user_cover);
			let toast = this.toastCtrl.create({
				message: "Cover photo updated!",
				duration: 3000,
				position: 'top'
			});
			toast.present();
		}, (err) => {
			loading.dismiss();
		  let toast = this.toastCtrl.create({
			message: "image uploading failed",
			duration: 3000,
			position: 'top'
		  });
		  toast.present();
		});
	}
	getProfileImageStyle() {
		return this.profilePhotoOptions.controls['file'].value;
	}
	
	getCoverImageStyle() {
		return this.coverPhotoOptions.controls['file'].value;
	}
	
	removePhoto(params) {
		let loading = this.loadingCtrl.create({
			content: 'Removing...'
		});
		loading.present();
		 this.user.photoRemover(params).subscribe((resp) => {
			loading.dismiss();	
			let toast = this.toastCtrl.create({
				message: "Profile photo removed!",
				duration: 3000,
				position: 'top'
			});
			toast.present();

		}, (err) => {
		  loading.dismiss();		
		  let toast = this.toastCtrl.create({
			message: "image uploading failed",
			duration: 3000,
			position: 'top'
		  });
		  toast.present();
		});
	}
	
	// Attempt to login in through our User service
	/* profileReload(user_id) {
		let loading = this.loadingCtrl.create({
			content: 'reloding details...'
		});
		
		loading.present();
		this.user.updateProfile(user_id).subscribe((resp) => {			
			loading.dismiss();			
			this.storage.setUser(resp);			
			this.nav.setRoot('HomePage',resp);
		}, (err) => {
			loading.dismiss();
		  let toast = this.toastCtrl.create({
			message: "unable to reload. please check your connection",
			duration: 3000,
			position: 'top'
		  });
		  toast.present();
		});
	} */
	downloadAttachment(filePath){
	  let arr = filePath.split('/');
	  var filename = arr.pop();
	  let url = encodeURI(filePath);  
	  const fileTransfer: FileTransferObject = this.transfer.create();
	  fileTransfer.download(this.imageURL+filePath, this.file.dataDirectory + filename).then((entry) => {
		 let toast = this.toastCtrl.create({
			message: "Attachment bas been download",
			duration: 3000,
			position: 'top'
		});
	  }, (error) => {
		let toast = this.toastCtrl.create({
			message: "Attachment bas been download",
			duration: 3000,
			position: 'top'
		});
	 });
    }
	getBackgroundStyle(url) {
		if(!url){
			return 'url(assets/followthebirdImgs/no-profile-img.jpeg)'
		} else {
			return 'url(' + this.imageURL+url + ')'
		}
	}
	
	getCoverBackgroundStyle() {
		if(!this.profile.user_cover){
			return 'url(assets/followthebirdImgs/coover_dummy.png)'
		} else {
			return 'url(' + this.imageURL+this.profile.user_cover + ')'
		}
	}
	
	friendsAction() {
		const actionSheet = this.actionSheetCtrl.create({
		  title: 'Response to friend',
		  buttons: [
			{
			  icon: !this.platform.is('ios') ? 'ios-person-add' : null,	
			  text: 'Unfriend',
			  handler: () => {
				this.connectAction("friend-remove")
			  }
			},{
			  icon: !this.platform.is('ios') ? 'ios-close' : null,		
			  text: 'Unfollow',
			  handler: () => {
				this.connectAction("unfollow");
				this.profile.i_follow = false;
			  }
			}
		  ]
		});
		actionSheet.present();
	}
	
	responseAction() {
		const actionSheet = this.actionSheetCtrl.create({
		  buttons: [
			{
			  icon: !this.platform.is('ios') ? 'ios-person-add' : null,	
			  text: 'Confirm',
			  handler: () => {
				this.connectAction('friend-accept');
				this.profile.we_friends = true;
			  }
			},{
			  icon: !this.platform.is('ios') ? 'ios-close' : null,		
			  text: 'Delete Request',
			  handler: () => {
				this.connectAction("friend-decline")
			  }
			}
		  ]
		});
		actionSheet.present();
	}
	
	sentAction() {
		const actionSheet = this.actionSheetCtrl.create({
		  title: 'Response to friend',
		  buttons: [
			{
			  icon: !this.platform.is('ios') ? 'ios-person-add' : null,	
			  text: 'Cancel Request',
			  handler: () => {
				this.cancelRequestAction()
			  }
			},{
			  icon: !this.platform.is('ios') ? 'ios-close' : null,		
			  text: 'Unfollow',
			  handler: () => {
				this.unfollowAction()
			  }
			}
		  ]
		});
		actionSheet.present();
	}
	
	addAction() {
		this.connectAction("friend-add");
		this.profile.i_request = true;
		this.profile.i_follow = true;
	}
	
	cancelRequestAction() {
		this.connectAction("friend-cancel");
		this.profile.i_request = false;
	}
	
	unfollowAction() {
		this.connectAction("unfollow");
		this.profile.i_follow = false;
	}
	
	followAction() {
		this.connectAction("follow");
		this.profile.i_follow = true;
	}
	
	messageAction(profile){
		let recipient = {
			name:profile.user_firstname+' '+profile.user_lastname,
			picture:profile.user_picture,
			id:profile.user_id
	    };
		this.navCtrl.push('ViewMessagePage', {conversation: recipient});
	}
	
	viewComments(comments,post_id,){
		const commentsModal = this.modalCtrl.create('CommentsPage',{comments,'post_id':post_id,'handle':'post'});
		commentsModal.present();
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
		},
		{
		  icon: !this.platform.is('ios') ? 'ios-eye-off' : null,		
		  text: 'Hide from timeline',
		  handler: () => {
			event.target.parentNode.parentNode.parentNode.parentNode.remove();
			this.reactAction("hide_post",post.post_id)
		  }
		}
	];	
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
  
	moreAction() {
		const actionSheet = this.actionSheetCtrl.create({
		  buttons: [
			{
			  icon: !this.platform.is('ios') ? 'ios-person-add' : null,	
			  text: 'Report',
			  handler: () => {
				this.reportAction('user',this.profile.user_id)
			  }
			},{
			  icon: !this.platform.is('ios') ? 'ios-close' : null,		
			  text: 'Block',
			  handler: () => {
				this.blockAction()
			  }
			}
		  ]
		});
		actionSheet.present();
	}
	
	listFriends(){
		this.nav.setRoot('FriendsPage',{'user_id':this.profile.user_id});
	}
	
	connectAction(type){
		let params :any = {
			'do': type,
			'id': this.profile.user_id,
			'my_id' : localStorage.getItem('user_id')
		};
		this.user.connection(params).subscribe((resp) => {						
			
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
	
	goBack(){
	  this.navCtrl.setRoot("HomePage");
	}
	
	openSearch(){
	  this.navCtrl.setRoot("SearchPage");
	}
	
	getLiveLitePost(){
		let items :any = {
			type_id:this.profile.user_id,
			user_id:localStorage.getItem('user_id'),
			//last_post_live:localStorage.getItem('last_post_live')
		}
		console.log(items);
		this.user.getLiveLitePost(items).then((data) => {	
			let item : any = data;
			if(item.length > 0){
				localStorage.setItem('last_post_live','posts_profile-'+data[0].post_id);
				for (var key in item) {
				  this.postFeeds.unshift(item[key]);
				}
			}
		}, (err) => {
				
		});
	}
	
	doInfinite(infiniteScroll) {
		setTimeout(() => {
		  this.post.getfeeds('posts_profile',this.profile_id,localStorage.getItem('user_id'),{'page': this.pageCount})
			.then(data => {
				if(data[0].length > 0) {
					let item = data[0];
					for (var key in item) {
					  this.postFeeds.push(item[key]);
					}
				}
			});
		  this.pageCount = this.pageCount + 1;
		  this.arrayPosition = this.arrayPosition + 1;
		  infiniteScroll.complete();
		}, 500);
	}
	
	blockAction(){
		
	}
}
