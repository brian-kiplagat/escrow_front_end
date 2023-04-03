import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {CoreConfigService} from '@core/services/config.service';
import {FirebaseService} from '../../../../services/firebase.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-auth-fa-verification-v2',
  templateUrl: './fa-verification-v2.component.html',
  styleUrls: ['./fa-verification-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FaVerificationV2Component implements OnInit {
  // Public
  public coreConfig: any;
  public resetPasswordForm: FormGroup;
  public submitted = false;
  public loading = false;
  public secret: any;
  public email: any;
  public choice_2fa_log: string = '';
  public mail: string = '';
  public error: any;
  // Private
  private _unsubscribeAll: Subject<any>;


  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   * @param firebase
   * @param route
   * @param router
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private firebase: FirebaseService,
    private route: ActivatedRoute,
    private router: Router
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
    return this.resetPasswordForm.controls;
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
    //console.log(this.f.newPassword.value);
    this.firebase
      .confirm2FAAuth({
        "email": this.mail,
        "secret": this.choice_2fa_log,
        "code": this.f.newPassword.value
      })
      .subscribe(
        (response: any) => {

          if (response.responseMessage.status == 1) {//Active account
            const data = {
              username: response.responseMessage.username,
              token: response.responseMessage.token,
              email: response.responseMessage.email
            }
            localStorage.setItem('user', JSON.stringify(data))
            this.router.navigate(['dashboard/overview'])
          }
          if (response.responseMessage.status == 2) {//On hold
            this.router.navigate(['dashboard/overview'])
          }
          if (response.responseMessage.status == 3) {//Banned
            this.router.navigate(['dashboard/overview'])
          }
          if (response.responseMessage.status == 4) {//Restricted
            this.router.navigate(['dashboard/overview'])
          }
          if (response.responseMessage.status == 5) {//Temporarily locked
            this.router.navigate(['dashboard/overview'])
          }

        },
        (error: any) => {
          this.loading = false
          this.error = error.error.responseMessage;
          console.error(error);
        }
      );
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.resetPasswordForm = this._formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['']
    });
    //Get token, the route param
    this.route.queryParams.subscribe((params) => {
      this.secret = params.s;
      this.email = params.m;
    });

    this.route.queryParams.pipe(filter((params) => params.mail)).subscribe((params) => {
     // console.log(params); // { order: "popular" }
      (this.choice_2fa_log = params.choice_2fa_log), (this.mail = params.mail);
    });

    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe((config) => {
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
