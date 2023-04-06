
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AuthGuard } from 'app/auth/helpers';

import { CoreCommonModule } from '@core/common.module';
import { NgSelectModule } from '@ng-select/ng-select';


import { EcommerceComponent } from 'app/main/dashboard/ecommerce/ecommerce.component';
import {CoreTouchspinModule} from "../../../@core/components/core-touchspin/core-touchspin.module";
import { EditofferComponent } from './editoffer/editoffer.component'
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NouisliderModule } from 'ng2-nouislider';
import { SwiperConfigInterface, SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';

import { HttpClientModule } from '@angular/common/http';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  observer: true
};

const routes = [

  {
    path: 'overview',
    component: EcommerceComponent,
    canActivate: [AuthGuard],
    data: { animation: 'decommerce' }
  },
  {
    path: 'editoffer/:id',
    component: EditofferComponent,
    canActivate: [AuthGuard],
    data: { animation: 'decommerce' }
  }
];

@NgModule({
  declarations: [EcommerceComponent, EditofferComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    CoreTouchspinModule,
    NgSelectModule,
    HttpClientModule,
    NouisliderModule,
    FormsModule,
    ReactiveFormsModule

  ],
  providers: [AuthGuard],
  exports: [EcommerceComponent]
})
export class DashboardModule {}
