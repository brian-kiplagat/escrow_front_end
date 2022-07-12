import {Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {FAQService} from 'app/main/pages/faq/faq.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexStroke,
  ApexDataLabels,
  ApexXAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexPlotOptions,
  ApexYAxis,
  ApexFill,
  ApexMarkers,
  ApexTheme,
  ApexNonAxisChartSeries,
  ApexLegend,
  ApexResponsive,
  ApexStates
} from 'ng-apexcharts';

import {colors} from 'app/colors.const';
import {CoreConfigService} from '@core/services/config.service';
import firebase from "firebase/compat";
import {FirebaseService} from "../../../services/firebase.service";

// interface ChartOptions
export interface ChartOptions {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  dataLabels?: ApexDataLabels;
  grid?: ApexGrid;
  stroke?: ApexStroke;
  legend?: ApexLegend;
  title?: ApexTitleSubtitle;
  colors?: string[];
  tooltip?: ApexTooltip;
  plotOptions?: ApexPlotOptions;
  yaxis?: ApexYAxis;
  fill?: ApexFill;
  labels?: string[];
  markers: ApexMarkers;
  theme: ApexTheme;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FaqComponent implements OnInit, OnDestroy {
  @ViewChild('apexCandlestickChartRef') apexCandlestickChartRef: any;
  // public
  public contentHeader: object;
  public data: any;
  public data2: any;
  public searchText: string;
  public apexCandlestickChart: Partial<ChartOptions>;
  // private
  private _unsubscribeAll: Subject<any>;
  public isMenuToggled = false;
  public data_array = []
  public api_response: any;

  /**
   * Constructor
   *
   * @param fb
   * @param {FAQService} _faqService
   * @param _knowledgeBaseService
   * @param _coreConfigService
   */
  constructor(private fb: FirebaseService, private _faqService: FAQService, private _knowledgeBaseService: FAQService, private _coreConfigService: CoreConfigService) {
    this._unsubscribeAll = new Subject();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Changes
   */
  getGraphData(granularity) {
    //document.getElementById('btn-change').innerHTML = 'OK DONE';

    this.fb.getGraph({
      "search": granularity,

    }).subscribe((response: any) => {
      this.api_response = response.responseMessage;
      console.log(response)
      for (const val of this.api_response.candles) {
        let arr = {
          x: new Date(val[0] * 1000),
          y: [val[3], val[2], val[1], val[4]]//open,high,low,close
        }
        this.data_array.push(arr)
      }


    }, (err) => {
      console.log(err.error)
    })

  }

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
    this.getGraphData('PAST_DAY')
// Apex Candlestick Chart
    this.apexCandlestickChart = {
      series: [
        {
          data: this.data_array
        }
      ],
      chart: {
        height: 400,
        type: 'candlestick',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: colors.solid.success,
            downward: colors.solid.danger
          }
        },
        bar: {
          columnWidth: '40%'
        }
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        }
      },

      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    };

  }
ngch

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /**
   * After View Init
   */
  ngAfterViewInit() {
    // Subscribe to core config changes
    this._coreConfigService.getConfig().subscribe(config => {
      // If Menu Collapsed Changes
      if (config.layout.menu.collapsed === true || config.layout.menu.collapsed === false) {
        setTimeout(() => {
          // Get Dynamic Width for Charts
          this.isMenuToggled = true;
          this.apexCandlestickChart.chart.width = this.apexCandlestickChartRef?.nativeElement.offsetWidth;

        }, 900);
      }
    });
  }

}
