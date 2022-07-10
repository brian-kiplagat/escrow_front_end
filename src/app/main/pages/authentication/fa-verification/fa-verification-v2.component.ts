import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import {FirebaseService} from "../../../../services/firebase.service";
import {ActivatedRoute} from "@angular/router";

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
  // Private
  private _unsubscribeAll: Subject<any>;


  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   * @param firebase
   * @param route
   */
  constructor(private _coreConfigService: CoreConfigService, private _formBuilder: FormBuilder,private firebase: FirebaseService,private route: ActivatedRoute) {
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
          console.log(params);
          this.secret = params.s;
          this.email = params.m;



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
