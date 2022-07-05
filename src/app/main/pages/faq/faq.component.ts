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
        category: 'sales-automation',
        img: 'assets/images/illustration/sales.svg',
        title: 'Sales Automation',
        desc: 'There is perhaps no better demonstration of the folly of image of our tiny world.'
      },
      {
        id: 2,
        category: 'marketing-automation',
        img: 'assets/images/illustration/marketing.svg',
        title: 'Marketing Automation',
        desc: 'Look again at that dot. That’s here. That’s home. That’s us. On it everyone you love.'
      },
      {
        id: 3,
        category: 'api-questions',
        img: 'assets/images/illustration/api.svg',
        title: 'API Questions',
        desc: 'every hero and coward, every creator and destroyer of civilization.'
      },
      {
        id: 4,
        category: 'personalization',
        img: 'assets/images/illustration/personalization.svg',
        title: 'Personalization',
        desc: 'It has been said that astronomy is a humbling and character experience.'
      },
      {
        id: 5,
        category: 'email-marketing',
        img: 'assets/images/illustration/email.svg',
        title: 'Email Marketing',
        desc: 'There is perhaps no better demonstration of the folly of human conceits.'
      },
      {
        id: 6,
        category: 'demand-generation',
        img: 'assets/images/illustration/demand.svg',
        title: 'Demand Generation',
        desc: 'Competent means we will never take anything for granted.'
      }
    ]

  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
