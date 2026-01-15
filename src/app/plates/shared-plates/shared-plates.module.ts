import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedPlatesPageRoutingModule } from './shared-plates-routing.module';

import { SharedPlatesPage } from './shared-plates.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedPlatesPageRoutingModule,
    SharedModule
  ],
  declarations: [SharedPlatesPage]
})
export class SharedPlatesPageModule {}
