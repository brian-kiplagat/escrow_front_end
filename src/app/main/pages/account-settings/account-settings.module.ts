import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AuthGuard} from 'app/auth/helpers/auth.guards';
import {CoreCommonModule} from '@core/common.module';
import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';
import {Ng2FlatpickrModule} from 'ng2-flatpickr';
import {AccountSettingsComponent} from 'app/main/pages/account-settings/account-settings.component';
import {AccountSettingsService} from 'app/main/pages/account-settings/account-settings.service';
import {NgSelectModule} from "@ng-select/ng-select";
import {CardSnippetModule} from '@core/components/card-snippet/card-snippet.module';
import {CoreDirectivesModule} from '@core/directives/directives';
import {FormWizardComponent} from 'app/main/forms/form-wizard/form-wizard.component';
import {FormsModule} from "@angular/forms";
import { FormRepeaterModule } from 'app/main/forms/form-repeater/form-repeater.module';
import { FormElementsModule } from 'app/main/forms/form-elements/form-elements.module';
import { FormLayoutModule } from 'app/main/forms/form-layout/form-layout.module';
import { FormValidationModule } from 'app/main/forms/form-validation/form-validation.module';
import { FormWizardModule } from 'app/main/forms/form-wizard/form-wizard.module';

const routes: Routes = [
  {
    path: 'account-settings',
    component: AccountSettingsComponent,
    canActivate: [AuthGuard],
    resolve: {
      accountSetting: AccountSettingsService
    },
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
    FormElementsModule, FormLayoutModule, FormWizardModule, FormValidationModule, FormRepeaterModule
  ],

  providers: [AccountSettingsService]
})
export class AccountSettingsModule {
}
