import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  // public
  public contentHeader: object;

  constructor() {}

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    // content header
    this.contentHeader = {
      headerTitle: 'My Records',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'All Transactions',
            isLink: true,
            link: '/'
          }
        ]
      }
    };
  }
}
