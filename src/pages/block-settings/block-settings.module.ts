import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlockSettingsPage } from './block-settings';

@NgModule({
  declarations: [
    BlockSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(BlockSettingsPage),
  ],
})
export class BlockSettingsPageModule {}
