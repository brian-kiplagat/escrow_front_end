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

              let user = JSON.parse(localStorage.getItem('user'));
              this.fb.retrieveMessage(this.trade.id).subscribe((data: any) => {
                //console.log(data)
                let lastElement = data[data.length - 1]
                //console.log(lastElement)
                if (lastElement.senderId != user.username && lastElement.message == 'XYgvC1fsxZqGvC1fsxZqGPKvC1fsxZqGbGQvC1fsxZq') {
                  //console.log('I got the key')
                  this.okUpdateSideBar(this.trade.id)
                }
              });




            },
            (error) => {
                console.log(error);
                this.router.navigate(['dashboard/overview']);
            }
        );


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
