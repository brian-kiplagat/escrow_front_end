import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {CoreConfigService} from '@core/services/config.service';
import {CoreTranslationService} from '@core/services/translation.service';
import {Router} from '@angular/router';


import {locale as english} from 'app/main/dashboard/i18n/en';
import {locale as french} from 'app/main/dashboard/i18n/fr';
import {locale as german} from 'app/main/dashboard/i18n/de';
import {locale as portuguese} from 'app/main/dashboard/i18n/pt';
import {FirebaseService} from 'app/services/firebase.service';
import clipboard from 'clipboardy';
import Swal from "sweetalert2";
import {ToastrService, GlobalConfig} from 'ngx-toastr';
import {v4 as uuidv4} from 'uuid';
import {off} from "@angular/fire/database";

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
  public flag_checked = false

  /**
   * Constructor
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreTranslationService} _coreTranslationService
   * @param fb
   * @param router
   * @param toastr
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
      //If one or more offers is on, we set flag_checked == true
      for (let entry of this.offerData) {
        //console.log(entry);
        if (entry.status === 1) {
          //One offer is one, so just set it to true
          this.flag_checked = true
          break
        }
      }
    }, (error) => {
      //console.log(error)
      this.router.navigate(['/pages/login'])
    });


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

  checkType(trade) {
    //console.log(trade)
    if (trade.trade.buyer == this.user.email) {//Logged in user is buyer
      //console.log('//Logged in user is buyer')
      return ['buy', trade.seller.username, trade.seller.profile_link];


    } else if (trade.trade.seller == this.user.email) {//Logged in user is seller
      //console.log('//Logged in user is seller')
      return ['sell', trade.buyer.username, trade.buyer.profile_link];

    }
  }

  getEmail() {
    return localStorage.getItem('user')
  }

  toggleOffer(id: string, index: string) {
    if (this.offerData[index].status === 0) {//Is off so make it on
      this.okToggleThisShit('on', id)
    } else if (this.offerData[index].status === 1) {//Is on so make it off
      this.okToggleThisShit('off', id)
    }


  }

  okToggleThisShit(state: any, id: any) {
    this.fb.toggleSingleOffer(this.user.token, this.user.username, id, state).subscribe((data: any) => {
        this.offerData = data.responseMessage.offers
        if (data.responseMessage.toggle === 'on') {
          this.toast('Success', 'Offer was turned on', 'success')
          this.flag_checked = true
        } else if (data.responseMessage.toggle === 'off') {
          //If one or more offers is on, we set flag_checked == true
          this.flag_checked = false
          for (let entry of this.offerData) {
            if (entry.status === 1) {
              //One offer is one, so just set it to true
              this.flag_checked = true
              break
            }
          }
          this.toast('Success', 'Offer was turned off', 'success')

        }
      },
      (error) => {
        this.toast('Ops', error.error.responseMessage, 'error')
      })

  }

  toggleAll() {
    if (this.flag_checked == true) {
      this.justToggleNowAll('off')
    } else if (this.flag_checked == false) {
      this.justToggleNowAll('on')
    }
  }

  justToggleNowAll(state: any) {
    this.fb.toggleAll(this.user.token, this.user.username, state).subscribe((data: any) => {
        this.offerData = data.responseMessage.offers
        if (data.responseMessage.toggle === 'on') {
          this.toast('Success', 'All your offers were switched on', 'success')
          this.flag_checked = true
        } else if (data.responseMessage.toggle === 'off') {
          //If one or more offers is on, we set flag_checked == true
          this.flag_checked = false
          this.toast('Success', 'All your offers were switched off. They cannot be seen on the market place', 'success')

        }
      },
      (error) => {
        this.toast('Ops', error.error.responseMessage, 'error')
      })

  }

  delete_offer(id: any) {
    this.fb.playAudio('assets/sounds/bmw.mp3')
    if (this.user) {
      Swal.fire({
        title: ' <h5>Hey Wait!</h5>',
        html: '<p class="card-text font-small-3">This offer will be deleted permanently</p>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2746e4',
        cancelButtonColor: '#E42728',
        cancelButtonText: 'Go back',
        confirmButtonText:
          '<i class="fa fa-ban"></i> DELETE OFFER',
        confirmButtonAriaLabel: 'CANCEL',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1'
        }
      }).then(async (result) => {
        if (result.value) {
          this.fb.deleteOffer(this.user.token, this.user.username, id).subscribe((data: any) => {
            //console.log("this is the data", data)
            this.toast('Deleted', '👋 You just removed this offer from the marketplace', 'success')
            this.offerData = data.responseMessage
          }, (error: any) => {
            //console.log("this is the error", error)
            this.toast('Ops', error.error.responseMessage, 'error')
            this.fb.playAudio('assets/sounds/windows_warning.wav')
          })
        }
      });
    } else {
      this.toast('INVALID', 'You cant do that', 'error')
    }

  }

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


  updateValue(event: any, type: string, idd: string) {
    if (type == 'rate') {
      //console.log(event)
      this.fb.quickEdit(this.user.token, this.user.username, {
        "offeridd": idd,
        "requestId": uuidv4() + Math.round(new Date().getTime() / 1000).toString(),
        "type": type,
        "value": event

      }).subscribe((data: any) => {
        let msg = data.responseMessage
        this.toast('Success', msg, 'success')
        //console.log(this.offerData)
      }, (error) => {
        this.toast('Check', error.error.responseMessage, 'error')
        //console.log(error.error.responseMessage)

      });
    } else {
      let value = event.target.value
      //console.log(value)
      this.fb.quickEdit(this.user.token, this.user.username, {
        "offeridd": idd,
        "requestId": uuidv4() + Math.round(new Date().getTime() / 1000).toString(),
        "type": type,
        "value": value

      }).subscribe((data: any) => {
        let msg = data.responseMessage
        this.toast('Success', msg, 'success')
        //console.log(this.offerData)
      }, (error) => {
        this.toast('Check', error.error.responseMessage, 'error')
        //console.log(error.error.responseMessage)

      });
    }


  }


  getBlocked(offer) {
    if (offer.idd == 123){
      console.log(offer)
    }
    let options = '';
    if (offer.vpn == 1) {
      options += ' | VPNs and Tor is not allowed'
    }
    if (offer.id_verification == 1) {
      options += ' | All users must be ID Verified'
    }
    if (offer.full_name == 1) {
      options  +=' | All users must display their full name'
    }
    if (offer.min_trades != 0) {
      options += ' | All users must have ' + offer.min_trades + ' minimum trades'
    }

    if (offer.limit_countries == 'none') {
      let clause = 'No countries blocked or allowed'
      if (options !== null) {
        return clause + options
      } else {
        return clause

      }
    } else if (offer.limit_countries == 'allowed') {
      let clause = 'These countries are allowed - ' + offer.blocked_countries.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, "").slice(1, -1)
      if (options !== null) {
        return clause + options
      } else {
        return clause

      }
    } else if (offer.limit_countries == 'blocked') {
      let clause = 'These countries are blocked - ' + offer.blocked_countries.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, "").slice(1, -1)
      if (options !== null) {
        return clause + options
      } else {
        return clause

      }
    }

  }
}
