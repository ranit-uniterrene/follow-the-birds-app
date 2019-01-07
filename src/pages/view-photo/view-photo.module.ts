import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewPhotoPage } from './view-photo';

@NgModule({
  declarations: [
    ViewPhotoPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewPhotoPage),
  ],
})
export class ViewPhotoPageModule {}
