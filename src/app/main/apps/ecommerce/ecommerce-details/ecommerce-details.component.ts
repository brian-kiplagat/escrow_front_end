import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  public price;
  public btc;

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
    const productIdFromRoute = routeParams.get('id');
    this._fb.getInfo(productIdFromRoute).subscribe((data: any) => {
      //console.log(data.responseMessage.data)
      this.offer = data.responseMessage.data;
      this.offer_id = data.responseMessage.data.offer_id
      this.rate = data.responseMessage.data.margin
      this.price = data.responseMessage.data.price
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
          this.playAudio('assets/sounds/windows_warning.wav')
          this.router.navigate(['/offers/chat/room/' + data.responseMessage.trade_id])
        },
        (error) => {
          console.log(error);
          this.playAudio('assets/sounds/windows_warning.wav')
          this.err = error.error.responseMessage
        }
      );
      this.submitted = false;
    }


  }
  playAudio(path) {
    let audio = new Audio();
    audio.src = path;
    audio.load();
    audio.play();
  }

  onChangeEvent(event: any) {
    this.btc = event.target.value / this.price;
    this.btc = parseFloat(this.btc.toFixed(8));
    console.log(this.btc)

    this.form.patchValue({
      amounttoreceive: this.btc + ' BTC'
    });


  }
}
