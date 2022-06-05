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
  public submitted = false;
  public returnUrl: string;
  public passwordTextType: boolean;
  public error =''
  public loading = false
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
    private firebase: FirebaseService,
    private router:Router
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
          //Next callback
          console.log('response received', response);
          this.getUser( response.responseMessage.username,response.responseMessage.token)
          const data ={
            username:response.responseMessage.username,
            token: response.responseMessage.token
          }
          this.loading =false
          this.router.navigate(['dashboard/overview'])
          localStorage.setItem('user',JSON.stringify(data))
      },
      (error) => {
          //Error callback
          this.loading =false
          this.error = error.error.responseMessage;
          console.error(error);
          //throw error;   //You can also throw the error to a global error handler
      }
  );
    if (this.error) {
         this.loading = false;
    }
  }
  getUser(username:string,token:string){
    this.firebase.getUser(username,token)
    }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
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
