import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PageProfilePage } from './page-profile';
import { HomePageModule } from '../home/home.module';
@NgModule({
  declarations: [
    PageProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(PageProfilePage),
    HomePageModule
  ],
})
export class PageProfilePageModule {}
