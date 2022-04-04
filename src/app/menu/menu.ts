import { CoreMenu } from '@core/types';

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface

export const menu: CoreMenu[] = [
  {
    id: 'apps',
    type: 'item',
    title: 'Dashboard',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    url: "dashboard/overview"
  },
  {
    id: 'apps',
    type: 'item',
    title: 'Buy Bitcoin',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    url: "offers/bitcoin/buy"
  },
  {
    id: 'apps',
    type: 'item',
    title: 'Sell Bitcoin',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    url:"offers/bitcoin/sell"

  },
  {
    id: 'apps',
    type: 'item',
    title: 'Create an Offer',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    url: "offers/bitcoin/create"
  },
  // {
  //   id: 'apps',
  //   type: 'item',
  //   title: 'My Balance',
  //   translate: 'MENU.APPS.SECTION',
  //   icon: 'package',
  //   url: "apps/invoice/list"
  // },
  // {
  //   id: 'apps',
  //   type: 'item',
  //   title: 'Send|Receive',
  //   translate: 'MENU.APPS.SECTION',
  //   icon: 'package',
  //   url: "pages/pricing"
  // },
  // {
  //   id: 'apps',
  //   type: 'item',
  //   title: 'Contact Support',
  //   translate: 'MENU.APPS.SECTION',
  //   icon: 'package',
  //   url: "apps/invoice/edit"
  // },

];
