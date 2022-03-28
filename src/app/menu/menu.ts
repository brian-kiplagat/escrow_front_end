import { CoreMenu } from '@core/types';

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface

export const menu: CoreMenu[] = [
  {
    id: 'apps',
    type: 'item',
    title: 'Dashboard',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    url:"dashboard/ecommerce"
  },
  {
    id: 'apps',
    type: 'item',
    title: 'Buy Bitcoin',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    url:"apps/e-commerce/shop"
  },
  {
    id: 'apps',
    type: 'item',
    title: 'Sell Bitcoin',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    url:"apps/chat"
  },
  {
    id: 'apps',
    type: 'item',
    title: 'Create an Offer',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    url:"apps/email"
  },
  {
    id: 'apps',
    type: 'item',
    title: 'My Balance',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    url:"apps/invoice/list"
  },
  {
    id: 'apps',
    type: 'item',
    title: 'Send|Receive',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    url:"pages/pricing"
  },
  {
    id: 'apps',
    type: 'item',
    title: 'Contact Support',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    url:"apps/invoice/edit"
  },
  
];
