import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {CoreConfigService} from '@core/services/config.service';
import {ActivatedRoute} from "@angular/router";
import {FirebaseService} from "../../../../services/firebase.service";

@Component({
  selector: 'app-auth-forgot-password-v2',
  templateUrl: './auth-reset-password-v2.component.html',
  styleUrls: ['./auth-reset-password-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthResetPasswordV2Component implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public confPasswordTextType: boolean;
  public resetPasswordForm: FormGroup;
  public submitted = false;
  public loading = false;
  public token: any;
  public username: any;
  public email: any;
  public success: boolean;
  public message: string;
  public error: boolean;
  // Private
  private _unsubscribeAll: Subject<any>;



  /**
   * Constructor
   *
   * @param firebase
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   * @param route
   */
  constructor(private firebase: FirebaseService,private _coreConfigService: CoreConfigService, private _formBuilder: FormBuilder, private route: ActivatedRoute) {
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
    return this.resetPasswordForm.controls;
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
    if (this.resetPasswordForm.invalid) {
      this.loading = false;
      return;
    }
    let pass1 = this.resetPasswordForm.value.newPassword
    let pass2 = this.resetPasswordForm.value.confirmPassword
    this.firebase.confirmResetPassword({
      "secret": this.token,
      "email": this.email,
      "username": this.username,
      "pass1": pass1,
      "pass2": pass2

    }).subscribe(
      (response: any) => {
        //Next callback
        console.log('response received', response);
        this.loading = false
        this.success = true
        this.message = "Great! You just changed your password. Keep your passwords safe. You may proceed to login";
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

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.resetPasswordForm = this._formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
    //Get token, the route param
    this.route.queryParams
      .subscribe(params => {
          console.log(params); // { orderby: "price" }
          this.token = params.token;
          this.username = params.username;
          this.email = params.email;
          //console.log(this.token+" "+this.username+" "+this.email); // price
          //Get username and email


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
}
