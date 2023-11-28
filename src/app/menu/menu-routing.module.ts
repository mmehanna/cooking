import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';
import { CreateFoodPageModule } from "../food-list/create-food/create-food.module";

const routes: Routes = [
  {
    path: '',
    component: MenuPage
  },
  {
    path: 'create-food',
    loadChildren: () => import('../food-list/create-food/create-food.module').then(m => m.CreateFoodPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
