import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ChooseFoodPage} from './choose-food.page';

const routes: Routes = [
  {path: '', component: ChooseFoodPage},
  {
    path: 'food-details-page/:id',
    loadChildren: () => import('../food-details-page/food-details-page.module').then(m => m.FoodDetailsPageModule)
  },
  {
    path: 'reorder-food',
    loadChildren: () => import('../foods-for-the-day-page/foods-for-the-day.module').then(m => m.FoodForTheDay)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChooseFoodRoutingModule {
}
