import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {CoreConfigService} from '@core/services/config.service';
import {ActivatedRoute} from "@angular/router";
import {FirebaseService} from "../../../../services/firebase.service";


@Component({
  selector: 'app-auth-mail-verification-v2',
  templateUrl: './mail-verification-v2.component.html',
  styleUrls: ['./mail-verification-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MailVerificationV2Component implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public confPasswordTextType: boolean;
  public codeForm: FormGroup;
  public submitted = false;
  public loading = false;
  public email: any;
  public verificationCode: any
  public message: string;
  public success: boolean;
  public error: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(private firebase: FirebaseService, private _coreConfigService: CoreConfigService, private _formBuilder: FormBuilder, private route: ActivatedRoute) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.codeForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * Toggle confirm password
   */
  toggleConfPasswordTextType() {
    this.confPasswordTextType = !this.confPasswordTextType;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    // stop here if form is invalid
    if (this.codeForm.invalid) {
      this.loading = false;
      return;
    }
    let code = this.codeForm.value.newPassword
    this.verifyEmail(code, this.email);

  }


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.codeForm = this._formBuilder.group({
      newPassword: ['', [Validators.required]]
    });
    //Get token, the route param
    this.route.queryParams
      .subscribe(params => {
          console.log(params); // { orderby: "price" }
          this.verificationCode = params.verificationCode;
          this.email = params.email;
          this.verifyEmail(this.verificationCode, this.email)

        }
      );


    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  verifyEmail(code: any, email: any) {
    this.firebase.confirmMail({
      "verificationCode": code,
      "email": email,

    }).subscribe(
      (response: any) => {
        //Next callback
        console.log('response received', response);
        this.loading = false
        this.success = true
        this.message = "Great! You just confirmed your email";
      },
      (error) => {
        //Error callback
        this.loading = false
        this.error = true;
        this.message = error.error.responseMessage
        //console.error(error.error.responseMessage);
        //throw error;   //You can also throw the error to a global error handler
      })
  }

  resendConfirmation() {
    this.loading = true
    this.firebase.sendConfirmEmail({
      "email": this.email
    }).subscribe((response: any) => {
      this.loading = false;
      this.success = true
      this.message = "Your email verification was resent to your email. If you dont see it check your spam folder";
    }, (err) => {
      console.log(err)
      this.loading = false;
      this.error = true;
      this.message = err.error.responseMessage


    })
  }
}
