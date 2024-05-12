import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LandingPage} from './landing.page';

const routes: Routes = [
  {
    path: '',
    component: LandingPage
  },
  {
    path: 'create-food-modal',
    loadChildren: () => import('../foods/create-food-modal/create-food.module').then(m => m.CreateFoodPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {
}
