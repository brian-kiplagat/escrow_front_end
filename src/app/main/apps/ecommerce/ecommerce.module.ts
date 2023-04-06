import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NouisliderModule } from 'ng2-nouislider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperConfigInterface, SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';

import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';
import { CoreTouchspinModule } from '@core/components/core-touchspin/core-touchspin.module';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { OfferPageComponent } from 'app/main/apps/ecommerce/offer-page/offer-page.component';
import { MarketBuyComponent } from 'app/main/apps/ecommerce/market-buy/market-buy.component';
import { EcommerceSidebarComponent } from 'app/main/apps/ecommerce/market-buy/sidebar/sidebar.component';
import { MarketSellComponent } from 'app/main/apps/ecommerce/market-sell/market-sell.component';
import { EcommerceCheckoutComponent } from 'app/main/apps/ecommerce/ecommerce-checkout/ecommerce-checkout.component';
import { EcommerceCheckoutItemComponent } from 'app/main/apps/ecommerce/ecommerce-checkout/ecommerce-checkout-item/ecommerce-checkout-item.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { SellOffersFormComponent } from './market-sell/sell-offers-form/sell-offers-form.component';
import {AuthGuard} from 'app/auth/helpers';



const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  observer: true
};

// routing
const routes: Routes = [
  {
    path: 'buy',
    component: MarketBuyComponent,
    data: { animation: 'EcommerceShopComponent' }
  },
  {
    path: 'details/:id',
    component: OfferPageComponent,
    data: { animation: 'EcommerceDetailsComponent' }
  },
  {
    path: 'sell',
    component: MarketSellComponent,
    data: { animation: 'EcommerceWishlistComponent' }
  },
  {
    path: 'create',
    component: EcommerceCheckoutComponent,
    canActivate: [AuthGuard],
    data: { animation: 'EcommerceCheckoutComponent' }
  }

];

@NgModule({
    declarations: [
        MarketBuyComponent,
        EcommerceSidebarComponent,
        OfferPageComponent,
        MarketSellComponent,
        EcommerceCheckoutComponent,
        EcommerceCheckoutItemComponent,
        SellOffersFormComponent

    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SwiperModule,
        FormsModule,
        CoreTouchspinModule,
        ContentHeaderModule,
        CoreSidebarModule,
        CoreCommonModule,
        NgbModule,
        NouisliderModule,
        HttpClientModule,
        NgSelectModule,
        ReactiveFormsModule

    ],
    exports: [
        SellOffersFormComponent
    ],
    providers: [
      AuthGuard,
        {
            provide: SWIPER_CONFIG,
            useValue: DEFAULT_SWIPER_CONFIG
        }
    ]
})
export class EcommerceModule {}
