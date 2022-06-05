import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from './card/card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// routing
const routes: Routes = [

  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)
  },
  {
    path: 'bitcoin',
    loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule)
  },

];

FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]);

@NgModule({
  declarations: [
    CardComponent
  ],
  imports: [CommonModule, HttpClientModule,NgbModule,   RouterModule.forChild(routes)]
})
export class AppsModule { }
