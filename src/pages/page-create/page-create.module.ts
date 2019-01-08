import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PageCreatePage } from './page-create';

@NgModule({
  declarations: [
    PageCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(PageCreatePage),
  ],
})
export class PageCreatePageModule {}
