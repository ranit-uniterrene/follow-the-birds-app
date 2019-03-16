import { Component } from '@angular/core';
import { IonicPage, NavController, Nav, NavParams, ActionSheetController, AlertController, ToastController, Platform, MenuController, ModalController, LoadingController } from 'ionic-angular';
import { Post } from '../../providers/post/post';
import { User } from '../../providers';
/**
 * Generated class for the ViewPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-post',
  templateUrl: 'view-post.html',
})
export class ViewPostPage {
	private feeds : any = '';
	private imageURL = "https://followthebirds.com/content/uploads/";	
	private post_type: any = {
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
	height : number = 300;
	width : number = 300;
  constructor(
	public navCtrl: NavController, 
    public user: User,
    public post: Post,  
    public toastCtrl: ToastController,
    public navParams: NavParams,  
	public actionSheetCtrl: ActionSheetController,
	public alertCtrl: AlertController,
    public menu: MenuController,
    public nav: Nav,
	public modalCtrl: ModalController,
	private platform: Platform
	) {
		platform.ready().then((readySource) => {
			this.width = platform.width();
			this.height = platform.height();
		});
		this.feeds = navParams.get('post') || '';
    }

  ionViewDidLoad() {
  }
  
  getBackgroundStyle(url) {
	if(!url){
		return 'url(assets/followthebirdImgs/no-profile-img.jpeg)'
	} else {
		return 'url(' + this.imageURL+url + ')'
	}
  }
  
  viewProfile(user_name,user_id) {
	this.nav.setRoot('ProfilePage', {user_name: user_name,user_id:user_id});
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
					this.navCtrl.setRoot("HomePage");
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
  
  viewComments(comments,post_id,handle){
	const commentsModal = this.modalCtrl.create('CommentsPage',{comments,'post_id':post_id,'handle':handle});
	commentsModal.onDidDismiss(data => {
		this.feeds.comments = data;
	});
	commentsModal.present();
  }
  
  viewPhotoComments(index,comments,post_id,handle){
	const commentsModal = this.modalCtrl.create('CommentsPage',{comments,'post_id':post_id,'handle':handle});
	commentsModal.onDidDismiss(data => {
		this.feeds.photos[index].comments = data;
	});
	commentsModal.present();
  }
  
  viewImage(photo){
	this.nav.push('ViewPhotoPage', {photo: photo});
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
}
