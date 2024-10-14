import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ChoosePlatePage} from './choose-plate.page';

const routes: Routes = [
  {path: '', component: ChoosePlatePage},
  {
    path: 'plate-details-page/:id',
    loadChildren: () => import('../plate-details-page/plate-details-page.module').then(m => m.PlateDetailsPageModule)
  },
  {
    path: 'reorder-food',
    loadChildren: () => import('../plates-for-the-day-page/plates-for-the-day.module').then(m => m.PlateForTheDay)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChoosePlateRoutingModule {
}
