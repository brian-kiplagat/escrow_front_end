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

import { EcommerceDetailsComponent } from 'app/main/apps/ecommerce/ecommerce-details/ecommerce-details.component';
import { EcommerceItemComponent } from 'app/main/apps/ecommerce/ecommerce-item/ecommerce-item.component';
import { EcommerceShopComponent } from 'app/main/apps/ecommerce/ecommerce-shop/ecommerce-shop.component';
import { EcommerceSidebarComponent } from 'app/main/apps/ecommerce/ecommerce-shop/sidebar/sidebar.component';
import { EcommerceWishlistComponent } from 'app/main/apps/ecommerce/ecommerce-wishlist/ecommerce-wishlist.component';
import { EcommerceCheckoutComponent } from 'app/main/apps/ecommerce/ecommerce-checkout/ecommerce-checkout.component';
import { EcommerceCheckoutItemComponent } from 'app/main/apps/ecommerce/ecommerce-checkout/ecommerce-checkout-item/ecommerce-checkout-item.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { SellOffersFormComponent } from './ecommerce-wishlist/sell-offers-form/sell-offers-form.component';
import {AuthGuard} from 'app/auth/helpers';
import { CryptoLendingComponent } from './crypto-lending/crypto-lending.component';


const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  observer: true
};

// routing
const routes: Routes = [
  {
    path: 'buy',
    component: EcommerceShopComponent,
    data: { animation: 'EcommerceShopComponent' }
  },
  {
    path: 'details/:id',
    component: EcommerceDetailsComponent,
    data: { animation: 'EcommerceDetailsComponent' }
  },
  {
    path: 'sell',
    component: EcommerceWishlistComponent,
    data: { animation: 'EcommerceWishlistComponent' }
  },
  {
    path: 'create',
    component: EcommerceCheckoutComponent,
    canActivate: [AuthGuard],
    data: { animation: 'EcommerceCheckoutComponent' }
  },
  {
    path: 'crypto-lending',
    component: CryptoLendingComponent,
    canActivate: [AuthGuard],
    data: { animation: 'EcommerceCheckoutComponent' }
  },

];

@NgModule({
    declarations: [
        EcommerceShopComponent,
        EcommerceSidebarComponent,
        EcommerceDetailsComponent,
        EcommerceWishlistComponent,
        EcommerceCheckoutComponent,
        EcommerceItemComponent,
        EcommerceCheckoutItemComponent,
        SellOffersFormComponent,
        CryptoLendingComponent,


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
