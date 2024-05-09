import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {FoodsForTheDayPage} from './foods-for-the-day.page';

const routes: Routes = [
  {
    path: '',
    component: FoodsForTheDayPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoodsForTheDayRoutingModule {
}
