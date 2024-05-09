import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CreateFoodModal} from './create-food.modal';

const routes: Routes = [
  {
    path: '',
    component: CreateFoodModal
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateFoodPageRoutingModule {
}
