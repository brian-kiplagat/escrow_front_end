import {Component, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {FAQService} from 'app/main/pages/faq/faq.service';
import {knowledgeBaseService} from "../kb/knowledge-base/knowledge-base.service";

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FaqComponent implements OnInit, OnDestroy {
  // public
  public contentHeader: object;
  public data: any;
  public data2: any;
  public searchText: string;
  public shopSidebarToggle = false;
  public shopSidebarReset = false;
  public gridViewRef = true;
  public products;
  public wishlist;
  public cartList;
  public page = 1;
  public pageSize = 9;
  public selectBasic: any[] = ['Bank Transfer', 'Mpesa', 'Paypal', 'Skrill'];
  public selectBasicLoading = false;
  public offers = []
  public currency:any[] = []
  public currencies =[]
  public methods =[]
  public   amount =0
  public type:string ="buy"
  public filters ={
       currency:"",
       method:"",
    
  }

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {FAQService} _faqService
   * @param _knowledgeBaseService
   */
  constructor(private _faqService: FAQService, private _knowledgeBaseService: FAQService) {
    this._unsubscribeAll = new Subject();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Changes
   */
  ngOnInit(): void {
    this._faqService.onFaqsChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.data = response;
    });
   this.data2 = [
      {
        id: 1,
        category: 'Buy Bitcoin online',
        img: 'assets/images/illustration/sales.svg',
        title: 'Buy Bitcoin online',
        desc: 'Buy Bitcoin in real time. Trade with users online with escrow on live chat.'
      },
      {
        id: 2,
        category: 'Sell Bitcoin',
        img: 'assets/images/illustration/marketing.svg',
        title: 'Sell Bitcoin',
        desc: 'Sell your Bitcoin at your chosen rate, and get paid in one of numerous payment methods.'
      },
      {
        id: 3,
        category: 'Trusted',
        img: 'assets/images/illustration/api.svg',
        title: 'Trusted',
        desc: 'Accounts are audited regularly with our moderators, get help whenever you need it '
      },
      {
        id: 4,
        category: 'Trade with secure escrow',
        img: 'assets/images/illustration/personalization.svg',
        title: 'Trade with secure escrow',
        desc: 'Your Bitcoin is held in our secure escrow until the trade is completed successfully.'
      },
      {
        id: 5,
        category: 'Build your reputation',
        img: 'assets/images/illustration/email.svg',
        title: 'Build your reputation',
        desc: 'Our user feedback system enables you to identify trusted and experienced peers to trade with.'
      },
      {
        id: 6,
        category: 'Get a free wallet',
        img: 'assets/images/illustration/demand.svg',
        title: 'Get a free wallet',
        desc: 'Get a life-time free Bitcoin wallet maintained by a leading provider of secure Bitcoin wallets.'
      }
    ]

  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
