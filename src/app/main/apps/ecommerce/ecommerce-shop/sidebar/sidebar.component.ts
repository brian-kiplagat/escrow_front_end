import { Component, OnInit, ViewEncapsulation,Input } from '@angular/core';

@Component({
  selector: 'ecommerce-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['../ecommerce-shop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceSidebarComponent implements OnInit {
  @Input()methods:any
  // Public
  public sliderPriceValue = [1, 100];

  constructor() {}

  ngOnInit(): void {}
}
