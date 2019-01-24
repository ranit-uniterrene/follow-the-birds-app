import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, ViewController,ToastController,LoadingController} from 'ionic-angular';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { User } from '../../providers';
import { Post } from '../../providers/post/post';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/**
 * Generated class for the AddStoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-story',
  templateUrl: 'add-story.html',
})
export class AddStoryPage {
  @ViewChild('postPhoto') postPhoto;
  postPhotoOptions: FormGroup;  
  public publishStory : any = {
	do: 'publish',
	message: '',
	photos: {},
    user_id : localStorage.getItem('user_id')	
  }
  public publishPhotos : any = [];
  private imageURL = "https://dev.followthebirds.com/content/uploads/";
  constructor( public navCtrl: NavController, 
    public navParams: NavParams,
    public user: User,
	formBuilder: FormBuilder,	
    public post: Post,  
    public toastCtrl: ToastController,
    public platform: Platform, 
	public loadingCtrl: LoadingController,
    private camera: Camera,
    public modal: ViewController,
	private transfer: FileTransfer,
	private file: File) {
		this.postPhotoOptions = formBuilder.group({
			file: [],
			type: "photos",
			handle: "publisher-mini",
			multiple: true,
			user_id : localStorage.getItem('user_id')
		});
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddStoryPage');
  }
  
  takeCameraSnap(){
	const options: CameraOptions = {
	  quality: 100,
	  destinationType: this.camera.DestinationType.DATA_URL,
	  encodingType: this.camera.EncodingType.JPEG,
	  mediaType: this.camera.MediaType.PICTURE,
	  allowEdit:true,
	  saveToPhotoAlbum: true,
	  correctOrientation: true
	}

	this.camera.getPicture(options).then((imageData) => {
	  // imageData is either a base64 encoded string or a file URI
	   this.postPhotoOptions.patchValue({ 'file': "data:image/jpeg;base64,"+imageData }); 
	   this.postPhotoOptions.patchValue({ 'multiple': false });
	   this.uploadSinglePhoto(this.postPhotoOptions);
	 }, (err) => {
		alert('Unable to take photo');
	 });
  }
  
  uploadFromGallery(type){
	this.postPhoto.nativeElement.click();
  }
  
  processWebImage(event) {
	this.uploadPhoto(event.target.files);	  
  }

  uploadSinglePhoto(params){
	let loading = this.loadingCtrl.create({
		content: 'Uploading...'
	});
	loading.present();
	 this.user.photoUploader(params).subscribe((resp) => {
		loading.dismiss();	
		this.publishPhotos.push(resp);
		this.publishStory.photos = JSON.stringify(this.publishPhotos);
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
	
  uploadPhoto(params){
	let loading = this.loadingCtrl.create({
		content: 'Uploading...'
	});
	loading.present();
	this.user.photoMultiUploader(params,this.postPhotoOptions.value).subscribe((resp) => {
		loading.dismiss();			
		if(this.publishPhotos.length > 0){
			for (var key in resp) {
			  this.publishPhotos.push(resp[key]);
			}
		} else {
			this.publishPhotos = resp;
		}
		this.publishStory.photos = JSON.stringify(this.publishPhotos);
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
	
	removePhoto(index){
		var index = this.publishPhotos.indexOf(index);
		if (index > -1) {
		  this.publishPhotos.splice(index, 1);
		}
		this.publishStory.photos = JSON.stringify(this.publishPhotos);
	}
	
	postStory(){
	 let loading = this.loadingCtrl.create({
		content: 'Publish story...'
	 });
      //Attempt to login in through our User service
      this.post.publishStory(this.publishStory).subscribe((resp) => {
			loading.dismiss();
			let toast = this.toastCtrl.create({
			  message: "Story has been successfully posted.",
			  duration: 3000,
			  position: 'top',
			  dismissOnPageChange: true
			});
			toast.present();
			this.closeModal();
      }, (err) => {
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: "Unable to story. Retry",
          duration: 3000,
          position: 'top',
          dismissOnPageChange: true
        });
        toast.present();
        this.closeModal();
      });
	}
	
  closeModal(){
    this.navCtrl.pop();
  }

}
