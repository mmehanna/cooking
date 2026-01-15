import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlatesListPage} from "./plates-list.page";


const routes: Routes = [
  {
    path: '',
    component: PlatesListPage,
  },
  {
    path: 'shared-plates',
    loadChildren: () => import('./shared-plates/shared-plates.module').then( m => m.SharedPlatesPageModule)
  },
  {
    path: 'family',
    loadChildren: () => import('./family/family.module').then( m => m.FamilyPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlateListRoutingModule {
}
