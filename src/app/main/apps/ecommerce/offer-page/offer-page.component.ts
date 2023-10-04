import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../../../services/firebase.service';
import { v4 as uuidv4 } from 'uuid';
import { coreConfig } from '../../../../app-config';


@Component({
  selector: 'app-ecommerce-details',
  templateUrl: './offer-page.component.html',
  styleUrls: ['./offer-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class OfferPageComponent implements OnInit {
  // public
  public contentHeader: object;
  public submitted = false;
  public offer: any = {};
  public offers = [];
  public buyamount = '';
  public err = '';
  public form: FormGroup;
  public tags: string[] = [];

  public offer_id;
  public rate;
  public min;
  public max;
  public logged;
  public price;
  public btc;
  public productIdFromRoute: string;
  public loading: boolean = false;

  /**
   * Constructor
   *
   * @param route
   * @param _fb
   * @param router
   * @param _formBuilder
   */
  constructor(
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


  /**
   * Add To Cart
   *
   * @param product
   */

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------


  /**
   * On init
   */
  ngOnInit(): void {

    if (localStorage.getItem('user') === null) {
      this.logged = false;
    } else {
      this.logged = true;
    }
    const routeParams = this.route.snapshot.paramMap;
    this.productIdFromRoute = routeParams.get('id');
    this._fb.getInfo(this.productIdFromRoute).subscribe((data: any) => {
      this.offer = data.responseMessage.data;
      this.offer_id = data.responseMessage.data.offer_id;
      this.rate = data.responseMessage.data.margin;
      this.price = data.responseMessage.data.price;
      this.min = data.responseMessage.data.minimum;
      this.max = data.responseMessage.data.maximum;
      let offer_tags = data.responseMessage.data.tags;
      let formatted_tags = offer_tags.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, '');
      console.log(this.offer);
      const arr = formatted_tags.slice(1, -1);
      this.tags = arr.split(',');
      if (data.responseMessage.data.status != 1) {
        this.err = 'This Offer is not active anymore because it was turned off by the owner. Please browse for other ' + this.offer.method + ' offers';
        this._fb.playAudio('assets/sounds/windows_warning.wav');
      }
      if (data.responseMessage.data.deauth == 1) {
        this.err = 'This offer is turned off by a moderator due to a terms of service violation.  Please browse for other offers';
        this._fb.playAudio('assets/sounds/windows_warning.wav');
      }
    }, error => {
      this._fb.playAudio('assets/sounds/windows_warning.wav');
      this.err = error.error.responseMessage;
    });
    this.form = this._formBuilder.group({
      amounttoreceive: ['', Validators.required],
      amount: ['', Validators.compose([
        Validators.required
      ])]
    });

  }

  openTrade(form: any) {
    //get user and token from local stroge
    let user = JSON.parse(localStorage.getItem('user'));
    this.submitted = true;
    if (form.valid) {
      this.loading = true;
      const body = {
        'requestId': uuidv4() + Math.round(new Date().getTime() / 1000).toString(),
        'email': user.email,
        'offer_id': this.offer_id,
        'amount_fiat': this.form.value.amount,
        'rate': this.rate,
        'min': this.min,
        'max': this.max
      };
      //formulate request body
      this._fb.openTrade(user.username, user.token, body).subscribe(
        (data: any) => {
          this.loading = false;
          this._fb.playAudio('assets/sounds/windows_warning.wav');
          this.router.navigate(['/offers/chat/room/' + data.responseMessage.trade_id]);
        },
        (error) => {
          this.loading = false;
          console.log(error);
          this._fb.playAudio('assets/sounds/windows_warning.wav');
          this.err = error.error.responseMessage;
        }
      );
      this.submitted = false;
    }


  }

  onChangeEvent(event: any) {
    this.btc = event.target.value / this.price;
    this.btc = parseFloat(this.btc.toFixed(8));
    console.log(this.btc);

    this.form.patchValue({
      amounttoreceive: this.btc + ' BTC'
    });


  }

  share(offer_id) {
    navigator.share({
      title: 'Trade BTC with ' + this.offer.offer_username + ' by ' + this.offer.method,
      url: coreConfig.app.appUrl + 'offers/bitcoin/details/' + offer_id
    }).then(r => {
      console.error('Shared success:');
    }).catch((error) => console.error('Error sharing:', error));

  }

  report(offer_id, reason) {

  }

  getMargin(margin) {

    return Math.abs(margin);
  }
}
