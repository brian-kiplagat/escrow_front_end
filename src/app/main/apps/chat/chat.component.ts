import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FirebaseService} from 'app/services/firebase.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ChatService} from './chat.service';
import {Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {CoreConfigService} from '@core/services/config.service';
import {CoreTranslationService} from '@core/services/translation.service';

import {menu} from 'app/menu/menu';
import {locale as menuEnglish} from 'app/menu/i18n/en';
import {locale as menuFrench} from 'app/menu/i18n/fr';
import {locale as menuGerman} from 'app/menu/i18n/de';
import {locale as menuPortuguese} from 'app/menu/i18n/pt';
import Swal from "sweetalert2";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {class: 'chat-application'}
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  public user: any = {};
  public trade_id:any
  public currentUser: any = {};
  public tradeData: any = {};
  public trade: any = {};

  public partner_data: any = {};
  coreConfig: any;
  menu: any;
  defaultLanguage: 'en'; // This language will be used as a fallback when a translation isn't found in the current language
  appLanguage: 'en'; // Set application default language i.e fr
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param fb
   * @param route
   * @param router
   * @param chat_service
   * @param {DOCUMENT} document
   * @param {Title} _title
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreTranslationService} _coreTranslationService
   * @param {TranslateService} _translateService
   */

  constructor(
    private fb: FirebaseService,
    private route: ActivatedRoute,
    private router: Router,
    private chat_service: ChatService,
    @Inject(DOCUMENT) private document: any,
    private _title: Title,
    public _coreConfigService: CoreConfigService,
    private _coreTranslationService: CoreTranslationService,
    private _translateService: TranslateService
  ) {
    // Get the application main menu
    this.menu = menu;

    // Add languages to the translation service
    this._translateService.addLangs(['en', 'fr', 'de', 'pt']);

    // This language will be used as a fallback when a translation isn't found in the current language
    this._translateService.setDefaultLang('en');

    // Set the translations for the menu
    this._coreTranslationService.translate(menuEnglish, menuFrench, menuGerman, menuPortuguese);

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {

// Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      // Access and use the route parameters here
      this.trade_id = params['id'];
      this.user = JSON.parse(localStorage.getItem('user'));
      if (localStorage.getItem('user') == null) {
        this.router.navigate(['/pages/login']);
      }
      this.fb.getTradeByID(this.user.username, this.user.token, this.trade_id).subscribe(
        (data: any) => {
          this.trade = data.responseMessage.trade;
          if (this.user.email == this.trade.buyer) {
            //Logged in user is buyer
            this.partner_data = data.responseMessage.seller; //Assign to seller details so that seller details will be show in chat-content.html
          } else if (this.user.email == this.trade.seller) {
            //Logged in user is seller
            this.partner_data = data.responseMessage.buyer; //Assign to buyer details so that buyer details will be show in chat-content.html
          }


        },
        (error) => {
          // console.log(error);
          Swal.fire({
            title: ' <h5>Ops</h5>',
            html: '<p class="card-text font-small-3">' + error.error.responseMessage + '</p>',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#2746e4',
            confirmButtonText:
              'OK THANKS',
            customClass: {
              confirmButton: 'btn btn-primary'
            }
          }).then(result => {
            console.log(result)
            if (result.isConfirmed == true) {
              this.router.navigate(['dashboard/overview']);
            }
            if (result.isDismissed == true) {
              this.router.navigate(['dashboard/overview']);
            }
          })
          //
        }
      );
    });



  }

  okUpdateSideBar(id: any) {
    console.log('Refreshing Data')
    let user = JSON.parse(localStorage.getItem('user'));
    this.fb.getTradeByID(user.username, user.token, id).subscribe(
      (data: any) => {
        this.trade = data.responseMessage.trade;

      }, (err) => {
        console.log(err)

      })
  }
}
