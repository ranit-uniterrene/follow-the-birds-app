import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventMembersPage } from './event-members';

@NgModule({
  declarations: [
    EventMembersPage,
  ],
  imports: [
    IonicPageModule.forChild(EventMembersPage),
  ],
})
export class EventMembersPageModule {}
