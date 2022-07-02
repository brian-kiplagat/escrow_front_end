import {
  Component,
  OnInit
} from '@angular/core';

import {FirebaseService} from "../../../../services/firebase.service";
import {Router} from "@angular/router";
import clipboard from "clipboardy";
import {GlobalConfig, ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-basic-card',
  templateUrl: './card-basic.component.html'
})
export class CardBasicComponent implements OnInit {
  // public
  public contentHeader: object;
  public user: any = {}
  public currentUser: any = {}
  public withdrawal_tx: any = []
  public deposit_tx: any = []
  public address;
  public balance;
  public currency;
  public fiat;
  private options: GlobalConfig;

  constructor(private fb: FirebaseService, private router: Router,private toaster: ToastrService) {
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
      this.deposit_tx = data.responseMessage?.deposit_tx
      this.withdrawal_tx = data.responseMessage?.withdrawal_tx
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

  }
}
