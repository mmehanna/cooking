import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { WorldwideRecipesPageRoutingModule } from './worldwide-recipes-routing.module';
import { WorldwideRecipesPage } from './worldwide-recipes.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    WorldwideRecipesPageRoutingModule,
  ],
  declarations: [WorldwideRecipesPage],
})
export class WorldwideRecipesPageModule {}
