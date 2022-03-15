import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import {HomeComponent} from './home/home.component';
import { BuyComponent } from './buy/buy.component';
import { SellComponent } from './sell/sell.component';

const routes: Routes = [{ path: '', component: DashboardComponent,children : [
  { path:'',redirectTo:'overview', pathMatch: 'full' },
  {path: 'overview', component: HomeComponent},
  {path: 'buy', component: BuyComponent},
  {path: 'sell', component: SellComponent},
]
 },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
