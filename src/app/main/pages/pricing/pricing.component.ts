import {Component, OnInit, OnDestroy} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FirebaseService} from "../../../services/firebase.service";
import {Router} from "@angular/router";
import {v4 as uuidv4} from 'uuid';

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
  public investments
  Monthly = false;
  public msg;
  public error
  public success
  public Questions = []

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param fb
   * @param router
   */
  constructor(private fb: FirebaseService, private router: Router) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fb.getPackages(this.user.token, this.user.username,this.user.email).subscribe((data: any) => {
      this.packages = data.responseMessage.packages
      this.investments = data.responseMessage.investment
      console.log(data)
    }, (error) => {
      console.log(error)
    this.Questions =  [
      {
        question: 'Does my subscription automatically renew?',
        ans:
          'You have to do it after end of every circle.'
      },
      {
        question: 'What yield do i get?',
        ans:
          'It depends on the APY you see on the site.'
      },
      {
        question: 'Am I allowed to modify the item that I purchased?',
        ans:
          'No you cannot.Until after the end of the market cycle.'
      }
    ]
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

  invest(id) {
    this.user = JSON.parse(localStorage.getItem('user'));
    const body = {
      "requestId": uuidv4() + Math.round(new Date().getTime() / 1000).toString(),
      "packageId": id,
      "email": this.user.email
    }
    this.fb.investPackage(this.user.username,this.user.token, body).subscribe((data: any) => {
      this.msg = data.responseMessage
      this.success = true
      this.error = false
      console.log(data)
    }, (error) => {
      console.log(error)
      this.msg = error.error.responseMessage
      this.error = true
      this.success = false
    });

  }
}
