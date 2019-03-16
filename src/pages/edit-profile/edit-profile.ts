import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, ActionSheetController , ToastController, Platform, LoadingController, Slides} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { User } from '../../providers';
import { StorageProvider } from '../../providers/storage/storage';
/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  @ViewChild('profilePhoto') profilePhoto;
	@ViewChild('coverPhoto') coverPhoto;	
  profile : any = {};
  profilePhotoOptions: FormGroup;
  coverPhotoOptions: FormGroup;
  private imageURL = "https://followthebirds.com/content/uploads/";
  private myId :number = parseInt(localStorage.getItem('user_id'));
  constructor(public navCtrl: NavController, 
		public user: User, 
		public storage: StorageProvider,
		public toastCtrl: ToastController, 
		public navParams: NavParams, 
		formBuilder: FormBuilder,
		public platform: Platform, 
		public nav: Nav, 
		public actionSheetCtrl: ActionSheetController, 
		private camera: Camera,
		public loadingCtrl: LoadingController) {
     this.profile = navParams.get('profile');
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
  }

  ionViewDidLoad() {
    console.log(this.profile);
  }

  editDetails(profile){
		this.navCtrl.push('EditDetailsPage', {'profile': profile});
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
      this.profile.user_picture = resp;
			localStorage.setItem('user_picture',this.profile.user_picture);
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
      this.profile.user_cover = resp;
			localStorage.setItem('user_cover',this.profile.user_cover);
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

}
