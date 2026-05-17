import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule),
    canMatch: [AuthGuard]
  },
  {
    path: 'plates-for-the-day',
    loadChildren: () => import('./plates/plates-for-the-day-page/plates-for-the-day.module').then(m => m.PlateForTheDayModule),
    canMatch: [AuthGuard]
  },
  {
    path: 'choose-date',
    loadChildren: () => import('./plates/choose-date-page/choose-date.module').then(m => m.ChooseDatePageModule),
    canMatch: [AuthGuard]
  },
  {
    path: 'choose-plate',
    loadChildren: () => import('./plates/choose-plate-page/choose-plate.module').then(m => m.ChoosePlate),
    canMatch: [AuthGuard]
  },
  {
    path: 'manage-plates',
    loadChildren: () => import('./plates/plates-list.module').then(m => m.PlatesListModule),
    canMatch: [AuthGuard]
  },
  {
    path: 'family',
    loadChildren: () => import('./plates/family/family.module').then(m => m.FamilyPageModule),
    canMatch: [AuthGuard]
  },
  {
    path: 'shared-plates',
    loadChildren: () => import('./plates/shared-plates/shared-plates.module').then(m => m.SharedPlatesPageModule),
    canMatch: [AuthGuard]
  },
  {
    path: 'grocery-list',
    loadChildren: () => import('./plates/grocery-list-page/grocery-list.module').then(m => m.GroceryListPageModule),
    canMatch: [AuthGuard]
  },
  {
    path: 'world-recipes',
    loadChildren: () => import('./recipes/world-recipes/world-recipes.module').then(m => m.WorldRecipesModule),
    canMatch: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule),
    canMatch: [AuthGuard]
  },
  {
    path: 'pricing',
    loadChildren: () => import('./pricing-page/pricing.module').then(m => m.PricingPageModule),
    canMatch: [AuthGuard]
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
