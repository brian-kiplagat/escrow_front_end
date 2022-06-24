import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {SwiperConfigInterface} from 'ngx-swiper-wrapper';

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
  public oldoffer: any = {}
  public buyamount = ""
  public currentUser: any = {}
  public err = "";
  public form: FormGroup;

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
    let user = JSON.parse(localStorage.getItem('user'));
    const routeParams = this.route.snapshot.paramMap;
    const productIdFromRoute = routeParams.get('id');
    this._fb.getInfo(user.username, user.token, productIdFromRoute).subscribe((data: any) => {
      this.offer = data.responseMessage.data;
      let offer_tags = data.responseMessage.data.allowed_countries
      let formatted_tags =offer_tags.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, "")
      const arr = formatted_tags.slice(1, -1)
      let converted_tags =arr.split(',');
      console.log(converted_tags);
    });
    this.form = this._formBuilder.group({
      // username: ['', [Validators.required]],
      amounttoreceive: ['', Validators.required],     
      amount: ['', Validators.compose([
        Validators.required,
      ])],
    });

  }

  openTrade(form:any) {
    //get user and token from local stroge
    let user = JSON.parse(localStorage.getItem('user'));
    this.submitted = true;
    if (form.valid) {
      this._fb.getUser(user.username, user.token).subscribe((data: any) => {
        this.currentUser = data.responseMessage.user_data[0]
        //get current loggedin user
        this._fb
          .getOffers(user.username, user.token, this.offer.type).subscribe((data: any) => {
          this.offers = data.responseMessage
          const routeParams = this.route.snapshot.paramMap;
          const productIdFromRoute = routeParams.get('id');
          this.oldoffer = this.offers.find(product => product.idd == productIdFromRoute);
          const body = {
            "requestId": uuidv4() + Math.round(new Date().getTime() / 1000).toString(),
            "email": this.currentUser.email,
            "offer_id": this.oldoffer.idd,
            "amount_fiat": this.form.value.amount,
            "rate": this.oldoffer.margin,
            "min": this.offer.minimum,
            "max": this.offer.maximum
          }
          //formulate request body
  
          this._fb.openTrade(user.username, user.token, body).subscribe(
            (data: any) => {
             
              this.router.navigate(['/offers/chat/room/'+data.responseMessage.trade_id])
  
            },
            (error) => {
              console.log(error);
              this.err = error.error.responseMessage
            }
          );
  
  
        })
      })
      this.submitted = false;
    }



  }
}
