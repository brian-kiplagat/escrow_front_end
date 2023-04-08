import {Component, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {FirebaseService} from 'app/services/firebase.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute, Router} from "@angular/router";
import {object} from "@angular/fire/database";


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
  email: string = '';
  public userData: any = {
    about: "No about yet",
    active: 1,
    feed_neg: 0,
    feed_pos: 0,
    geolocation: "none",
    ip: "none",
    registration_date: "2022-04-01 13:14:34",
    status: 1
  };
  public feeds: any[] = [];
  public currentUser: any = {};
  public image = '/assets/images/avatars/avatar.webp'
  public user: any = {};
  public has_blocked;
  public blocked_by;
  public external_username;
  public msg;
  public success = false;
  public error = false;
  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param route
   * @param sanitizer
   * @param fb
   * @param router
   */
  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private fb: FirebaseService, private router: Router) {
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
    this.external_username = this.route.snapshot.paramMap.get('id');

    console.log(this.external_username);
    // get the currentUser details from localStorage
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fb.getUserForProfile(this.external_username, this.user.token, this.user.username).subscribe((data: any) => {
      this.currentUser = data.responseMessage?.user_data[0];
      this.image = data.responseMessage?.user_data[0].profile_link;
      this.has_blocked = data.responseMessage?.has_blocked.length;
      this.blocked_by = data.responseMessage?.blocked_by.length;
      console.log(data);
    }, (error) => {
      console.log(error);
      this.router.navigate(['/']);
    });

    // content header
    this.contentHeader = {
      headerTitle: 'Profile',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Profile',
            isLink: false
          }
        ]
      }
    };
  }

  getEmail() {
    return localStorage.getItem('user');
  }


  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  block(ext_username: string) {
    let user = JSON.parse(localStorage.getItem('user'));
    this.fb.blockNow(this.user.token, this.user.username, {

      "email": user.email,
      "please_block": ext_username,
      "trade_id": 'PROFILE_PAGE',

    }).subscribe((response: any) => {
      this.msg = response.responseMessage
      this.success = true;

    }, (err) => {
      this.msg = err.error.responseMessage
      this.error = true;
      console.log(err.error)
    })
  }

  send_coins(external_username) {
    
  }
}
