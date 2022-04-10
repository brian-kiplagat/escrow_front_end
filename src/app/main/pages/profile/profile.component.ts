import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FirebaseService } from 'app/services/firebase.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProfileService } from 'app/main/pages/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit, OnDestroy {
  // public
  public contentHeader: object;
  public data: any;
  public toggleMenu = true;
  public Monthly = false;
  public toggleNavbarRef = false;
  public loadMoreRef = false;
  email:string =''
  public userData:any={about: "No about yet",
  active: 1,
  feed_neg: 0,
  feed_pos: 0,
  geolocation: "none",
  ip: "none",
  registration_date: "2022-04-01 13:14:34",
  status: 1}
  public feeds:any[]=[]

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {PricingService} _pricingService
   */
  constructor(private _pricingService: ProfileService, private sanitizer: DomSanitizer, private fb:FirebaseService) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Load More
   */
  loadMore() {
    this.loadMoreRef = !this.loadMoreRef;
    setTimeout(() => {
      this.loadMoreRef = !this.loadMoreRef;
    }, 2000);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    console.log( this.fb.user)
    this.fb.getProfile().subscribe((data)=>{
      this.userData = data['user_data'][0]
      this.feeds = data['feedback_data']
      console.log(this.feeds)
    })
    
    this._pricingService.onPricingChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.data = response;
    });

    // content header
    this.contentHeader = {
      headerTitle: 'Profile',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Pages',
            isLink: true,
            link: '/'
          },
          {
            name: 'Profile',
            isLink: false
          }
        ]
      }
    };
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
