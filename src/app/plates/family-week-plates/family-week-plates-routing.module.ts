import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {FamilyWeekPlatesPage} from './family-week-plates.page';

const routes: Routes = [
  {
    path: '',
    component: FamilyWeekPlatesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FamilyWeekPlatesRoutingModule {
}
