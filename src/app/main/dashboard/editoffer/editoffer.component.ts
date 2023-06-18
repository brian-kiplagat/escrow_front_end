import {Component, OnInit, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';
import Stepper from 'bs-stepper';
import {FirebaseService} from 'app/services/firebase.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-editoffer',
  templateUrl: './editoffer.component.html',
  styleUrls: ['./editoffer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {class: 'ecommerce-application'}
})
export class EditofferComponent implements OnInit {

  // Decorator
  @ViewChild('scrollMe') scrollMe: ElementRef;
  scrolltop: number = null;
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
  public user_data: any = {};
  public current_tags
  public limit_countries = 'none';
  public CHECK_ID: boolean;
  public CHECK_NAME: boolean;
  public CHECK_VPN: boolean;

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
    const routeParams = this.route.snapshot.paramMap;
    const productIdFromRoute = routeParams.get('id');
    this.user = JSON.parse(localStorage.getItem('user'))
    //initialize form
    this.checkoutForm = this._formBuilder.group({
      // username: ['', [Validators.required]],
      todo: ['sell'],
      paymentMethod: [null],
      currency: [null]
    });
    this.form2 = this._formBuilder.group({
      minimum: [''],
      maximum: [''],
      offerRate: [''],
      tags: [[]],
      label: [''],
      terms: [''],
      instructions: ['']
    });
    this.form3 = this._formBuilder.group({
      idverification: [''],
      minimumTrades: [''],
      limitusers: [''],
      limit_block: [''],
      fullname: [''],
      radioButton: [''],
      vpn: [''],
      limitCountries: ['none'],
      allowedCountries: [[]],
      blockedCountries: [[]]
    });

    this._fb.getInfo(productIdFromRoute).subscribe((data: any) => {
      this.offer = data.responseMessage.data;
      this.offer_id = data.responseMessage.data.offer_id
      this.rate = data.responseMessage.data.margin
      this.min = data.responseMessage.data.minimum
      this.max = data.responseMessage.data.maximum
      this.CHECK_NAME = data.responseMessage.data.full_name
      this.CHECK_ID = data.responseMessage.data.id_verification
      this.CHECK_VPN = data.responseMessage.data.vpn
      this.current_tags = data.responseMessage.data.tags
      this.user_data = data.responseMessage.data.user_data
      this.limit_countries = data.responseMessage.data.limit_countries

      this.form2.patchValue({
        tags: JSON.parse(this.current_tags),
      });

      this.form3.patchValue({
        minimumTrades: data.responseMessage.data.min_trades,
        limitusers: data.responseMessage.data.new_trader_limit,
        limit_block: data.responseMessage.data.limit_block


      });

      if (this.limit_countries == 'none') {
        this.form3.get('radioButton').setValue('none');
        this.form3.controls['allowedCountries'].disable();
        this.form3.controls['blockedCountries'].disable();

      }
      if (this.limit_countries == 'blocked') {
        this.form3.get('radioButton').setValue('blocked');
        this.blockCountires = true
        this.allowCountires = false
        this.form3.patchValue({
          blockedCountries: JSON.parse(data.responseMessage.data.blocked_countries)
        });


      }
      if (this.limit_countries == 'allowed') {
        this.form3.get('radioButton').setValue('allowed');
        this.blockCountires = false
        this.allowCountires = true
        this.form3.patchValue({
          allowedCountries: JSON.parse(data.responseMessage.data.allowed_countries)
        });


      }


    });
    this.user ? this._fb.getTags(this.user.username, this.user.token).subscribe((data: any) => {
      this.tags = data.responseMessage
    }) : this.user = {}

    this._fb.getCurrency().subscribe((data: any) => {
      this.currencies = data.responseMessage.currencies
      this.methods = data.responseMessage.methods
      this.countries = data.responseMessage.currencies

    }, (error) => {
      console.log(error)
    })

    this.checkoutStepper = new Stepper(document.querySelector('#checkoutStepper'), {
      linear: false,
      animation: true
    });
  }

  onSubmit() {
    console.log(this.form3.value)
    const key = uuidv4() + Math.round(new Date().getTime() / 1000).toString();
    this.user ? this._fb.editOffer(this.user.token, this.user.username, {

      "requestId": key,
      "offeridd": this.offer.offer_id,
      "method": !this.checkoutForm.value.paymentMethod ? this.offer.method : this.checkoutForm.value.paymentMethod,
      "currency": !this.checkoutForm.value.currency ? this.offer.currency : this.checkoutForm.value.currency,
      "type": !this.checkoutForm.value.todo ? "N/A" : this.checkoutForm.value.todo,
      "min": !this.form2.value.minimum ? this.offer.minimum : this.form2.value.minimum,
      "max": !this.form2.value.maximum ? this.offer.maximum : this.form2.value.maximum,
      "margin": !this.form2.value.offerRate ? this.offer.margin : this.form2.value.offerRate,
      "tags": !this.form2.value.tags ? this.tags : this.form2.value.tags,
      "label": !this.form2.value.label ? this.offer.label : this.form2.value.label,
      "terms": !this.form2.value.terms ? this.offer.terms : this.form2.value.terms,
      "instructions": !this.form2.value.instructions ? this.offer.instructions : this.form2.value.instructions,
      "new_trader_limit": !this.form3.value.limitusers ? 0 : parseInt(this.form3.value.limitusers),
      "limit_block": !this.form3.value.limit_block ? 0 : parseInt(this.form3.value.limit_block),
      "min_trades": !this.form3.value.minimumTrades ? 0 : parseInt(this.form3.value.minimumTrades),
      "blocked_countries": !this.form3.value.blockedCountries ? "N/A" : this.form3.value.blockedCountries,
      "allowed_countries": !this.form3.value.allowedCountries ? "N/A" : this.form3.value.allowedCountries,
      "vpn": this.CHECK_VPN,
      "id_verification": this.CHECK_ID,
      "full_name": this.CHECK_NAME,
      "limit_countries": !this.form3.value.limit_countries ? this.limit_countries : this.form3.value.limit_countries,

    }).subscribe((data) => {
      this.router.navigate(['/dashboard/overview'])
    }, (err) => {
      this._fb.playAudio('assets/sounds/bmw.mp3')
      this.errorMessage = err.error.responseMessage
      console.log(err.error)
      setTimeout(
        () => {
          this
            .scrolltop = this.scrollMe?.nativeElement.scrollHeight;
        }, 0)
      ;
    }) : this.user = {}
    this.submitted = true;
  }

  onCheckboxChange(e, type) {
    console.log(e)
    if (e.target.checked) {
      if (type == 'ID') {
        this.CHECK_ID = true;
      } else if (type == 'NAME') {
        this.CHECK_NAME = true;
      } else if (type == 'VPN') {
        this.CHECK_VPN = true;
      }
    } else {
      if (type == 'ID') {
        this.CHECK_ID = false;
      } else if (type == 'NAME') {
        this.CHECK_NAME = false;
      } else if (type == 'VPN') {
        this.CHECK_VPN = false;
      }

    }
  }
}
