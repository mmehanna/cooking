import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabChooseFoodPage } from './tab-choose-food.page';

const routes: Routes = [
  { path: '', component: TabChooseFoodPage },
  {
    path: 'food-details/:id',
    loadChildren: () => import('./food-details/food-details-page.module').then(m => m.FoodDetailsPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {}