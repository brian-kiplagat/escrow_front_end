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
      
console.log(this.offerData)
    }, (error) => {
      console.log(error)
      this.router.navigate(['/pages/login'])
    });

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
  checkType(trade) {
    console.log(trade)
    if (trade.trade.buyer == this.user.email) {//Logged in user is buyer
      console.log('//Logged in user is buyer')
      return ['buy', trade.seller.username,trade.seller.profile_link];


    } else if (trade.trade.seller == this.user.email) {//Logged in user is seller
      console.log('//Logged in user is seller')
      return ['sell', trade.buyer.username,trade.buyer.profile_link];

    }
  }

  getEmail() {
    return localStorage.getItem('user')
  }
  toggleOffer(id:string){
    console.log(id)
    this.fb.toggleSingleOffer( this.user.token,this.user.username,id).subscribe((data)=>{
      console.log('data here',data)
    
  },
  (error)=>{
    console.log("this is error",error)
  })
  
  }
  toggleAll(){
    this.fb.toggleAll( this.user.token,this.user.username).subscribe((data)=>{
      console.log(data)
    })}
    delete_offer(id: any) {
      this.playAudio('assets/sounds/windows_warning.wav')
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
            this.fb.deleteOffer(this.user.token,this.user.username,id).subscribe((data:any)=>{
              console.log("this is the data",data)
                            if (!data.ok) {
  
                this.toast('Failed', '👋 an error happened .Please try again', 'error')
                return
                //throw new Error(response.statusText);
              } else {
                this.toast('Cancelled', '👋 You just cancelled this trade. If you wish to trade again you must open a trade, so that we reserve an escrow for safe payments', 'success')
                this.playAudio('assets/sounds/turumturum.wav')
              }
            },(error:any)=>{
              console.log("this is the error",error)
              this.toast('Ops', '👋 An error happened try again', 'error')
            })
          }
        });
      } else {
        this.toast('INVALID', 'You cant do that', 'error')
      }
  
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
