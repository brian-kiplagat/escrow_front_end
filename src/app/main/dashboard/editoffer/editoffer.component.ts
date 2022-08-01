import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import Stepper from 'bs-stepper';
import { FirebaseService } from 'app/services/firebase.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router,ActivatedRoute} from '@angular/router';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-editoffer',
  templateUrl: './editoffer.component.html',
  styleUrls: ['./editoffer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {class: 'ecommerce-application'}
})
export class EditofferComponent implements OnInit {

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
  public offer_id;
  public rate;
  public min;
  public max;
  public offer: any = {};


  /**
   *  Constructor
   *
   *
   */
  constructor(
    private _fb: FirebaseService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
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
  }

  removeDisable() {
    this.allowCountires = !this.allowCountires
    this.blockCountires = !this.blockCountires
    this.form3.controls['allowedCountries'].enable();
    this.form3.controls['blockedCountries'].enable();
  }

  enableBlock() {
    this.blockCountires = !this.blockCountires
    this.allowCountires = !this.allowCountires
    this.form3.controls['allowedCountries'].enable();
    this.form3.controls['blockedCountries'].enable();
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const productIdFromRoute = routeParams.get('id');
    console.log(productIdFromRoute);
    
    this.user = JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
    this._fb.getInfo(this.user.username, this.user.token, productIdFromRoute).subscribe((data: any) => {
      console.log(data.responseMessage.data)
      this.offer = data.responseMessage.data;
      this.offer_id = data.responseMessage.data.offer_id
      this.rate = data.responseMessage.data.margin
      this.min = data.responseMessage.data.minimum
      this.max = data.responseMessage.data.maximum
      let offer_tags = data.responseMessage.data.tags
      let formatted_tags = offer_tags.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, "")
      const arr = formatted_tags.slice(1, -1)
      this.tags = arr.split(',')
      if (data.responseMessage.data.status != 1){
        // this.err = 'This offer is turned off at the moment. Try other offers'
        console.log("soort")
      }
      if (data.responseMessage.data.deauth == 1){
        console.log("soort")
       // this.err = 'This offer is deauthorized by a moderator due to a terms of service violation. Try other offers'
      }
    });
    this.user?this._fb.getTags(this.user.username, this.user.token).subscribe((data: any) => {
      console.log(data)
      this.tags = data.responseMessage
    }):this.user={}

    this._fb.getCurrency().subscribe((data: any) => {
      console.log(data)
      this.currencies = data.responseMessage.currencies
      this.methods = data.responseMessage.methods
      this.countries = data.responseMessage.currencies

      console.log(this.countries)

    }, (error) => {
      console.log(error)
    })

    //initialize form
    this.checkoutForm = this._formBuilder.group({
      // username: ['', [Validators.required]],
      todo: ['sell'],
      paymentMethod: [null],
      currency: [null]
    });
    this.form2 = this._formBuilder.group({
      // username: ['', [Validators.required]],
      minimum: [''],
      maximum: [''],
      offerRate: [''],
      tags: [[]],
      label: [''],
      terms: [''],
      instructions: ['']
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
    this.user?this._fb.createOffer(this.user.token, this.user.username, {

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
      "new_trader_limit": !this.form3.value.limitusers ? "N/A" : this.form3.value.limitusers,
      "limit_block": !this.form3.value.limit_block ? "N/A" : this.form3.value.limit_block,
      "blocked_countries": !this.form3.value.blockedCountries ? [] : this.form3.value.blockedCountries,
      "allowed_countries": !this.form3.value.allowedCountries ? [] : this.form3.value.allowedCountries,
      "vpn": !this.form3.value.vpn ? false : this.form3.value.vpn,
      "id_verification": !this.form3.value.idverification ? false : this.form3.value.idverification,
      "full_name": !this.form3.value.fullname ? false : this.form3.value.fullname,
      "min_trades": !this.form3.value.minimumTrades ? "N/A" : this.form3.value.minimumTrades,


    }).subscribe((data) => {
      this.router.navigate(['/dashboard/overview'])
    }, (err) => {
      this.errorMessage = err.error.responseMessage
      console.log(err.error)
    }):this.user={}
    this.submitted = true;
  }
}
