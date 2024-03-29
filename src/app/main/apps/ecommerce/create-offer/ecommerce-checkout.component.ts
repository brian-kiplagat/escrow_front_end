import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import Stepper from 'bs-stepper';
import {FirebaseService} from '../../../../services/firebase.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-ecommerce-checkout',
  templateUrl: './ecommerce-checkout.component.html',
  styleUrls: ['./ecommerce-checkout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {class: 'ecommerce-application'}
})
export class EcommerceCheckoutComponent implements OnInit {

  public selectMultiLimitedSelected = [];
  public error = '';
  public tags = [];
  public selectBasicLoading = false;
  public currency: any[] = [];
  public selectBasic: any[] = ['Bank Transfer', 'Mpesa', 'Paypal', 'Skrill'];
  public noneSelected = true;

  // Private
  private checkoutStepper: Stepper;
  public checkoutForm: FormGroup;
  public submitted = false;
  public step2 = false;
  public form2: FormGroup;
  public form3: FormGroup;
  public allowCountires: Boolean = true;
  public blockCountires: Boolean = false;
  public user: any = {}
  public errorMessage: string = ''
  public currencies = []
  public methods = []
  public countries: any[] = ['Bank Transfer', 'Mpesa', 'Paypal', 'Skrill'];
  public limit_countries = 'none';

  /**
   *  Constructor
   *
   *
   */
  constructor(
    private _fb: FirebaseService,
    private _formBuilder: FormBuilder,
    private router: Router
  ) {
  }

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
   * @param form2
   * @param form3
   */
  validateNextStep(form) {
    this.submitted = true;
    if (form.valid) {
      this.nextStep();
      this.submitted = false;
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.checkoutForm.controls;
  }

  get f1() {
    return this.form2.controls;
  }

  get f2() {
    return this.form3.controls;
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  multiLimitedClearModel() {
  }

  checkCountry(e) {
    this.noneSelected = !this.noneSelected;
    this.form3.controls['allowedCountries'].disable();
    this.form3.controls['blockedCountries'].disable();
    this.limit_countries = 'none'
  }

  removeDisable(type: any) {
    this.allowCountires = !this.allowCountires
    this.blockCountires = !this.blockCountires
    this.form3.controls['allowedCountries'].enable();
    this.form3.controls['blockedCountries'].enable();
    this.limit_countries = type
  }

  enableBlock() {
    this.blockCountires = !this.blockCountires
    this.allowCountires = !this.allowCountires
    this.form3.controls['allowedCountries'].enable();
    this.form3.controls['blockedCountries'].enable();
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'))
    this._fb.getCurrency().subscribe((data: any) => {

      this.currencies = data.responseMessage.currencies
      this.methods = data.responseMessage.methods
      this.countries = data.responseMessage.currencies
      this.tags = data.responseMessage.tags


    }, (error) => {
      console.log(error)
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
      minimum: ['', Validators.required],
      maximum: ['', Validators.required],
      offerRate: ['', Validators.required],
      tags: [[], Validators.required],
      label: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(25)
        ])
      ],

      terms: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(180)
      ])],
      instructions: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(400)
      ])]
    });
    this.form3 = this._formBuilder.group({
      // username: ['', [Validators.required]],
      idverification: [''],
      minimumTrades: [''],
      limitusers: [''],
      limit_block: [''],
      fullname: [''],
      vpn: [''],
      limitCountries: ['none'],
      allowedCountries: [[]],
      blockedCountries: [[]]
    });
    this.form3.controls['allowedCountries'].disable();
    this.form3.controls['blockedCountries'].disable();


    this.checkoutStepper = new Stepper(document.querySelector('#checkoutStepper'), {
      linear: false,
      animation: true
    });
  }

  onSubmit() {
    const key = uuidv4() + Math.round(new Date().getTime() / 1000).toString();
    this.user ? this._fb.createOffer(this.user.token, this.user.username, {

      "requestId": key,
      "method": this.checkoutForm.value.paymentMethod,
      "currency": this.checkoutForm.value.currency,
      "type": this.checkoutForm.value.todo,
      "min": this.form2.value.minimum,
      "max": this.form2.value.maximum,
      "margin": this.form2.value.offerRate,
      "tags": this.form2.value.tags,
      "label": this.form2.value.label,
      "terms": this.form2.value.terms,
      "instructions": this.form2.value.instructions,

      "new_trader_limit": !this.form3.value.limitusers ? 0 : this.form3.value.limitusers,
      "limit_block": !this.form3.value.limit_block ? 0 : this.form3.value.limit_block,
      "min_trades": !this.form3.value.minimumTrades ? 0 : this.form3.value.minimumTrades,

      "blocked_countries": !this.form3.value.blockedCountries ? "N/A" : this.form3.value.blockedCountries.toString(),
      "allowed_countries": !this.form3.value.allowedCountries ? "N/A" : this.form3.value.allowedCountries.toString(),

      "id_verification": !this.form3.value.idverification ? false : this.form3.value.idverification,
      "full_name": !this.form3.value.fullname ? false : this.form3.value.fullname,
      "vpn": !this.form3.value.vpn ? false : this.form3.value.vpn,

      "limit_countries": this.limit_countries

    }).subscribe((data) => {
      this.router.navigate(['/dashboard/overview'])
    }, (err) => {
      this.errorMessage = err.error.responseMessage
      console.log(err.error)
    }) : this.user = {}
    this.submitted = true;
  }
}
