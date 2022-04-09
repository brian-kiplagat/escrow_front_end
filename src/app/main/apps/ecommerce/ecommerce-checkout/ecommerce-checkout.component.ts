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
  public error =''
  public tags = []

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
    public countries:any[] = []
    public selectBasic: any[] = ['Bank Transfer', 'Mpesa', 'Paypal', 'Skrill'];
    public noneSelected = true;

  // Private
  private checkoutStepper: Stepper;
  public checkoutForm: FormGroup;
  public submitted = false;
  public step2 = false;
  public form2 :FormGroup;
  public form3 :FormGroup;
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
  finalStep(){
    this.submitted = true
    if(!this.form2.invalid){
      this.checkoutStepper.next()
      this.submitted = false
    }
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
   * @param form2
   * @param form3
   */
  validateNextStep(form) {
    this.submitted = true
    if (form.valid) {
      this.nextStep();
      this.submitted = false
    }
  }
 // convenience getter for easy access to form fields
 get f() {
  return this.checkoutForm.controls;
}
get f1(){
  return this.form2.controls;
}

get f2(){
  return this.form3.controls;
}
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
   multiLimitedClearModel(){}
   checkCountry(e){
     this.noneSelected =!this.noneSelected
     this.form3.controls['selectMultiLimitedSelected'].disable();
    console.log(e)
   }
   removeDisable(){
    this.form3.controls['selectMultiLimitedSelected'].enable()
   }
  
  ngOnInit(): void {

    this._fb
    .getOffers().subscribe((data) => {
        this.offers = data['data']['payload']
        console.log(this.offers)
    })
    
    this._fb
    .getTags().subscribe((data) => {
         this.tags = data['payload']
        console.log(this.tags)
    })
    this._fb.getExchange().subscribe((data)=>{

        let listnew = data['data']['rates']
      this.currency = Object.keys(listnew)
        console.log(this.currency)
    })
    this._fb.getCountries().subscribe((data)=>{

      this.countries = data['payload']
    // this.currency = Object.keys(listnew)
      console.log(this.countries)
  })
//initialize form
    this.checkoutForm = this._formBuilder.group({
      // username: ['', [Validators.required]],
      todo: ['sell'],
      paymentMethod: [null, Validators.required],
      currency: [null, Validators.required]

    });
    this.form2 = this._formBuilder.group({
      // username: ['', [Validators.required]],
      minimum:['', Validators.required],
      maximum:['', Validators.required],
      offerRate:['', Validators.required],
    selectMultiLimitedSelected:[[]],
    label:['',         Validators.compose([
      Validators.required,
      // Validators.minLength(3),
      Validators.maxLength(25),
    ]),
],
    terms:['', Validators.required],
    instructions:['', Validators.required]


    });
    this.form3 = this._formBuilder.group({
      // username: ['', [Validators.required]],
      partnerOptions:[''],
      minimumTrades:['', Validators.required],
      limitusers:['', Validators.required],
      limitCountries:['none'],
      selectMultiLimitedSelected:[[]],
  

    });
    this.form3.controls['selectMultiLimitedSelected'].disable();
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
this.submitted = true;
console.log('we are here')
if(this.form2.valid){
  this.nextStep()  
  this.submitted = false
}

  }
}
