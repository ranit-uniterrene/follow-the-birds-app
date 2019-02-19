import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { User } from '../../providers';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
/**
 * Generated class for the CreateMessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-message',
  templateUrl: 'create-message.html',
})
export class CreateMessagePage {
  @ViewChild('postPhoto') postPhoto;	
  //@ViewChild('mySearchbar') searchbar: searchbar;
  postPhotoOptions: FormGroup;  
  currentItems: any = [];
  public allFriends: any = [];
  private messages : any = [];
  private isChat = false;
  private recipients = [];
  private chatInfo : any = {
	message: '',
	user_id:localStorage.getItem('user_id')
  };
  myId = localStorage.getItem('user_id');
  private imageURL = "https://dev.followthebirds.com/content/uploads/";
  public publishPhotos : any = [];
  public recipIds : any = [];
  public chatBox : any = {
	image: "",
	message: "",
	message_id: "34",
	time: "",
	user_firstname: localStorage.getItem('user_firstname'),
	user_gender: localStorage.getItem("male"),
	user_id: localStorage.getItem('user_id'),
	user_lastname: localStorage.getItem('user_lastname'),
	user_name: localStorage.getItem('user_name'),
	user_picture: localStorage.getItem('user_picture')
  };
  private pageCount = 1;
  public conversation_id = ''
  constructor(public navCtrl: NavController,  public user: User, public navParams: NavParams,formBuilder: FormBuilder, private camera: Camera, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
	this.user.getfriends(parseInt(localStorage.getItem('user_id')))
	.then(data => {
		this.allFriends = data[0];
		this.initializeItems();
	});  
	 this.postPhotoOptions = formBuilder.group({
		file: [],
		type: "photos",
		handle: "chat",
		multiple: true,
		user_id : localStorage.getItem('user_id')
	  });
	  
	this.initializeItems();
  }
  
  initializeItems() {
	this.currentItems = this.allFriends;
  }
  

  onChange($event){
    console.log($event)
  }

  onFocus($event) {
    console.log($event)
  }

  onBlur($event) {
    console.log("onBlur")
	console.log($event)
  }
  
  onCancel($event) {
	console.log("onCancel")
    console.log($event)
  }

  onInput($event) {
	this.isChat = false; 
	console.log("onInput")
   //this.initializeItems();
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
		   this.postPhotoOptions.patchValue({ 'file': "data:image/jpeg;base64,"+imageData }); 
		   this.postPhotoOptions.patchValue({ 'multiple': false });
		   this.uploadPhoto(this.postPhotoOptions);
		 }, (err) => {
			alert('Unable to take photo');
		 });
	}
  
  addRecipient(item){
	//this.searchbar.value = ''; 
	this.recipients.push(item);
	this.isChat = true;
	this.recipIds.push(item.user_id);
	this.getMessages(this.recipIds)
  }
  
  getMessages(ids){
	  if(ids){
		this.user.getMessages({user_id:localStorage.getItem('user_id'),ids:ids}).then(data => {
		   if(data[0].messages){
			   this.messages = data[0].messages;   
		   } else {
				this.messages = [];
		   }	   
		   if(data[0].conversation_id){
				this.conversation_id = data[0].conversation_id;  
				this.chatInfo['conversation_id'] = data[0].conversation_id;
		   } else {
			   this.conversation_id = '';		
				if (this.chatInfo.hasOwnProperty("conversation_id")) {
				  delete this.chatInfo.conversation_id;
				}
		   }
		});  
	  } else {
		this.messages = [];
	  }
	  
  }
  
  removeRecipient(item){
    var index = this.recipients.indexOf(item);
	if (index !== -1) this.recipients.splice(index, 1);
    
	var user_id = this.recipIds.indexOf(item.user_id);
	if (index !== -1) this.recipIds.splice(user_id, 1);
	
	this.getMessages(this.recipIds)
  }
  
  
  sendMessage(){
	  this.chatInfo['recipients'] = this.recipIds;
	  this.user.postMessage(this.chatInfo).subscribe((resp) => {	
		this.chatInfo.message = '';
		this.chatBox.image = resp['image'];
		this.chatBox.message = resp['message'];
		this.chatBox.time = resp['time'];
		this.messages.push(this.chatBox);
		this.publishPhotos = [];
	}, (err) => {
		
	});
  }
  
  
  isToday(data){
	 var date = data.split(' ');
	 var today = new Date();
	 var dd = today.getDate();
	 var mm = today.getMonth()+1; 
	 var yyyy = today.getFullYear();
	 
	 var pDate = date[0].split('-');
	 if(pDate[0] != yyyy ){
		 return false;
	 }else{
		 if(pDate[1] != mm){
			 return false;
		 }else{
			 if(pDate[2] != dd){
				 return false;
			 }else{
				 return true;
			 }
		 }
	 }
	 
  }
  
   getItems(ev: any) {
		this.isChat = false;    
		// Reset items back to all of the items
		this.initializeItems();
		// set val to the value of the searchbar
		const val = ev.target.value;

		// if the value is an empty string don't filter the items
		if (val && val.trim() != '') {
		  this.currentItems = this.currentItems.filter((item) => {
			return (item.user_firstname.toLowerCase().indexOf(val.toLowerCase()) > -1);
		  })
		}	
	}

  
  getBackgroundStyle(url) {
	if(!url){
		return 'url(assets/followthebirdImgs/no-profile-img.jpeg)'
	} else {
		return 'url(' + this.imageURL+url + ')'
	}
  }
  
  uploadFromGallery(){
	this.postPhoto.nativeElement.click();
  }
  
  processWebImage(event) {
	let reader = new FileReader();
	reader.onload = (readerEvent) => {
	 let imageData = (readerEvent.target as any).result;
	 this.postPhotoOptions.patchValue({ 'file': imageData });
	 this.postPhotoOptions.patchValue({ 'multiple': false });
	 this.uploadPhoto(this.postPhotoOptions);	  
	};
	reader.readAsDataURL(event.target.files[0]);
  }
  
  uploadPhoto(params){
	let loading = this.loadingCtrl.create({
		content: 'Uploading...'
	});
	loading.present();
	 this.user.photoUploader(params).subscribe((resp) => {
		loading.dismiss();	
		this.publishPhotos.push(resp);
		this.chatInfo['photo'] = JSON.stringify(this.publishPhotos[0]);
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
  
	doInfinite(infiniteScroll) {
		setTimeout(() => {
		  this.user.loadMessages({user_id:localStorage.getItem('user_id'),conversation_id:this.conversation_id,'page': this.pageCount}).then(data => {
				let item : any = data[0];
				if(data[0].length > 0){
					for (var key in item) {
					  this.messages.unshift(item[key]);
					}
				}
				this.pageCount = this.pageCount + 1;
			});
		  infiniteScroll.complete();
		}, 100);
	}
	
}
