import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultCreatePage } from './vault-create';

@NgModule({
  declarations: [
    VaultCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(VaultCreatePage),
  ],
})
export class VaultCreatePageModule {}
