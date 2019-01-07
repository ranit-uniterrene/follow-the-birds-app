import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { User } from '../../providers';
import { Post } from '../../providers/post/post';
/**
 * Generated class for the CommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
	@ViewChild('comment_box') comment_box;
	public comments : any = [];
	public post_id : any;
	public post_comment : any = {
		handle:'',
		message:'',
		id:'',
		my_id:localStorage.getItem('user_id')
	};
	public title = "Comments"
	private imageURL = "https://dev.followthebirds.com/content/uploads/";
  constructor(public navCtrl: NavController, public navParams: NavParams, public user: User, public viewCtrl:ViewController,public modalCtrl: ModalController, public post: Post) {
	this.comments = this.navParams.get('comments') || [];
	this.post_comment.id = this.navParams.get('post_id');
	this.post_comment.handle = this.navParams.get('handle');
	if(this.post_comment.handle == 'comment'){
		this.title = "Replies";
	}
  }

  ionViewDidLoad() {
	if(this.post_comment.handle == 'photo'){
		this.user.getPhoto(parseInt(localStorage.getItem('user_id')),{'photo_id':this.post_comment.id})
			.then(data => {
			console.log(data);
			this.comments = data['photo_comments'];
		});
	} 
  }
	
  dismiss() {
   this.viewCtrl.dismiss();
  }
  
    setReplyComment(comments,post_id){
	  const commentsReplyModal = this.modalCtrl.create('CommentsPage',{comments,'post_id':post_id,'handle':'comment'});
	  commentsReplyModal.present();
    }
  
  
	postComment(){
		console.log(this.post_comment);
	  this.post.postComment(this.post_comment).subscribe((resp) => {	
		  this.comments.push(resp);
		  this.post_comment.message = '';
	  }, (err) => {        
	  });
	}
  
}
