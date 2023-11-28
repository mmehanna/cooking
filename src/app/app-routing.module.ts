import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'choose-food',
    loadChildren: () => import('./food-list/choose-food/choose-food.module').then(m => m.ChooseFood)
  },
  {
    path: 'create-food',
    loadChildren: () => import('./food-list/choose-food/choose-food.module').then(m => m.ChooseFood)
  },
  {
    path: 'create-food',
    loadChildren: () => import('./food-list/create-food/create-food.module').then(m => m.CreateFoodPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
