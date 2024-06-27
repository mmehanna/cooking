import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PlateDetailsPage} from "./plate-details.page";


const routes: Routes = [
  {
    path: '',
    component: PlateDetailsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlateDetailRoutingModule {
}
