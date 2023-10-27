import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabReorderFoodPage } from './tab-reorder-food.page';

const routes: Routes = [
  {
    path: '',
    component: TabReorderFoodPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}
