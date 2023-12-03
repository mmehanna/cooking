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
    path: 'reorder-foods',
    loadChildren: () => import('./food-list/reorder-food/reorder-food.module').then(m => m.ReorderFood)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
