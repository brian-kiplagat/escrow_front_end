import {Component, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FlatpickrOptions} from 'ng2-flatpickr';

import {AccountSettingsService} from 'app/main/pages/account-settings/account-settings.service';
import {FirebaseService} from "../../../services/firebase.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {isNumeric} from "rxjs/internal-compatibility";

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  // public
  public contentHeader: object;
  public data: any;
  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };
  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;
  public avatarImage: string;
  public user: any = {}
  public currentUser: any = {}
  public two_factor: boolean
  public tg_identifier: boolean
  public telegram_bool = false
  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {AccountSettingsService} _accountSettingsService
   */
  constructor(private _accountSettingsService: AccountSettingsService, private fb: FirebaseService, private router: Router) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Password Text Type Old
   */
  togglePasswordTextTypeOld() {
    this.passwordTextTypeOld = !this.passwordTextTypeOld;
  }

  /**
   * Toggle Password Text Type New
   */
  togglePasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  /**
   * Toggle Password Text Type Retype
   */
  togglePasswordTextTypeRetype() {
    this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
  }

  /**
   * Upload Image
   *
   * @param event
   */
  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this._accountSettingsService.onSettingsChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.data = response;
      this.avatarImage = 'this.data.accountSetting.general.avatar';
    });

    this.user = JSON.parse(localStorage.getItem('user'));
    this.fb.getUser(this.user.username, this.user.token).subscribe((data: any) => {
      this.currentUser = data.responseMessage?.user_data[0];
      this.avatarImage = this.currentUser.profile_link;
      this.tg_identifier = this.currentUser.tg_hash_identifier;
      if (this.currentUser.tg_id == 'NA') {
        this.telegram_bool = false;
      } else {
        this.telegram_bool = true;
      }
      if (this.currentUser.choice_2fa == 'NA') {
        this.two_factor = false;
      } else {
        this.two_factor = true;
      }

      //console.log(data)
    }, (error) => {
      console.log(error)
      this.router.navigate(['/'])
    });
    // content header
    this.contentHeader = {
      headerTitle: 'Account Settings',
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
            name: 'Account Settings',
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

  openLink() {
    const link = 'https://t.me/CoinPesBot?start=' + this.tg_identifier
    window.open(link, "_blank") || window.location.replace(link);

  }

  set2FA() {
    const otp = ((document.getElementById("2fa_otp") as HTMLInputElement).value);
    console.log(otp);
    let user = JSON.parse(localStorage.getItem('user'));
    this.fb.set2FAAuth(this.user.token, this.user.username, {

      "email": user.email,
      "otp": otp,

    }).subscribe((response: any) => {
      this.two_factor = true

    }, (err) => {

      this.two_factor = true

      console.log(err.error)
    })


  }

  change2FA(button: string) {
    function fireSwalError(title: string, message: string) {
      Swal.fire({
        title: title,
        html: message,
        icon: 'error',
        confirmButtonText: 'OKAY',
        customClass: {confirmButton: 'btn btn-primary'}
      })
    }

    function fireSwalSuccess(title: string, message: string) {
      Swal.fire({
        title: title,
        html: message,
        icon: 'success',
        confirmButtonText: 'OKAY',
        customClass: {confirmButton: 'btn btn-primary'}
      })
    }

    function toggle2FA(otp: string, action: string) {
      console.log("otp: "+otp+" button: "+action)
      let user = JSON.parse(localStorage.getItem('user'))
      const headerDict = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        token: user.token,
        username: user.username
      }

      const requestOptions = {
        headers: new Headers(headerDict),
      };
      return fetch('https://api.coinlif.com/api/coin/v1/cancelTrade/', requestOptions)
        .then(function (response) {
          console.log(response);
          if (!response.ok) {
            throw new Error(response.statusText);
          } else {
            fireSwalSuccess('2FA DEACTIVATED', '2FA is essential to web security because it immediately neutralizes the risks associated with compromised passwords. If a password is hacked, guessed, or even phished, that\'s no longer enough to give an intruder access: without approval at the second factor, a password alone is useless.')
          }
          //location.reload()
          return response.json();
        })
        .catch(function (error) {
          fireSwalError('Ops', 'An error occurred try again')
        });
    }

    Swal.mixin({
      input: 'text',
      confirmButtonText: 'CONFIRM',
      showCancelButton: true,
      progressSteps: ['1', '2'],
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    })
      .queue([
        {
          title: '2FA CODE',
          text: 'Get your code from Authy or Google Authenticator to authorize this action'
        },

      ])
      .then(function (result) {
        if ((<HTMLInputElement>result).value) {
          console.log((<HTMLInputElement>result).value);
          let otp = (<HTMLInputElement>result).value[0]
          console.log(otp)
          if (otp.length <= 0) {
            fireSwalError('OTP REQUIRED', 'Please input the 2FA Code. Get your code from Authy or Google Authenticator to authorize this action')
            return
          }
          if (otp.length > 6) {
            fireSwalError('OTP TOO LONG', 'Your 2FA code cannot be longer than 6 numbers. Get your code from Authy or Google Authenticator')
            return
          }
          if (otp.length > 0 && otp.length < 6) {
            fireSwalError('OTP TOO SHORT', 'Your 2FA code cannot be shorter than 6 numbers. Get your code from Authy or Google Authenticator')
            return
          }
          if (otp.length > 0 && !isNumeric(parseInt(otp))) {
            fireSwalError('OTP MUST BE A NUMBER', 'Your 2FA code must be a 6 digit number. Get your code from Authy or Google Authenticator')
            return
          }
          else {
            toggle2FA(otp, button)

          }


        }
      });


  }
}
