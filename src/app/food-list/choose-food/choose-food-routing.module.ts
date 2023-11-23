import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChooseFoodPage } from './choose-food.page';

const routes: Routes = [
  { path: '', component: ChooseFoodPage },
  {
    path: 'food-details/:id',
    loadChildren: () => import('../food-details/food-details-page.module').then(m => m.FoodDetailsPageModule)
  },
  {
    path: 'reorder-food',
    loadChildren: () => import('../reorder-food/reorder-food.module').then(m => m.ReorderFood)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChooseFoodRoutingModule {}
