import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FoodsListPage} from "./foods-list.page";


const routes: Routes = [
  {
    path: '',
    component: FoodsListPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoodListRoutingModule {
}
