import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule)
  },
  {
    path:'foods',
    loadChildren:  () => import('./foods/foods.module').then(m => m.FoodsModule)
  },
  {
    path: 'foods-for-the-day-page',
    loadChildren: () => import('./food-list/foods-for-the-day-page/foods-for-the-day.module').then(m => m.FoodForTheDay)
  },
  {
    path: 'choose-date-page',
    loadChildren: () => import('./food-list/choose-date-page/choose-date.module').then(m => m.ChooseDatePageModule)
  },
  {
    path: 'choose-food',
    loadChildren: () => import('./food-list/choose-food-page/choose-food.module').then(m => m.ChooseFood)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
