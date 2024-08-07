import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule)
  },
  {
    path: 'plates-for-the-day',
    loadChildren: () => import('./plates/plates-for-the-day-page/plates-for-the-day.module').then(m => m.PlateForTheDay)
  },
  {
    path: 'choose-date',
    loadChildren: () => import('./plates/choose-date-page/choose-date.module').then(m => m.ChooseDatePageModule)
  },
  {
    path: 'choose-plate',
    loadChildren: () => import('./plates/choose-plate-page/choose-plate.module').then(m => m.ChoosePlate)
  },
  {
    path: 'manage-plates',
    loadChildren: () => import('./plates/plates-list.module').then(m => m.PlatesListModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
