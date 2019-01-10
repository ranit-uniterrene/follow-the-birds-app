import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PageEditPage } from './page-edit';

@NgModule({
  declarations: [
    PageEditPage,
  ],
  imports: [
    IonicPageModule.forChild(PageEditPage),
  ],
})
export class PageEditPageModule {}
