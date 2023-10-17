import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeDetailsPage } from "./recipe-details.page";


const routes: Routes = [
  {
    path: '',
    component: RecipeDetailsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeDetailPageRoutingModule {}
