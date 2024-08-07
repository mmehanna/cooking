import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PlateDetailsModal} from './plate-details.modal';

const routes: Routes = [
  {
    path: '',
    component: PlateDetailsModal
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePlatePageRoutingModule {
}
