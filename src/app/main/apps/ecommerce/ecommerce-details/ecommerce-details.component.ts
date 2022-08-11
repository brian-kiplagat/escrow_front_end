import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {EcommerceService} from 'app/main/apps/ecommerce/ecommerce.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FirebaseService} from '../../../../services/firebase.service';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-ecommerce-details',
  templateUrl: './ecommerce-details.component.html',
  styleUrls: ['./ecommerce-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {class: 'ecommerce-application'}
})
export class EcommerceDetailsComponent implements OnInit {
  // public
  public contentHeader: object;
  public submitted = false;
  public offer: any = {};
  public offers = [];
  public buyamount = ""
  public err = "";
  public form: FormGroup;
  public tags: string[] = []

  public offer_id;
  public rate;
  public min;
  public max;
  public logged;

  /**
   * Constructor
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(
    private _ecommerceService: EcommerceService,
    private route: ActivatedRoute,
    private _fb: FirebaseService,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Wishlist
   * @param form

   */
  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  toggleWishlist(product) {
    if (product.isInWishlist === true) {
      this._ecommerceService.removeFromWishlist(product.id).then((res) => {
        product.isInWishlist = false;
      });
    } else {
      this._ecommerceService.addToWishlist(product.id).then((res) => {
        product.isInWishlist = true;
      });
    }
  }

  /**
   * Add To Cart
   *
   * @param product
   */
  addToCart(product) {
    this._ecommerceService.addToCart(product.id).then((res) => {
      product.isInCart = true;
    });
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------


  /**
   * On init
   */
  ngOnInit(): void {

    if (localStorage.getItem('user') === null){
      this.logged =  false;
    }else {
      this.logged =  true;
    }
    const routeParams = this.route.snapshot.paramMap;
    const productIdFromRoute = routeParams.get('id');
    this._fb.getInfo(productIdFromRoute).subscribe((data: any) => {
      //console.log(data.responseMessage.data)
      this.offer = data.responseMessage.data;
      this.offer_id = data.responseMessage.data.offer_id
      this.rate = data.responseMessage.data.margin
      this.min = data.responseMessage.data.minimum
      this.max = data.responseMessage.data.maximum
      let offer_tags = data.responseMessage.data.tags
      let formatted_tags = offer_tags.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, "")
      const arr = formatted_tags.slice(1, -1)
      this.tags = arr.split(',')
      if (data.responseMessage.data.status != 1) {
        this.err = 'This offer is turned off at the moment. Try other offers'
      }
      if (data.responseMessage.data.deauth == 1) {
        this.err = 'This offer is deauthorized by a moderator due to a terms of service violation. Try other offers'
      }
    });
    this.form = this._formBuilder.group({
      amounttoreceive: ['', Validators.required],
      amount: ['', Validators.compose([
        Validators.required,
      ])],
    });

  }

  openTrade(form: any) {
    //get user and token from local stroge
    let user = JSON.parse(localStorage.getItem('user'));
    this.submitted = true;
    if (form.valid) {
      const body = {
        "requestId": uuidv4() + Math.round(new Date().getTime() / 1000).toString(),
        "email": user.email,
        "offer_id": this.offer_id,
        "amount_fiat": this.form.value.amount,
        "rate": this.rate,
        "min": this.min,
        "max": this.max
      }
      //formulate request body
      this._fb.openTrade(user.username, user.token, body).subscribe(
        (data: any) => {
          this.router.navigate(['/offers/chat/room/' + data.responseMessage.trade_id])
        },
        (error) => {
          console.log(error);
          this.err = error.error.responseMessage
        }
      );
      this.submitted = false;
    }


  }
}
