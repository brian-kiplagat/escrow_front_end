import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PricingService } from 'app/main/pages/pricing/pricing.service';
import {DomSanitizer} from "@angular/platform-browser";
import {FirebaseService} from "../../../services/firebase.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit, OnDestroy {
  // public
  public data: any;
  public user;
  public packages;
  Monthly = false;

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {PricingService} _pricingService
   */
  constructor(private _pricingService: PricingService, private fb:FirebaseService,private router:Router) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // get the currentUser details from localStorage
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fb.getPackages(this.user.token,this.user.username).subscribe((data: any) => {
      this.packages =data.responseMessage
      console.log(data)
    },(error)=>{
      console.log(error)

    });
    this._pricingService.onPricingChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.data = response;
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
