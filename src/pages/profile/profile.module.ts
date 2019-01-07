import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { HomePageModule } from '../home/home.module';

@NgModule({
  declarations: [
    ProfilePage 
    
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    HomePageModule
  ],
})
export class ProfilePageModule {}
