import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, NavParams, ActionSheetController, ModalController, AlertController, ToastController, Platform, MenuController, LoadingController, } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Post } from '../../providers/post/post';
import { EventsProvider } from '../../providers/events/events';
import { User } from '../../providers';
import { StorageProvider } from '../../providers/storage/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhotoViewer,PhotoViewerOptions } from '@ionic-native/photo-viewer';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Observable, Subject, ReplaySubject} from 'rxjs';
/**
 * Generated class for the EventProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-profile',
  templateUrl: 'event-profile.html',
})
export class EventProfilePage {
  @ViewChild('coverPhoto') coverPhoto;		
  eventDetailszone: string = "details";
  public eventProfile : any = [];
  public eventProfileId : any;
  public postElement = [];
  public is_going = 0;
  public is_interested = 0;
  public is_invited = 0;
  public status = 0;
  coverPhotoOptions: FormGroup;
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
  private myId : number = parseInt(localStorage.getItem('user_id'));
  private imageURL = "https://dev.followthebirds.com/content/uploads/";	
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
	public events: EventsProvider,
	public modalCtrl: ModalController,
	private transfer: FileTransfer,
	private file: File,
	private alertCtrl: AlertController			
  ) {
	  this.eventProfileId = navParams.get('eventProfile') || 3;
	  this.events.getEventProfile(parseInt(this.eventProfileId),{'user_id':localStorage.getItem('user_id'),'filter':'all'}).then(data => {
			this.eventProfile = data;
			this.getPost();	
			this.postElement['handle'] = "event";
			this.postElement['id'] = this.eventProfile['event_id'];	
		});
	this.coverPhotoOptions = formBuilder.group({
		file: "assets/followthebirdImgs/coverimage.png",
		type: "photos",
		handle: "cover-event",
		multiple: false,
		id: '',
		user_id : localStorage.getItem('user_id')
	});
  }

	ionViewDidEnter(){
		if(this.postFeeds.length <= '0'){
			this.sub = Observable.interval(3000)
			.subscribe((val) => { this.getLiveLitePost() });
		}
	}
  
	ionViewDidLeave() {
		this.sub.unsubscribe();
	}
  
  getPost(){
	this.post.getfeeds('posts_event',this.eventProfile['event_id'],localStorage.getItem('user_id'))
		.then(data => {
			let item = data[0];
			localStorage.setItem('last_post_live',item[0].post_id);
			for (var key in item) {
			  this.postFeeds.push(item[key]);
			}
	});
	this.is_going = this.eventProfile.i_joined['is_going']; 
	this.is_interested = this.eventProfile.i_joined['is_interested']; 
	this.is_invited = this.eventProfile.i_joined['is_invited']; 
	this.status = this.eventProfile.i_joined['status']; 
  }
  
  getCoverBackgroundStyle() {
	if(!this.eventProfile.event_cover){
		return 'url(assets/followthebirdImgs/coover_dummy.png)'
	} else {
		return 'url(' + this.imageURL+this.eventProfile.event_cover + ')'
	}
  }
  
  uploadCoverPicture() {
		const actionSheet = this.actionSheetCtrl.create({
		  title: 'Upload Cover Picture',
		  buttons: [
			{
			  icon: !this.platform.is('ios') ? 'ios-camera' : null,	
			  text: 'Take a Picture',
			  handler: () => {
				this.takeCameraSnap()
			  }
			},{
			  icon: !this.platform.is('ios') ? 'ios-images' : null,		
			  text: 'Upload from gallery',
			  handler: () => {
				this.uploadFromGallery()
			  }
			},{
			  icon: !this.platform.is('ios') ? 'trash' : null,
			  text: 'Remove cover photo',
			  handler: () => {
				  this.removePhoto({"my_id":localStorage.getItem('user_id'),"handle":"cover-event","id":this.eventProfile.event_id})
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
  
	takeCameraSnap(){
		const options: CameraOptions = {
		  quality: 100,
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
		  this.coverPhotoOptions.patchValue({ 'file': "data:image/jpeg;base64,"+imageData }); 
		  this.uploadCoverPhoto(this.coverPhotoOptions); 
		 }, (err) => {
			alert('Unable to take photo');
		 });
	}
	
	uploadFromGallery(){
		this.coverPhoto.nativeElement.click(); 
	}
	
	processWebImage(event,type) {
		let reader = new FileReader();
		reader.onload = (readerEvent) => {
		let imageData = (readerEvent.target as any).result;
		 this.coverPhotoOptions.patchValue({ 'file': imageData }); 				
		 this.uploadCoverPhoto(this.coverPhotoOptions); 
		};
		reader.readAsDataURL(event.target.files[0]);
	}
	
	uploadCoverPhoto(params){
		this.coverPhotoOptions.patchValue({ 'id': this.eventProfile['event_id'] }); 
		let loading = this.loadingCtrl.create({
			content: 'Uploading...'
		});
		loading.present();
		this.user.photoUploader(params).subscribe((resp) => {	
			loading.dismiss();
			this.eventProfile.event_cover = resp;
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
	
	eventOptionAction(event){
		if(event.event_admin != localStorage.getItem('user_id')){
		   const actionSheet = this.actionSheetCtrl.create({
			  buttons: [
				{
				  icon: !this.platform.is('ios') ? 'ios-camera' : null,	
				  text: 'Save Event',
				  handler: () => {
					
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
		} else {
			const actionSheet = this.actionSheetCtrl.create({
			  buttons: [
				{
				  icon: !this.platform.is('ios') ? 'ios-create' : null,	
				  text: 'Edit Event',
				  handler: () => {
					//this.editEvent(event.event_id);
				  }
				},{
				  icon: !this.platform.is('ios') ? 'ios-trash' : null,		
				  text: 'Delete Event',
				  handler: () => {
					const confirm = this.alertCtrl.create({
					  title: 'Delete event?',
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
							this.deleteEvent();
						  }
						}
					  ]
					});
					confirm.present();    
					
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
		
	}
	
	viewProfile(user_name,user_id) {
		this.nav.setRoot('ProfilePage', {user_name: user_name,user_id:user_id});
	}
	
	getMembers(type){
		this.navCtrl.push("EventMembersPage",{event_id:this.eventProfile.event_id,type:type});
	}
  
    eventGoAction(type,uid){
		this.connectAction(type);
		this.is_going = 1;
	}

	eventUngoAction(type,uid){
		this.connectAction(type);
		this.is_going = 0;
	}

	eventInviteAction(event,uid){
		event.target.innerText = "Invited";
		this.connectAction('event-invite',uid);
	}
	
	eventInterestAction(type){
		this.connectAction(type);
		this.is_interested = 1;
	}
	
	eventUninterestAction(type){
		this.connectAction(type);
		this.is_interested = 0;
	}

	getBackgroundStyle(url) {
		if(!url){
			return 'url(assets/followthebirdImgs/no-profile-img.jpeg)'
		} else {
			return 'url(' + this.imageURL+url + ')'
		}
	}
	
	viewComments(comments,post_id,){
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
	
	connectAction(type,uid?: any){
		let params :any = {
			'do': type,
			'id': this.eventProfile.event_id,
			'uid': uid,
			'my_id' : localStorage.getItem('user_id')
		};
		this.user.connection(params).subscribe((resp) => {						
			
		}, (err) => {
		
		});
	}
	
	deleteEvent(){
		let params = {
			id:this.eventProfile.event_id,
			my_id: localStorage.getItem('user_id'),
			handle:'event'
		}
		this.user.activityDelete(params).subscribe((resp) => {
			let toast = this.toastCtrl.create({
				message: "Event Deleted",
				duration: 3000,
				position: 'top'
			});
			toast.present();
			this.navCtrl.setRoot('HomePage');
		}, (err) => {
			let toast = this.toastCtrl.create({
				message: "Failed to Delete event! Try Again later",
				duration: 3000,
				position: 'top'
			});
			toast.present();
		});
	}
	
	getLiveLitePost(){
		this.user.getLiveLitePost({user_id: localStorage.getItem('user_id'),type:'posts_event',type_id:this.eventProfileId,last_post_live: localStorage.getItem('last_post_live')}).then((data) => {	
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
