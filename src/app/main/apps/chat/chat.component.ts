import { Component, ViewEncapsulation, OnInit,OnDestroy ,Inject, ElementRef, Renderer2,AfterViewInit} from '@angular/core';
import { FirebaseService } from 'app/services/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService } from './chat.service';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreConfigService } from '@core/services/config.service';
import { CoreLoadingScreenService } from '@core/services/loading-screen.service';
import { CoreTranslationService } from '@core/services/translation.service';

import { menu } from 'app/menu/menu';
import { locale as menuEnglish } from 'app/menu/i18n/en';
import { locale as menuFrench } from 'app/menu/i18n/fr';
import { locale as menuGerman } from 'app/menu/i18n/de';
import { locale as menuPortuguese } from 'app/menu/i18n/pt';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'chat-application' }
})
export class ChatComponent implements OnInit ,OnDestroy,AfterViewInit{
    public user: any = {};
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
   * @param {DOCUMENT} document
   * @param {Title} _title
   * @param {Renderer2} _renderer
   * @param {ElementRef} _elementRef
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreSidebarService} _coreSidebarService
   * @param {CoreLoadingScreenService} _coreLoadingScreenService
   * @param {CoreMenuService} _coreMenuService
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
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        public _coreConfigService: CoreConfigService,
        private _coreSidebarService: CoreSidebarService,
        private _coreLoadingScreenService: CoreLoadingScreenService,
        private _coreMenuService: CoreMenuService,
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
        this._unsubscribeAll = new Subject();}
  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {

// Unsubscribe from all subscriptions
this._unsubscribeAll.next();
this._unsubscribeAll.complete();
  }

    ngOnInit(): void {
        this.user = JSON.parse(localStorage.getItem('user'));
        let config = JSON.parse(localStorage.getItem('config'));
        // let appConfig = {
        //     app: {
        //         appLanguage: 'en',
        //         appLogoImage: 'assets/images/logo/logo.svg',
        //         appName: 'CoinPes',
        //         appTitle: 'CoinPes'
        //     },
        //     layout: {
        //         animation: 'fadeIn',
        //         buyNow: false,
        //         customizer: true,
        //         enableLocalStorage: true,
        //         menu: {
        //             hidden: false,
        //             collapsed: false
        //         },
        //         navbar: {
        //             background: 'navbar-light',
        //             backgroundColor: '',
        //             customBackgroundColor: true,
        //             hidden: false,
        //             type: 'floating-nav'
        //         },
        //         footer: {
        //             background: 'footer-light',
        //             backgroundColor: '',
        //             customBackgroundColor: false,
        //             hidden: false,
        //             type: 'footer-static'
        //         },
        //         scrollTop: true,
        //         skin: 'default',
        //         type: 'vertical'
        //     }
        // };
        // localStorage.setItem('config', JSON.stringify(appConfig));
        console.log(config);
            // Subscribe to config change
        const routeParams = this.route.snapshot.paramMap;
        this.fb.getTradeByID(this.user.username, this.user.token, routeParams.get('id')).subscribe(
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
                console.log(error);
                this.router.navigate(['dashboard/overview']);
            }
        );
    }
}
