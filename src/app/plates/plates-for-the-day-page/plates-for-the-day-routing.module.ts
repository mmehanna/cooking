import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PlatesForTheDayPage} from './plates-for-the-day.page';

const routes: Routes = [
  {
    path: '',
    component: PlatesForTheDayPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatesForTheDayRoutingModule {
}
