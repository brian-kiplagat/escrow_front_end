import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AuthGuard} from 'app/auth/helpers/auth.guards';
import {CoreCommonModule} from '@core/common.module';
import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';
import {Ng2FlatpickrModule} from 'ng2-flatpickr';
import {AccountSettingsComponent} from 'app/main/pages/account-settings/account-settings.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {CardSnippetModule} from '@core/components/card-snippet/card-snippet.module';
import {CoreDirectivesModule} from '@core/directives/directives';
import {FormsModule} from "@angular/forms";
import { ImageCropperModule } from 'ngx-image-cropper';


const routes: Routes = [
  {
    path: 'account-settings',
    component: AccountSettingsComponent,
    canActivate: [AuthGuard],
    data: {animation: 'account-settings'}
  }
];

@NgModule({
  declarations: [AccountSettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    CoreCommonModule,
    ContentHeaderModule,
    Ng2FlatpickrModule,
    NgSelectModule,
    CardSnippetModule,
    FormsModule,
    CoreDirectivesModule,
    NgSelectModule,
    ImageCropperModule
  ]
})
export class AccountSettingsModule {
}
