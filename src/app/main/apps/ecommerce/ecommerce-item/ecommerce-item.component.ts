import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import {FirebaseService} from '../../../../services/firebase.service';

@Component({
  selector: 'app-ecommerce-item',
  templateUrl: './ecommerce-item.component.html',
  styleUrls: ['./ecommerce-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class EcommerceItemComponent implements OnInit {
  // Input Decorotor
  @Input() offer;
  @Input() isWishlistOpen = false;

  // Public
  public isInCart = false;

  /**
   *
   * @param fb
   */
  constructor(private fb: FirebaseService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    console.log("test successful")
  }
}
