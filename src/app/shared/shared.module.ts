import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FamilyManagementComponent } from '../plates/family-management/family-management.component';
import { SharedPlatesListComponent } from '../plates/shared-plates-list/shared-plates-list.component';



@NgModule({
  declarations: [
    FamilyManagementComponent,
    SharedPlatesListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    FamilyManagementComponent,
    SharedPlatesListComponent
  ]
})
export class SharedModule { }
