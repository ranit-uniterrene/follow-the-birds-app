import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WhatsOnMindPage } from './whats-on-mind';

@NgModule({
  declarations: [
    WhatsOnMindPage,
  ],
  imports: [
    IonicPageModule.forChild(WhatsOnMindPage),
  ],  
})
export class WhatsOnMindPageModule {}
