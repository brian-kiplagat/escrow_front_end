import {CoreMenu} from '@core/types';

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface

export const menu: CoreMenu[] = [
  {
    id: 'apps_1',
    type: 'item',
    title: 'Dashboard',
    translate: 'MENU.APPS.SECTION',
    icon: 'user',
    url: "dashboard/overview"
  },
  {
    id: 'apps_2',
    type: 'item',
    title: 'Buy Bitcoin',
    translate: 'MENU.APPS.SECTION',
    icon: 'dollar-sign',
    url: "offers/bitcoin/buy"
  },
  {
    id: 'apps_3',
    type: 'item',
    title: 'Sell Bitcoin',
    translate: 'MENU.APPS.SECTION',
    icon: 'dollar-sign',
    url: "offers/bitcoin/sell"

  },
  {
    id: 'apps_4',
    type: 'item',
    title: 'Create an Offer',
    translate: 'MENU.APPS.SECTION',
    icon: 'plus-circle',
    url: "offers/bitcoin/create"
  },
  {
    id: 'apps_5',
    type: 'item',
    title: 'My Wallet',
    translate: 'MENU.APPS.SECTION',
    icon: 'pocket',
    url: "wallet/main"
  },
  {
    id: 'apps_6',
    type: 'item',
    title: 'Statistics',
    translate: 'MENU.APPS.SECTION',
    icon: 'user-x',
    url: "dashboard/m_overview"
  }


];
