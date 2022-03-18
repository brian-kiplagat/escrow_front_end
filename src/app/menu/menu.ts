import { CoreMenu } from '@core/types';

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface

export const menu: CoreMenu[] = [
  {
    id: 'apps',
    type: 'section',
    title: 'Sections',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    children: [

      {
        id: 'Buy',
        title: 'Buy',
        translate: 'MENU.APPS.INVOICE.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'file-text',
        children: [
          {
            id: 'invoice-list',
            title: 'Buy Bitcoin',
            translate: 'MENU.APPS.INVOICE.LIST',
            type: 'item',
            icon: 'circle',
            url: 'apps/invoice/list'
          },
          {
            id: 'invoicePreview',
            title: 'Buy Tether',
            translate: 'MENU.APPS.INVOICE.PREVIEW',
            type: 'item',
            icon: 'circle',
            url: 'apps/invoice/preview'
          },
          {
            id: 'invoiceEdit',
            title: 'Buy Etherium',
            translate: 'MENU.APPS.INVOICE.EDIT',
            type: 'item',
            icon: 'circle',
            url: 'apps/invoice/edit'
          },

        ]
      },
      {
        id: 'Sell',
        title: 'Sell',
        translate: 'MENU.APPS.ECOMMERCE.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'shopping-cart',
        children: [
          {
            id: 'shop',
            title: 'Sell Bitcoin',
            translate: 'MENU.APPS.ECOMMERCE.Bitcoin',
            type: 'item',
            icon: 'circle',
            url: 'apps/e-commerce/shop'
          },
          {
            id: 'details',
            title: 'Sell Tether',
            translate: 'MENU.APPS.ECOMMERCE.Tether',
            type: 'item',
            icon: 'circle',
            url: 'apps/e-commerce/details'
          },
          {
            id: 'wishList',
            title: 'Sell Etherium',
            translate: 'MENU.APPS.ECOMMERCE.Etherium',
            type: 'item',
            icon: 'circle',
            url: 'apps/e-commerce/wishlist'
          }
        ]
      },
      {
        id: 'users',
        title: 'User',
        translate: 'MENU.APPS.USER.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'user',
        children: [
          {
            id: 'list',
            title: 'List',
            translate: 'MENU.APPS.USER.LIST',
            type: 'item',
            icon: 'circle',
            url: 'apps/user/user-list'
          },
          {
            id: 'view',
            title: 'View',
            translate: 'MENU.APPS.USER.VIEW',
            type: 'item',
            icon: 'circle',
            url: 'apps/user/user-view'
          },
          {
            id: 'edit',
            title: 'Edit',
            translate: 'MENU.APPS.USER.EDIT',
            type: 'item',
            icon: 'circle',
            url: 'apps/user/user-edit'
          }
        ]
      }
    ]
  },
];
