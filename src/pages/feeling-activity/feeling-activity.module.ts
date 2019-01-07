import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeelingActivityPage } from './feeling-activity';

@NgModule({
  declarations: [
    FeelingActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(FeelingActivityPage),
  ],
})
export class FeelingActivityPageModule {}
