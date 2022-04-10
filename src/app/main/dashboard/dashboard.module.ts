
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

import { InvoiceModule } from 'app/main/apps/invoice/invoice.module';
import { InvoiceListService } from 'app/main/apps/invoice/invoice-list/invoice-list.service';

import { DashboardService } from 'app/main/dashboard/dashboard.service';

import { AnalyticsComponent } from 'app/main/dashboard/analytics/analytics.component';
import { EcommerceComponent } from 'app/main/dashboard/ecommerce/ecommerce.component';
import {CoreTouchspinModule} from "../../../@core/components/core-touchspin/core-touchspin.module"


const routes = [
  {
    path: 'analytics',
    component: AnalyticsComponent,
    //canActivate: [AuthGuard],
    data: { animation: 'danalytics' },
    resolve: {
      css: DashboardService,
      inv: InvoiceListService
    }
  },
  {
    path: 'overview',
    component: EcommerceComponent,
    //canActivate: [AuthGuard],
    resolve: {
      css: DashboardService
    },
    data: { animation: 'decommerce' }
  }
];

@NgModule({
  declarations: [AnalyticsComponent, EcommerceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    InvoiceModule,
    CoreTouchspinModule
  ],
  providers: [DashboardService, InvoiceListService],
  exports: [EcommerceComponent]
})
export class DashboardModule {}
