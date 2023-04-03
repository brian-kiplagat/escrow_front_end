import {
  Component,
  OnInit
} from '@angular/core';

import {FirebaseService} from "../../../../services/firebase.service";
import {Router} from "@angular/router";
import clipboard from "clipboardy";
import {GlobalConfig, ToastrService} from "ngx-toastr";
import {v4 as uuidv4} from 'uuid';


@Component({
  selector: 'app-basic-card',
  templateUrl: './card-basic.component.html'
})
export class CardBasicComponent implements OnInit {
  // public
  public contentHeader: object;
  public user: any = {}
  public currentUser: any = {}
  public transactions: any = []
  public address;
  public balance;
  public currency;
  public fiat;
  private options: GlobalConfig;
  public success: boolean;
  public message: any;
  public error: boolean;
  public loading: boolean;
  public internal_tx: any;

  constructor(private fb: FirebaseService, private router: Router, private toaster: ToastrService) {
    this.options = this.toaster.toastrConfig;
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this.contentHeader = {
      headerTitle: 'My wallet',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Send and Receive BTC',
            isLink: true,
            link: '/'
          }
        ]
      }
    };
    this.user = JSON.parse(localStorage.getItem('user'))
    this.fb.getUser(this.user.username, this.user.token).subscribe((data: any) => {
      this.currentUser = data.responseMessage?.user_data[0]
      this.transactions = data.responseMessage?.transactions
      this.internal_tx = data.responseMessage?.internal
      this.fiat = data.responseMessage?.fiat
      this.balance = data.responseMessage?.user_data[0].balance
      this.address = data.responseMessage?.user_data[0].wallet
      this.currency = data.responseMessage?.user_data[0].currency

    }, (error) => {
      console.log(error)
      this.router.navigate(['/'])
    });


  }

  copy_address() {
    clipboard.write(this.address);
    // Success
    this.toaster.success('👋 You just copied your address. Send BTC to this address to add funds to your account', 'Great!', {
      toastClass: 'toast ngx-toastr',
      timeOut: 5000,
      closeButton: true
    });
  }

  sendBTC() {
    let address = (<HTMLInputElement>document.getElementById("address")).value;
    let amount = (<HTMLInputElement>document.getElementById("amount")).value;
    let otp

    if (this.currentUser.choice_2fa == '2FA' && this.currentUser.factor_send == true) {
      otp = (<HTMLInputElement>document.getElementById("otp")).value;
    }
    this.loading = true
    this.fb.sendCrypto(this.user.token, this.user.username, {
      "amount": amount,
      "wallet": address,
      "requestId": uuidv4() + Math.round(new Date().getTime() / 1000).toString(),
      "otp": otp

    }).subscribe((response: any) => {
      this.toast('Done', '👋 Cryptocurrency was sent from your account. Check your email for details', 'success')
      this.success = true;
      this.error = false;
      this.loading = false
      this.message = response.responseMessage
      this.playAudio('assets/sounds/tirit.wav')
    }, (err) => {
      this.error = true;
      this.success = false;
      this.loading = false
      this.message = err.error.responseMessage
      console.log(err)
      this.playAudio('assets/sounds/windows_warning.wav')
      this.toast('Hmm', '👋 ' + err.error.responseMessage, 'error')


    })
    console.log(address + " " + amount + " " + otp)


  }

  playAudio(path) {
    let audio = new Audio();
    audio.src = path;
    audio.load();
    audio.play();
  }

  private toast(title: string, message: string, type: string) {
    if (type == 'success') {
      this.toaster.success(message, title, {
        toastClass: 'toast ngx-toastr',
        timeOut: 5000,
        closeButton: true,
        positionClass: 'toast-top-right',
        progressBar: true
      });
    } else {
      this.toaster.error(message, title, {
        toastClass: 'toast ngx-toastr',
        timeOut: 5000,
        closeButton: true,
        positionClass: 'toast-top-right',
        progressBar: true
      });

    }

  }

  send2FAMail() {
    this.fb.sendCodeToMail(this.user.token, this.user.username, {
      email: this.user.email
    }).subscribe((response: any) => {
      this.success = true;
      this.loading = false
      this.message = 'Check your email now. Then enter the code below to authorize this transfer'
      this.toast('Success', '👋 Please check your email for the 2FA Code to authorize this transfer', 'success')

    }, (err) => {
      this.error = true;
      this.loading = false
      this.message = err.error.responseMessage
      this.toast('Ops', err.error.responseMessage, 'error')

    })
  }
}
