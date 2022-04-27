import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeUntil, first} from 'rxjs/operators';
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
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public passwordTextType: boolean;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private firebase: FirebaseService
  ) {
    // // redirect to home if already logged in
    // if (this.firebase.auth.currentUser) {
    //   this._router.navigate(['/']);
    // }

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

  get error(): string {
    var firebaseError = this.firebase.loginerror;
    return this.fixCapitalsText(firebaseError);
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
    this.firebase
      .login(this.f.email.value, this.f.password.value)
    if (this.error) {
         this.loading = false;
    }
    // .pipe(first())
    // .subscribe(
    //   data => {
    //     this._router.navigate([this.returnUrl]);
    //   },
    //   error => {
    //     this.error = error;
    //     this.loading = false;
    //   }
    // );
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.firebase.getUser().subscribe((data)=>{
      console.log(data)
  })
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
