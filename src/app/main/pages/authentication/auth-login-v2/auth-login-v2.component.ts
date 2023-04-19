import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {AuthenticationService} from 'app/auth/service';
import {CoreConfigService} from '@core/services/config.service';
import {FirebaseService} from 'app/services/firebase.service';


@Component({
  selector: 'app-auth-login-v2',
  templateUrl: './auth-login-v2.component.html',
  styleUrls: ['./auth-login-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthLoginV2Component implements OnInit {
  //  Public
  public coreConfig: any;
  public loginForm: FormGroup;
  public submitted = false;
  public returnUrl: string;
  public passwordTextType: boolean;
  public error = ''
  public loading = false
  public offer

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param _formBuilder
   * @param _route
   * @param _router
   * @param _authenticationService
   * @param firebase

   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private firebase: FirebaseService,
  ) {

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
    return this.loginForm.controls;
  }


  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // Login
    this.loading = true;
    this.firebase.login(this.f.email.value, this.f.password.value).subscribe(
      (response: any) => {
        this.loading = false

        //IF 2FA CONFIRM THE CODE
        if (response.responseMessage.choice_2fa == '2FA' && response.responseMessage.factor_login == 1) {
          let choice_2fa_log = response.responseMessage.choice_2fa_log
          let mail = response.responseMessage.email
          this._router.navigate(['pages/confirm-login'], {queryParams: {choice_2fa_log: choice_2fa_log, mail: mail}})//Pass the two params to confirm-login page
        }
        //IF IS NOT 2FA, Just login, but first do restriction check, the redirect accordingly
        else {

          if (response.responseMessage.status == 1) {//Active account
            const data = {
              username: response.responseMessage.username,
              token: response.responseMessage.token,
              email: response.responseMessage.email,
              sound: response.responseMessage.sound
            }
            localStorage.setItem('user', JSON.stringify(data))
            //Was from offer page
            if (this.offer == null) {
              this._router.navigate(['dashboard/overview'])
            } else {
              this._router.navigate(['/offers/bitcoin/details/' + this.offer])
            }


          }
          if (response.responseMessage.status == 2) {//On hold
            this._router.navigate(['dashboard/overview'])
          }
          if (response.responseMessage.status == 3) {//Banned
            this._router.navigate(['dashboard/overview'])
          }
          if (response.responseMessage.status == 4) {//Restricted
            this._router.navigate(['dashboard/overview'])
          }
          if (response.responseMessage.status == 5) {//Temporarily locked
            this._router.navigate(['dashboard/overview'])
          }


        }

      },
      (error) => {
        //Error callback
        this.loading = false
        this.error = error.error.responseMessage;
        console.error(error);

      }
    );

  }

  getUser(username: string, token: string) {
    this.firebase.getUser(username, token)
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    //Get the route param
    this._route.queryParams
      .subscribe(params => {
          console.log(params); // { orderby: "price" }
          this.offer = params.offer
        }
      );

    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });


  }


  fixCapitalsText(text: string) {
    var result = "";
    var sentenceStart = true;
    var i = 0;
    var ch = '';

    for (i = 0; i < text.length; i++) {
      ch = text.charAt(i);

      if (sentenceStart && ch.match(/^\S$/)) {
        ch = ch.toUpperCase();
        sentenceStart = false;
      } else {
        ch = ch.toLowerCase();
      }

      if (ch.match(/^[.!?]$/)) {
        sentenceStart = true;
      }

      result += ch;
    }

    return result;
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
