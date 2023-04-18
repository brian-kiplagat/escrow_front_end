import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirebaseService} from 'app/services/firebase.service';

import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {CoreConfigService} from '@core/services/config.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-auth-register-v2',
  templateUrl: './auth-register-v2.component.html',
  styleUrls: ['./auth-register-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthRegisterV2Component implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public registerForm: FormGroup;
  public submitted = false;
  public error = '';
  public loading: Boolean = false;

  // Private
  private _unsubscribeAll: Subject<any>;
  private referral = 'NONE';
  public info: string;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   * @param firebase
   * @param router
   * @param route
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    public firebase: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
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
    return this.registerForm.controls;
  }

  // get error(): string {
  //   var firebaseError = this.firebase.signuperror;
  //   return this.fixCapitalsText(firebaseError);
  // }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;
    this.loading = true
    // stop here if form is invalid
    if (!this.registerForm.invalid) {

      this.firebase.registration(this.f.email.value, this.f.password.value, this.referral).subscribe(
        (response: any) => {
          //Next callback
          this.loading = false

          localStorage.setItem('user', JSON.stringify({
            username: response.responseMessage.username,
            token: response.responseMessage.token,
            email: response.responseMessage.email
          }))
          this.router.navigate(['dashboard/overview'])


        },
        (error) => {
          //Error callback
          this.loading = false
          this.error = error.error.responseMessage;

        }
      );
    } else {
      this.loading = false
    }


  }


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    //subscribe to referral link
    this.route.queryParams.subscribe(param => {
      if (param.r != null) {
        this.referral = param.r
        this.info =  'You were invited by ' + param.r
      }
    })


    this.registerForm = this._formBuilder.group({
      // username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe((config) => {
      this.coreConfig = config;
    });
  }

  fixCapitalsText(text: string) {
    var result = '';
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
