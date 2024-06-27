import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ChooseDatePage} from './choose-date.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseDatePage
  },
  {
    path: 'choose-food',
    loadChildren: () => import('../choose-plate-page/choose-plate.module').then(m => m.ChoosePlate)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseDatePageRoutingModule {
}



