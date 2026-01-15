import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedPlatesPage } from './shared-plates.page';

const routes: Routes = [
  {
    path: '',
    component: SharedPlatesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedPlatesPageRoutingModule {}
