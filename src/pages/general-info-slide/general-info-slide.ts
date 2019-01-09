import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, ActionSheetController , ToastController, Platform, LoadingController, Slides} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { User } from '../../providers';
import { StorageProvider } from '../../providers/storage/storage';
/**
 * Generated class for the GeneralInfoSlidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-general-info-slide',
  templateUrl: 'general-info-slide.html',
})
export class GeneralInfoSlidePage {
	@ViewChild('profilePhoto') profilePhoto;
	@ViewChild('coverPhoto') coverPhoto;	
	fullname: string;
	isCoverUploaded: boolean = false;
	isReadyToSave: boolean;
	profilePhotoOptions: FormGroup;
	coverPhotoOptions: FormGroup;
	private imageURL = "https://dev.followthebirds.com/content/uploads/";
  
	
  constructor(
		public navCtrl: NavController, 
		public user: User, 
		public storage: StorageProvider,
		public toastCtrl: ToastController, 
		public navParams: NavParams, 
		formBuilder: FormBuilder,
		public platform: Platform, 
		public nav: Nav, 
		public actionSheetCtrl: ActionSheetController, 
		private camera: Camera,
		public loadingCtrl: LoadingController
		) {
			this.fullname = localStorage.getItem('user_firstname')+' '+localStorage.getItem('user_lastname');
			
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
			
			if(localStorage.getItem("user_cover_id") != 'null'){
				this.coverPhotoOptions.patchValue({ 'file': this.imageURL+localStorage.getItem("user_cover") });
			}
		
		}
		
		
	  intro(status: string){
		if(status == 'done'){
		  localStorage.setItem('user_intro', 'true');
		  this.profileReload(localStorage.getItem("user_id"));
		}
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
		if(type == 'profile'){
			const options: CameraOptions = {
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
		} else {
			const options: CameraOptions = {
				destinationType: this.camera.DestinationType.DATA_URL,
				sourceType: this.camera.PictureSourceType.CAMERA,
				encodingType: this.camera.EncodingType.JPEG,
				mediaType: this.camera.MediaType.PICTURE,
				allowEdit:true,
				targetWidth: 700,
				targetHeight: 400,
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
			this.isCoverUploaded = true;
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
	
	// Attempt to login in through our User service
	profileReload(user_id) {
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
	}
	
}
