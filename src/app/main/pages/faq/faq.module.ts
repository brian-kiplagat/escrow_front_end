import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthGuard } from 'app/auth/helpers';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { FAQService } from 'app/main/pages/faq/faq.service';
import {NgApexchartsModule} from "ng-apexcharts";


const routes: Routes = [
  {
    path: 'faq',
    canActivate: [AuthGuard],
    resolve: {
      faqData: FAQService
    },
    data: { animation: 'faq' }
  }
];

@NgModule({

    declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes), NgbModule, CoreCommonModule, ContentHeaderModule],

  providers: [FAQService]
})
export class FaqModule {}
