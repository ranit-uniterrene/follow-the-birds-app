import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController} from 'ionic-angular';
import { Post } from '../../providers/post/post';
/**
 * Generated class for the FeelingActivityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feeling-activity',
  templateUrl: 'feeling-activity.html',
})
export class FeelingActivityPage {
  private feelings : any = []; 
  private feeling_types : any = []; 
  private feeling_action : any;
  private feeling_value : any;
  private feelingBox : boolean = true;
  private feelingTypeBox : boolean = false;
  private feelingInputBox : boolean = false;
  public icon;
  public iconColor = {
	"happy":"f7bd0d",
	"Song":"169ce1",
	"glasses":"000000",
	"game-controller-b":"7116e1",
	"pizza":"f48c1d",
	"pint":"1aa9a4",
	"plane":"418dff",
	"book":"294de6"
  }
  constructor(public navCtrl: NavController, public post: Post, public navParams: NavParams,public viewCtrl:ViewController) {
  }

  ionViewDidLoad() {
    this.feelings = this.post.get_feelings();
  }
  
  getFeelingType(index){
	  this.feelingInputBox = false;
	  this.feeling_types = this.post.get_feeling_type(index);
	  if(this.feeling_types.length > 0){
		this.feelingTypeBox = true;
	  } else {
		this.feelingInputBox = true;
	  }	  
  }
  
  setFeeling(feeling,index){
	this.feeling_types = [];
	this.feeling_action = feeling.action;
	this.icon = feeling.icon;
	this.getFeelingType(index);
	this.feelingBox = false;
  }
	
	setFeelingType(type){
		this.feeling_value = type;
		this.dismiss();
	}
	
	setCustomFeelingType(){
		this.dismiss();
	}
	
	goBack(){
		this.feelingBox = true;
		this.feelingTypeBox = false;
	}
  
  dismiss() {
   let data = { feeling_action: this.feeling_action,feeling_value: this.feeling_value, icon: this.icon };
   this.viewCtrl.dismiss(data);
  }
}
