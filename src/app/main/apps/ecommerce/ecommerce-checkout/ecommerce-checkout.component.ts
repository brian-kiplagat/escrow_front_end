import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import Stepper from 'bs-stepper';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { FirebaseService } from '../../../../services/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ecommerce-checkout',
  templateUrl: './ecommerce-checkout.component.html',
  styleUrls: ['./ecommerce-checkout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class EcommerceCheckoutComponent implements OnInit {
  // Public
  public contentHeader: object;
 public isLinear = true;
  public products;
  public cartLists;
  public wishlist; 
  public selectMultiLimitedSelected = []

  public address = {
    fullNameVar: '',
    numberVar: '',
    flatVar: '',
    landmarkVar: '',
    cityVar: '',
    pincodeVar: '',
    stateVar: ''
  };
  public selectBasicLoading = false;
    public offers = []
    public currency:any[] = []
    public selectBasic: any[] = ['Bank Transfer', 'Mpesa', 'Paypal', 'Skrill'];

  // Private
  private checkoutStepper: Stepper;
  public checkoutForm: FormGroup;
  public submitted = false;

  /**
   *  Constructor
   *
   * @param {EcommerceService} _ecommerceService
   * 
   */
  constructor(private _ecommerceService: EcommerceService, private _fb: FirebaseService,private _formBuilder: FormBuilder,) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Stepper Next
   */
  nextStep() {
    this.checkoutStepper.next();
  }
  /**
   * Stepper Previous
   */
  previousStep() {
    this.checkoutStepper.previous();
  }

  /**
   * Validate Next Step
   *
   * @param checkoutForm
   */
  validateNextStep(checkoutForm) {
    if (checkoutForm.valid) {
      this.nextStep();
    }
  }
 // convenience getter for easy access to form fields
 get f() {
  return this.checkoutForm.controls;
}
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
   multiLimitedClearModel(){}
  
  ngOnInit(): void {

    this._fb
    .getOffers().subscribe((data) => {
        this.offers = data['data']['payload']
        console.log(this.offers)
    })
    this._fb.getExchange().subscribe((data)=>{

        let listnew = data['data']['rates']
      this.currency = Object.keys(listnew)
        console.log(this.currency)
    })
//initialize form
    this.checkoutForm = this._formBuilder.group({
      // username: ['', [Validators.required]],
      todo: ['', [Validators.required]],
      paymentMethod: ['', Validators.required],
      currency: ['', Validators.required]

    });
    // Subscribe to ProductList change
    this._ecommerceService.onProductListChange.subscribe(res => {
      this.products = res;

      this.products.isInWishlist = false;
    });

    // Subscribe to Cartlist change
    this._ecommerceService.onCartListChange.subscribe(res => (this.cartLists = res));

    // Subscribe to Wishlist change
    this._ecommerceService.onWishlistChange.subscribe(res => (this.wishlist = res));

    // update product is in Wishlist & is in CartList : Boolean
    this.products.forEach(product => {
      product.isInWishlist = this.wishlist.findIndex(p => p.productId === product.id) > -1;
      product.isInCart = this.cartLists.findIndex(p => p.productId === product.id) > -1;
    });

    this.checkoutStepper = new Stepper(document.querySelector('#checkoutStepper'), {
      linear: false,
      animation: true
    });
   
    // content header
    this.contentHeader = {
      headerTitle: 'Checkout',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'eCommerce',
            isLink: true,
            link: '/'
          },
          {
            name: 'Checkout',
            isLink: false
          }
        ]
      }
    };
  }
  onSubmit(){

  }
}
