import {Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild,SimpleChanges} from '@angular/core';

import {Subject} from 'rxjs';

import {
  ChartComponent,
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
  ApexLegend
} from 'ng-apexcharts';

import {colors} from 'app/colors.const';
import {CoreConfigService} from '@core/services/config.service';
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
  @ViewChild('apexCandlestickChartRef',{ static: false }) apexCandlestickChartRef: any;
  // public
  public contentHeader: object;

  public data2: any;
  public searchText: string;
  public shopSidebarToggle = false;
  public shopSidebarReset = false;
  public gridViewRef = true;
  public page = 1;
  public pageSize = 9;
  public selectBasic: any[] = ['Bank Transfer', 'Mpesa', 'Paypal', 'Skrill'];
  public selectBasicLoading = false;
  public offers = []
  public currency: any[] = []
  public currencies = []
  public methods = []
  public amount = 0
  public type: string = "buy"
  public filters = {
    currency: "",
    method: "",

  }
  public isMenuToggled = false;
  public data_array = []
  public api_response: any;
  public apexCandlestickChart: Partial<ChartOptions>;
  // private
  private _unsubscribeAll: Subject<any>;


  /**
   * Constructor
   *
   * @param fb
   * @param _coreConfigService
   */
  constructor(private fb: FirebaseService,private _coreConfigService: CoreConfigService) {
    this._unsubscribeAll = new Subject();

  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Changes
   */
  getGraphData(granularity:any) {
    //document.getElementById('btn-change').innerHTML = 'OK DONE';

    this.fb.getGraph({
      "search": granularity,

    }).subscribe((response: any) => {
      this.api_response = response.responseMessage;
      let newArray =[]
      for (const val of this.api_response.candles) {
        let arr = {
          x:  val[0] * 1000,
          y: [val[3], val[2], val[1], val[4]]//open,high,low,close

        }
        newArray.push(arr)
      }
      this.data_array =newArray
      this.apexCandlestickChart.series=[
        {data:this.data_array}
      ]
    }, (err) => {
      console.log(err.error)
    })

  }
 updateSeries(val:any){
       // Apex Candlestick Chart
    this.apexCandlestickChart = {
      series: [
        {
          data: val
        }
      ],
    };
 }
  ngOnInit(): void {

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
          enabled: false
        },
        labels: {
          formatter: (val, opts) => this.intToString(val)
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

  intToString(value) {
    const suffixes = ["", "k", "m", "b", "t"];
    const suffixNum = Math.floor(("" + value).length / 3);
    let shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(2));
    if (shortValue % 1 != 0) {
      //shortValue = shortValue.toFixed(1);
    }
    return shortValue + suffixes[suffixNum];
  }

  private dateFormatNow(val: any) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(timezone); // Asia/Karachi

    const date = new Date(val * 1000);

    return new Date(date).toLocaleString("en-US", {
      localeMatcher: "best fit",
      timeZoneName: "short"
    }); // "Wed Jun 29 2011 09:52:48 GMT-0700 (PDT)"
  }
}
