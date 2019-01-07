import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OotpPage } from './ootp';

@NgModule({
  declarations: [
    OotpPage,
  ],
  imports: [
    IonicPageModule.forChild(OotpPage),
  ],
})
export class OotpPageModule {}
