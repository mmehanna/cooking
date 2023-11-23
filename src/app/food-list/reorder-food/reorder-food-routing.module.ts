import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReorderFoodPage } from './reorder-food.page';

const routes: Routes = [
  {
    path: '',
    component: ReorderFoodPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReorderFoodRoutingModule {}
