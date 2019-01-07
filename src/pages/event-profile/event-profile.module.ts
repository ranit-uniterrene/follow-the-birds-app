import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventProfilePage } from './event-profile';
import { HomePageModule } from '../home/home.module';
@NgModule({
  declarations: [
    EventProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(EventProfilePage),
	HomePageModule
  ],
})
export class EventProfilePageModule {}
