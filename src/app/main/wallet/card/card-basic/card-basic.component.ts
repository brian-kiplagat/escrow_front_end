import {
  Component,
  OnInit
} from '@angular/core';

import {FirebaseService} from "../../../../services/firebase.service";
import {ActivatedRoute, Router} from "@angular/router";
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
  public currency_mode: any;

  constructor(private route: ActivatedRoute, private fb: FirebaseService, private router: Router, private toaster: ToastrService) {
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
      this.currency_mode = data.responseMessage?.user_data[0].currency;

    }, (error) => {
      console.log(error)
      this.router.navigate(['/'])
    });


  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      let wallet = params.wallet
      let username = params.username
      if (params.wallet && params.username) {
        console.log(params)
        const inputElement = document.getElementById('address') as HTMLInputElement;
        inputElement.value = wallet;
        this.toaster.success('👋 Bitcoin will be sent internally. The transaction is free and available immediately', 'Sending to ' + username, {
          toastClass: 'toast ngx-toastr',
          timeOut: 8000,
          closeButton: true
        });
      }


    })
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

  copy_link(link) {
    clipboard.write(link);
    // Success
    this.toaster.success('👋 You just copied your Transaction hash. Use a blockchain explorer to search your transaction. Some popular Blockchain explorers include Blockchain.com for Bitcoin, Etherscan.io for Ethereum, and Blockchair.com for multiple Blockchain networks', 'Great!', {
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
      "currency_mode": this.currency_mode,
      "otp": otp

    }).subscribe((response: any) => {
      this.toast('Done', '👋 Cryptocurrency was sent from your account. Check your email for details', 'success')
      this.success = true;
      this.error = false;
      this.loading = false
      this.message = 'You sent ' + amount + ' ' + this.currency_mode + ' to ' + address
      this.fb.playAudio('assets/sounds/tirit.wav')
    }, (err) => {
      this.error = true;
      this.success = false;
      this.loading = false
      this.message = err.error.responseMessage
      console.log(err)
      this.fb.playAudio('assets/sounds/windows_warning.wav')
      this.toast('Hmm', '👋 ' + err.error.responseMessage, 'error')


    })
    //console.log(address + " " + amount + " " + otp)


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

  change_currency(currency) {
    this.currency_mode = currency
    document.querySelector('#label_amount').innerHTML = 'Amount (' + currency + ')';
    document.querySelector('#button_change').innerHTML = currency;

    //console.log(this.currency_mode)
  }
}
