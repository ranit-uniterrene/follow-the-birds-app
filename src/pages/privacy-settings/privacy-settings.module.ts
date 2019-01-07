import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivacySettingsPage } from './privacy-settings';

@NgModule({
  declarations: [
    PrivacySettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivacySettingsPage),
  ],
})
export class PrivacySettingsPageModule {}
