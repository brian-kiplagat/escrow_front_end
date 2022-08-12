import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {CommonModule} from '@angular/common';

import 'hammerjs';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastrModule} from 'ngx-toastr';
import {TranslateModule} from '@ngx-translate/core';
import {ContextMenuModule} from '@ctrl/ngx-rightclick';

import {CoreModule} from '@core/core.module';
import {CoreCommonModule} from '@core/common.module';
import {CoreSidebarModule, CoreThemeCustomizerModule} from '@core/components';
import {CardSnippetModule} from '@core/components/card-snippet/card-snippet.module';

import {coreConfig} from 'app/app-config';
import {AppComponent} from 'app/app.component';
import {LayoutModule} from 'app/layout/layout.module';
import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAnalyticsModule} from '@angular/fire/compat/analytics';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {environment} from '../environments/environment';
import {AuthGuard} from 'app/auth/helpers';
import {ProfileComponent} from './main/pages/profile/ProfileComponent';
import {FaqComponent} from './main/pages/faq/faq.component';
import {EcommerceModule} from "./main/apps/ecommerce/ecommerce.module";
import {NgApexchartsModule} from "ng-apexcharts";


const appRoutes: Routes = [
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'offers',
    loadChildren: () => import('./main/apps/apps.module').then(m => m.AppsModule),

  },
  {
    path: 'pages',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: 'ui',
    loadChildren: () => import('./main/ui/ui.module').then(m => m.UIModule),

  }
  ,
  {
    path: 'users/:id',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },
  {
    path: '',
    component: FaqComponent,
    data: {animation: 'faq'},
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'pages/miscellaneous/error' //Error 404 - Page not found
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    FaqComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ContentHeaderModule,
    CommonModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy'
    }),
    NgbModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot(),
    ContextMenuModule,
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,
    CardSnippetModule,
    LayoutModule,
    ContentHeaderModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    EcommerceModule,
    NgApexchartsModule,
  ],

  providers: [
   AuthGuard
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
