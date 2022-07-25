
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { TranslateModule } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AuthGuard } from 'app/auth/helpers';
import { Role } from 'app/auth/models';

import { CoreCommonModule } from '@core/common.module';
import { DashboardService } from 'app/main/dashboard/dashboard.service';


import { EcommerceComponent } from 'app/main/dashboard/ecommerce/ecommerce.component';
import {CoreTouchspinModule} from "../../../@core/components/core-touchspin/core-touchspin.module"


const routes = [

  {
    path: 'overview',
    component: EcommerceComponent,
    canActivate: [AuthGuard],
    data: { animation: 'decommerce' }
  }
];

@NgModule({
  declarations: [EcommerceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    CoreTouchspinModule
  ],
  providers: [AuthGuard],
  exports: [EcommerceComponent]
})
export class DashboardModule {}
