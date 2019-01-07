import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewMessagePage } from './view-message';

@NgModule({
  declarations: [
    ViewMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewMessagePage),
  ],
})
export class ViewMessagePageModule {}
