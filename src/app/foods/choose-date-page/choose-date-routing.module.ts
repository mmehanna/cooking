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
    loadChildren: () => import('../choose-food-page/choose-food.module').then(m => m.ChooseFood)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseDatePageRoutingModule {
}



