import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BuyComponent } from './buy/buy.component';
import { SellComponent } from './sell/sell.component';
import { HomeComponent } from './home/home.component';
import { BuyformComponent } from './buyform/buyform.component';


@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    BuyComponent,
    SellComponent,
    HomeComponent,
    BuyformComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
