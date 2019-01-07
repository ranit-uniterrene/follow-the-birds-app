import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeneralInfoSlidePage } from './general-info-slide';

@NgModule({
  declarations: [
    GeneralInfoSlidePage,
  ],
  imports: [
    IonicPageModule.forChild(GeneralInfoSlidePage),
  ],
})
export class GeneralInfoSlidePageModule {}
