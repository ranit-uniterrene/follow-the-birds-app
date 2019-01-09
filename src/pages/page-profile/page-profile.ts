import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Nav, NavParams, ActionSheetController, ModalController, AlertController, ToastController, Platform, MenuController, LoadingController, } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { User } from '../../providers';
import { Post } from '../../providers/post/post';
import { PageProvider } from '../../providers/page/page';
import { StorageProvider } from '../../providers/storage/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhotoViewer,PhotoViewerOptions } from '@ionic-native/photo-viewer';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Observable, Subject, ReplaySubject} from 'rxjs';

/**
 * Generated class for the PageProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-profile',
  templateUrl: 'page-profile.html',
})
export class PageProfilePage {
  @ViewChild('coverPhoto') coverPhoto;
  coverPhotoOptions: FormGroup;
  private myId : number = parseInt(localStorage.getItem('user_id'));	
  public pageProfile : any = [];
  public postElement = [];
  postFeeds: any = [];
  public pageDetailszone : string = "details";
  sub : any = '';
  private imageURL = "https://dev.followthebirds.com/content/uploads/";	
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
  constructor(public page: PageProvider,
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
    private alertCtrl: AlertController) {
      this.pageProfile = navParams.get('pageProfile');
      this.page.getPageProfile(parseInt(this.pageProfile.page_id),{'user_id':localStorage.getItem('user_id'),'filter':'all'}).then(data => {
        this.pageProfile = data;
        this.getPost();			  
        this.postElement['handle'] = "page";
        this.postElement['id'] = this.pageProfile['page_id'];	
      });
      this.coverPhotoOptions = formBuilder.group({
        file: "assets/followthebirdImgs/coverimage.png",
        type: "photos",
        handle: "cover-page",
        multiple: false,
        id: '',
        user_id : localStorage.getItem('user_id')
			});
			this.sub = Observable.interval(10000)
			.subscribe((val) => { this.getLiveLitePost() });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PageProfilePage');
  }

  getPost(){
		this.post.getfeeds('posts_page',this.pageProfile['page_id'],localStorage.getItem('user_id'))
			.then(data => {
				let item = data[0];
				localStorage.setItem('last_post_live',item[0].post_id);
				for (var key in item) {
				  this.postFeeds.push(item[key]);
				}
		});
	}

  getCoverBackgroundStyle() {
    if(!this.pageProfile.page_cover){
      return 'url(assets/followthebirdImgs/coover_dummy.png)'
    } else {
      return 'url(' + this.imageURL+this.pageProfile.page_cover + ')'
    }
  }
  getBackgroundStyle(url) {
		if(!url){
			return 'url(assets/followthebirdImgs/no-profile-img.jpeg)'
		} else {
			return 'url(' + this.imageURL+url + ')'
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
				  this.removePhoto({"my_id":localStorage.getItem('user_id'),"handle":"cover-page","id":this.pageProfile.page_id})
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

	viewPost(post) {
		if(post.photos_num == '1'){
			this.nav.push('ViewPhotoPage', {photo: post.photos[0]});
		} else {	
			this.nav.push('ViewPostPage', {post: post});
		}
	}
	  
	viewImage(photo){
		this.nav.push('ViewPhotoPage', {photo: photo});
	}
  
	viewProfile(user_name,user_id) {
		this.nav.setRoot('ProfilePage', {user_name: user_name,user_id:user_id});
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
		this.coverPhotoOptions.patchValue({ 'id': this.pageProfile['page_id'] }); 
		let loading = this.loadingCtrl.create({
			content: 'Uploading...'
		});
		loading.present();
		this.user.photoUploader(params).subscribe((resp) => {	
			loading.dismiss();
			this.pageProfile.page_cover = resp;
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
	
	settingAction(){
		const actionSheet = this.actionSheetCtrl.create({
		  title: 'Settings',
		  buttons: [
			{
			  icon: !this.platform.is('ios') ? 'ios-create' : null,	
			  text: 'Edit Page Details',
			  handler: () => {
					this.editPage();
			  }
			},{
			  icon: !this.platform.is('ios') ? 'ios-trash' : null,		
			  text: 'Delete Page',
			  handler: () => {
					const confirm = this.alertCtrl.create({
						title: 'Delete page?',
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
								this.deletePage()
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

	deletePage() {
		let params = {
			id:this.pageProfile.page_id,
			my_id: localStorage.getItem('user_id'),
			handle:'page'
		}
		this.user.activityDelete(params).subscribe((resp) => {
			let toast = this.toastCtrl.create({
				message: "Page Deleted",
				duration: 3000,
				position: 'top'
			});
			toast.present();
			this.navCtrl.setRoot('HomePage');
		}, (err) => {
			let toast = this.toastCtrl.create({
				message: "Failed to Delete page! Try Again later",
				duration: 3000,
				position: 'top'
			});
			toast.present();
		});
	}

	editPage(){

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

  getAlbums(){
    this.page.getPageProfile(parseInt(this.pageProfile.page_id),{'user_id':localStorage.getItem('user_id'),'filter':'albums'}).then(data => {
			this.pageProfile['albums'] = data['albums'];
		});
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

  getAlbum(album_id){
		this.navCtrl.push("AlbumPage",{'album_id':album_id});
	}

  connectAction(type,uid?: any){
		let params :any = {
			'do': type,
			'id': this.pageProfile.page_id,
			'uid': uid,
			'my_id' : localStorage.getItem('user_id')
		};
		this.user.connection(params).subscribe((resp) => {						
			
		}, (err) => {
		
		});
	}
	getLiveLitePost(){
		let items :any = {
			type:'posts_page',
			type_id:this.pageProfile.page_id,
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
