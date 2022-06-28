import {Component, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FlatpickrOptions} from 'ng2-flatpickr';

import {AccountSettingsService} from 'app/main/pages/account-settings/account-settings.service';
import {FirebaseService} from "../../../services/firebase.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {isNumeric} from "rxjs/internal-compatibility";
import {FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ToastrService, GlobalConfig} from 'ngx-toastr';

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
  public factor_login = false
  public factor_send = false
  public factor_release = false
  public reset_error = false;
  public reset_error_text;
  file_data: any = ''
  public file = new FormControl('')
  // public

  // private
  private _unsubscribeAll: Subject<any>;
  private ip = 'https://coinlif.com/u.php';

  /**
   * Constructor
   *
   * @param http
   * @param {AccountSettingsService} _accountSettingsService
   * @param fb
   * @param router
   */
  constructor(private toastr: ToastrService, public http: HttpClient, private _accountSettingsService: AccountSettingsService, private fb: FirebaseService, private router: Router) {
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
  async uploadImage(event: any) {

    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
        console.log(event.target.result)
      };

      reader.readAsDataURL(event.target.files[0]);

      const fileList: FileList = event.target.files;
      //check whether file is selected or not
      if (fileList.length > 0) {
        const file = fileList[0];
        //get file information such as name, size and type
        console.log('finfo', file.name, file.size, file.type);
        //max file size is 4 mb
        if ((file.size / 1048576) <= 4) {
          let user = JSON.parse(localStorage.getItem('user'))
          const headerDict = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            token: user.token,
            username: user.username
          }
          const requestOptions = {
            headers: new Headers(headerDict),
            method: 'POST',
            body: JSON.stringify({
              "base64": event.target.result
            })

          };
          await fetch('https://api.coinlif.com/api/coin/v1/uploadProfile', requestOptions).then((response) => {
            console.log(response);
            if (!response.ok) {
              this.toast('FAILED', '👋 Seems an error happened .Please try again', 'error')
              //throw new Error(response.statusText);
            } else {
              this.toast('Great', '👋 You just uploaded your profile', 'success')
              this.playAudio('assets/sounds/tirit.wav')
            }
          }).catch((error) => {
            this.toast('Ops', '👋 An error happened try again', 'error')
          })

        } else {
          this.toast('Ops', 'File size exceeds 4 MB. Please choose less than 4 MB', 'error')

        }

      }


    }
  }
  playAudio(path) {
    let audio = new Audio();
    audio.src = path;
    audio.load();
    audio.play();
  }
  private toast(title: string, message: string, type: string) {
    if (type == 'success') {
      this.toastr.success(message, title, {
        toastClass: 'toast ngx-toastr',
        timeOut: 5000,
        closeButton: true,
        positionClass: 'toast-top-right',
        progressBar: true
      });
    } else {
      this.toastr.error(message, title, {
        toastClass: 'toast ngx-toastr',
        timeOut: 5000,
        closeButton: true,
        positionClass: 'toast-top-right',
        progressBar: true
      });

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
      if (this.currentUser.choice_2fa == '2FA') {
        this.two_factor = true;
      } else {
        this.two_factor = false;
      }
      this.factor_login = this.currentUser.factor_login;
      this.factor_send = this.currentUser.factor_send;
      this.factor_release = this.currentUser.factor_release;

      //console.log(data)
    }, (error) => {
      console.log(error)
      this.router.navigate(['/dashboard/overview'])
    });
    this.contentHeader = {
      headerTitle: 'Account Settings',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [

          {
            name: 'Personalize my account',
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

    if (otp.length <= 0) {
      this.fireSwalError('OTP REQUIRED', 'Scan the QR-code with your phone by using the Authy app. A 6-digit code will appear on the app. Enter the 6-digit code into the field below the QR-code')
      return
    }
    if (otp.length > 6) {
      this.fireSwalError('OTP TOO LONG', 'Your 2FA code cannot be longer than 6 numbers. Get your code from Authy or Google Authenticator')
      return
    }
    if (otp.length > 0 && otp.length < 6) {
      this.fireSwalError('OTP TOO SHORT', 'Your 2FA code cannot be shorter than 6 numbers. Get your code from Authy or Google Authenticator')
      return
    }
    if (otp.length > 0 && !isNumeric(parseInt(otp))) {
      this.fireSwalError('OTP MUST BE A NUMBER', 'Your 2FA code must be a 6 digit number. Get your code from Authy or Google Authenticator')
      return
    } else {
      this.fb.set2FAAuth(this.user.token, this.user.username, {

        "email": user.email,
        "otp": otp,

      }).subscribe((response: any) => {
        this.two_factor = true
        this.factor_login = true
        this.factor_send = true
        this.factor_release = true
        console.log(response.responseMessage)
        this.fireSwalSuccess('DONE', 'You are now protected with 2FA.  Even if an intruder gets past your password, that\'s no longer enough to give unauthorized access: without approval of your 2FA Code')

      }, (err) => {

        this.two_factor = false
        this.fireSwalError('Ops', err.error.responseMessage)

        console.log(err.error)
      })

    }


  }

  fireSwalError(title: string, message: string) {
    Swal.fire({
      title: title,
      html: message,
      icon: 'error',
      confirmButtonText: 'OKAY',
      customClass: {confirmButton: 'btn btn-primary'}
    })
  }

  fireSwalSuccess(title: string, message: string) {
    Swal.fire({
      title: title,
      html: message,
      icon: 'success',
      confirmButtonText: 'OKAY',
      customClass: {confirmButton: 'btn btn-primary'}
    })
  }

  change2FA(button: string) {


    function toggle2FA(otp: string, action: string) {
      console.log("otp: " + otp + " button: " + action)
      let user = JSON.parse(localStorage.getItem('user'))

      function fireAlert(sign: any, title: string, msg: string) {
        Swal.fire({
          title: title,
          html: msg,
          icon: sign,
          confirmButtonText: 'OKAY',
          customClass: {confirmButton: 'btn btn-primary'}
        })
      }

      fetch('https://api.coinlif.com/api/coin/v1/toggle2FA', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          token: user.token,
          username: user.username
        },
        body: JSON.stringify({
          "type": action,
          "email": user.email,
          "otp": otp

        }),
      }).then(async response => {
        const json = await response.json(); // Get JSON value from the response
        console.log(json)
        if (response.status == 200) {
          fireAlert('success', 'DONE', 'You updated your 2FA. Never share your 2FA codes. If someone asks for it please neglect and report to support')
          //Here look for way to update ui with data
        } else {
          fireAlert('error', 'Ops', json.responseMessage.msg)
        }

        /*this.factor_login = json.responseMessage.factor_login//Update with boolean values from server
        this.factor_send = json.responseMessage.factor_send
        this.factor_release = json.responseMessage.factor_release*/

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
        function fireSwal(option: string, title: string, msg: string) {
          Swal.fire({
            title: title,
            html: msg,
            icon: 'error',
            confirmButtonText: 'OKAY',
            customClass: {confirmButton: 'btn btn-primary'}
          })
        }

        if ((<HTMLInputElement>result).value) {
          console.log((<HTMLInputElement>result).value);
          let otp = (<HTMLInputElement>result).value[0]
          console.log(otp)
          if (otp.length <= 0) {
            fireSwal('error', 'OTP REQUIRED', 'Please input the 2FA Code. Get your code from Authy or Google Authenticator to authorize this action')
            return
          }
          if (otp.length > 6) {
            fireSwal('error', 'OTP TOO LONG', 'Your 2FA code cannot be longer than 6 numbers. Get your code from Authy or Google Authenticator')
            return
          }
          if (otp.length > 0 && otp.length < 6) {
            fireSwal('error', 'OTP TOO SHORT', 'Your 2FA code cannot be shorter than 6 numbers. Get your code from Authy or Google Authenticator')
            return
          }
          if (otp.length > 0 && !isNumeric(parseInt(otp))) {
            fireSwal('error', 'OTP MUST BE A NUMBER', 'Your 2FA code must be a 6 digit number. Get your code from Authy or Google Authenticator')
            return
          } else {
            toggle2FA(otp, button)

          }


        }
      });


  }

  changePassword() {
    const old_password = ((document.getElementById("account-old-password") as HTMLInputElement).value);
    const new_password = ((document.getElementById("account-new-password") as HTMLInputElement).value);
    const new_password_confirm = ((document.getElementById("account-retype-new-password") as HTMLInputElement).value);
    if (old_password.length <= 0 || new_password.length <= 0 || new_password_confirm.length <= 0) {
      this.reset_error_text = 'Please fill in all fields'
      this.reset_error = true
      return
    }
    this.reset_error = false
    console.log(old_password + " : " + new_password + " : " + new_password_confirm);
    let user = JSON.parse(localStorage.getItem('user'));
    this.fb.setChangePaswordInApp(this.user.token, this.user.username, {

      "email": user.email,
      "old_password": old_password,
      "new_password": new_password,


    }).subscribe((response: any) => {
      this.fireSwalSuccess('SUCCESS', 'You changed your password. We are logging you out of all active session shortly and you will be required to log in again')
      setTimeout(() => {
        console.log('sleeping for 2.5 seconds');
        // And any other code that should run only after 5s

      }, 2500);
    }, (err) => {

      this.fireSwalError('Ops', err.error.responseMessage)
      console.log(err.error)
    })
  }
}
