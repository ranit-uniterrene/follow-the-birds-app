import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupProfilePage } from './group-profile';
import { HomePageModule } from '../home/home.module';
@NgModule({
  declarations: [
    GroupProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(GroupProfilePage),
    HomePageModule
  ],
})
export class GroupProfilePageModule {}
