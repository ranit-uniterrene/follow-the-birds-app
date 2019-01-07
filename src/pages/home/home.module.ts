import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { WhatsOnMindComponent } from '../../components/whats-on-mind/whats-on-mind';


@NgModule({
  declarations: [
    HomePage,
    WhatsOnMindComponent
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    //IonicPageModule.forChild(WhatsOnMindComponent),
    
  ],
  exports:[
    WhatsOnMindComponent
  ]
})
export class HomePageModule {}
