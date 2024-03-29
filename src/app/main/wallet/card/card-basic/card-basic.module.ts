import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreDirectivesModule } from '@core/directives/directives';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { CardBasicComponent } from 'app/main/wallet/card/card-basic/card-basic.component';
import {CommonModule} from "@angular/common";
import { AuthGuard } from 'app/auth/helpers/auth.guards';


// routing
const routes: Routes = [
  {
    path: 'main',
    component: CardBasicComponent,
    canActivate: [AuthGuard],
    data: { animation: 'card-basic' }
  }
];

@NgModule({
  declarations: [CardBasicComponent],
  imports: [CommonModule, RouterModule.forChild(routes), CoreDirectivesModule, ContentHeaderModule, NgbModule],
  providers: [AuthGuard]
})
export class CardBasicModule {}
