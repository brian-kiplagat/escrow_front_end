import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {CoreConfigService} from '@core/services/config.service';
import {CoreTranslationService} from '@core/services/translation.service';
import {colors} from 'app/colors.const';
import {Router} from '@angular/router';


import {locale as english} from 'app/main/dashboard/i18n/en';
import {locale as french} from 'app/main/dashboard/i18n/fr';
import {locale as german} from 'app/main/dashboard/i18n/de';
import {locale as portuguese} from 'app/main/dashboard/i18n/pt';
import {FirebaseService} from 'app/services/firebase.service';
import clipboard from 'clipboardy';
import { ToastrService, GlobalConfig } from 'ngx-toastr';


@Component({

  selector: 'app-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class EcommerceComponent implements OnInit {

  public user: any = {};
  private options: GlobalConfig;
  public balance = 0
  public wallet = ''
  public joined = ''
  public currentUser: any = {}
  public tradeData: any = []
  public offerData: any = []
  public fiat: any = 0

  /**
   * Constructor
   * @param {AuthenticationService} _authenticationService
   * @param {DashboardService} _dashboardService
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreTranslationService} _coreTranslationService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _coreTranslationService: CoreTranslationService,
    public fb: FirebaseService,
    private router: Router,
    private toastr: ToastrService
  ) {

    this._coreTranslationService.translate(english, french, german, portuguese);
    this.options = this.toastr.toastrConfig;
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // get the currentUser details from localStorage
    this.user = JSON.parse(localStorage.getItem('user'));

    this.fb.getUser(this.user.username, this.user.token).subscribe((data: any) => {
      this.currentUser = data.responseMessage?.user_data[0];
      this.tradeData = data.responseMessage?.trade_data;
      this.offerData = data.responseMessage?.offer_data
      this.fiat = data.responseMessage?.fiat


      console.log(this.tradeData)
    }, (error) => {
      console.log(error)
      this.router.navigate(['/'])
    });


  }

  checkType(trade) {
    console.log(trade)
    if (trade.buyer == this.user.email) {//Logged in user is buyer
      console.log('logged in user is the buyer')
      return 'buy'
    } else if (trade.seller == this.user.email) {//Logged in user is seller
      console.log('logged in user is the seller')
      return 'sell'

    }
  }

  getEmail() {
    return localStorage.getItem('user')
  }

  /**
   * After View Init
   */
  ngAfterViewInit() {
    // Subscribe to core config changes

    this._coreConfigService.getConfig().subscribe(config => {
      // If Menu Collapsed Changes
      if (
        (config.layout.menu.collapsed === true || config.layout.menu.collapsed === false)

      ) {
        setTimeout(() => {

        }, 500);
      }
    });
  }

  copy(text: any) {
    clipboard.write('https://coinpes.com/offers/bitcoin/details/' + text);
    // Success
    this.toastr.success('👋 You just copied your offer link. Share this link to get clients to open trades which are secured by escrow and guided by moderators 24-7', 'Great!', {
      toastClass: 'toast ngx-toastr',
      timeOut: 5000,
      closeButton: true
    });
  }


}
