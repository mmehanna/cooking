import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LandingPage} from './landing.page';
import {AddFoodWithAListComponent} from "../food-list/foods-list.page";

const routes: Routes = [
  {
    path: '',
    component: LandingPage
  },
  {
    path: 'create-food-modal',
    loadChildren: () => import('../food-list/create-food-modal/create-food.module').then(m => m.CreateFoodPageModule)
  },
  { path: 'add-food-with-a-list', component: AddFoodWithAListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {
}
