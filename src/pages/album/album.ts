import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PhotoViewer,PhotoViewerOptions } from '@ionic-native/photo-viewer';
import { AlbumProvider } from '../../providers/album/album';

/**
 * Generated class for the AlbumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-album',
  templateUrl: 'album.html',
})
export class AlbumPage {
  private album_id = '';
  public photoAlbum :any = [];
  private imageURL = "https://dev.followthebirds.com/content/uploads/";
  constructor(public navCtrl: NavController, public navParams: NavParams, public album: AlbumProvider,private photoViewer: PhotoViewer) {
    this.album_id = navParams.get('album_id');
  }

  ionViewDidLoad() {
    this.album.getAlbum(parseInt(localStorage.getItem('user_id')),{'id':this.album_id})
		.then(data => {
			this.photoAlbum = data;
    });
    console.log(this.photoAlbum);
  }

  getBackgroundStyle(url) {
		if(!url){
			return 'url(assets/followthebirdImgs/no-profile-img.jpeg)'
		} else {
			return 'url(' + this.imageURL+url + ')'
		}
  }
  viewImage(url){
    const option : PhotoViewerOptions = {
		  share: true
		};
    this.photoViewer.show(this.imageURL+url,"Image Preview",option);
  }
  

}
