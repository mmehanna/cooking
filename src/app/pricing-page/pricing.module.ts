import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PricingPage } from './pricing.page';
import { PricingPageRoutingModule } from './pricing-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule, PricingPageRoutingModule],
  declarations: [PricingPage],
})
export class PricingPageModule {}
