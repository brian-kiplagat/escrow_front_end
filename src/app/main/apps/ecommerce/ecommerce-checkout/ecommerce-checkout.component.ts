import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import Stepper from 'bs-stepper';
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
    public selectMultiLimitedSelected = [];
    public error = '';
    public tags = [];

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
    public offers = [];
    public currency: any[] = [];
    public countries: any[] = [];
    public selectBasic: any[] = ['Bank Transfer', 'Mpesa', 'Paypal', 'Skrill'];
    public noneSelected = true;

    // Private
    private checkoutStepper: Stepper;
    public checkoutForm: FormGroup;
    public submitted = false;
    public step2 = false;
    public form2: FormGroup;
    public form3: FormGroup;
    public allowCountires:Boolean =true;
    public blockCountires:Boolean =false;
    public user:any ={}
    /**
     *  Constructor
     *
     *
     */
    constructor(
        private _fb: FirebaseService,
        private _formBuilder: FormBuilder
    ) {}

    // Public Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Stepper Next
     */
    nextStep() {
        this.form3.valid ? this.onSubmit() : this.checkoutStepper.next();
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
    multiLimitedClearModel() {}
    checkCountry(e) {
        this.noneSelected = !this.noneSelected;
        this.form3.controls['allowedCountries'].disable();
        this.form3.controls['blockedCountries'].disable();
    }
    removeDisable() {
      this.allowCountires =!this.allowCountires
      this.blockCountires =!this.blockCountires
      this.form3.controls['allowedCountries'].enable();
      this.form3.controls['blockedCountries'].enable();}
    enableBlock(){
      this.blockCountires =!this.blockCountires
      this.allowCountires =!this.allowCountires
      this.form3.controls['allowedCountries'].enable();
      this.form3.controls['blockedCountries'].enable();
    }

    ngOnInit(): void {
      this.user = localStorage.getItem('user')
        this._fb.getOffers().subscribe((data) => {
            this.offers = data['data']['payload'];
        });

        this._fb.getTags().subscribe((data) => {
            this.tags = data['payload'];
        });
        this._fb.getExchange().subscribe((data) => {
            let listnew = data['data']['rates'];
            this.currency = Object.keys(listnew);
         
        });
        this._fb.getCountries().subscribe((data) => {
            this.countries = data['payload'];
            
        });
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
            selectMultiLimitedSelected: [[]],
            label: [
                '',
                Validators.compose([
                    Validators.required,
                    // Validators.minLength(3),
                    Validators.maxLength(25)
                ])
            ],
            terms: ['', Validators.required],
            instructions: ['', Validators.required]
        });
        this.form3 = this._formBuilder.group({
            // username: ['', [Validators.required]],
            partnerOptions: [''],
            minimumTrades: ['', Validators.required],
            limitusers: ['', Validators.required],
            limitCountries: ['none'],
            selectMultiLimitedSelected: [[]],
            allowedCountries:[[]],
            blockedCountries:[[]]
        });
        this.form3.controls['allowedCountries'].disable();
        this.form3.controls['blockedCountries'].disable();




        this.checkoutStepper = new Stepper(document.querySelector('#checkoutStepper'), {
            linear: false,
            animation: true
        });
    }
    onSubmit() {
        this._fb.createOffer(this.user.token,this.user.username,{
            requestId: '12345679979',
            method: this.checkoutForm.value.paymentMethod,
            currency: this.checkoutForm.value.currency,
            type: this.checkoutForm.value.todo,
            min: this.form2.value.minimum,
            max: this.form2.value.maximum,
            margin: this.form2.value.offerRate,
            tags:  this.form2.value.selectMultiLimitedSelected,
            label:  this.form2.value.label,
            terms: this.form2.value.terms,
            instructions: this.form2.value.instructions,
            new_trader_limit: this.form3.value.limitusers,
            blocked_countries:  this.form3.value.blockCountries,
            allowed_countries: this.form3.value.allowedCountries,
            vpn: '0'
        }).subscribe((data)=>{
          console.log(data)
        },(err)=>{
          console.log(err)
        })
        this.submitted = true;
    }
}
