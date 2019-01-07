import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultsPage } from './vaults';

@NgModule({
  declarations: [
    VaultsPage,
  ],
  imports: [
    IonicPageModule.forChild(VaultsPage),
  ],
})
export class VaultsPageModule {}
