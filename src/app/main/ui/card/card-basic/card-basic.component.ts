import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-basic-card',
  templateUrl: './card-basic.component.html'
})
export class CardBasicComponent implements OnInit {
  // public
  public contentHeader: object;

  constructor() {}

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this.contentHeader = {
      headerTitle: 'My wallet',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Send and Receive BTC',
            isLink: true,
            link: '/'
          }
        ]
      }
    };
  }
}
