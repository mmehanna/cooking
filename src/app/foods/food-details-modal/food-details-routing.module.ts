import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {FoodDetailsModal} from './food-details.modal';

const routes: Routes = [
  {
    path: '',
    component: FoodDetailsModal
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateFoodPageRoutingModule {
}
