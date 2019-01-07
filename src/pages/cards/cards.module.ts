import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { CardsPage } from './cards';
import { HomePageModule } from '../home/home.module';


@NgModule({
  declarations: [
    CardsPage,  
        
  ],
  imports: [
    IonicPageModule.forChild(CardsPage),
    TranslateModule.forChild(),
    HomePageModule
  ],
  exports: [
    CardsPage
  ]
})
export class CardsPageModule { }
