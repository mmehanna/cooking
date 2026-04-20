import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsPageRoutingModule } from './settings-routing.module';
import { SettingsPage } from './settings.page';
import { ProfileSectionComponent } from './components/profile-section/profile-section.component';
import { PreferencesSectionComponent } from './components/preferences-section/preferences-section.component';
import { AccountSectionComponent } from './components/account-section/account-section.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SettingsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    SettingsPage,
    ProfileSectionComponent,
    PreferencesSectionComponent,
    AccountSectionComponent
  ]
})
export class SettingsPageModule {}