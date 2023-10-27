import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabConfirmFoodPage } from './tab-confirm-food.page';

const routes: Routes = [
  {
    path: '',
    component: TabConfirmFoodPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab3PageRoutingModule {}
