import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';

import {FirebaseService} from '../../../../services/firebase.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-ecommerce-wishlist',
  templateUrl: './market-sell.component.html',
  styleUrls: ['./market-sell.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {class: 'ecommerce-application'}
})
export class MarketSellComponent implements OnInit {
  // Public

  public contentHeader: object;
  public shopSidebarToggle = false;
  public shopSidebarReset = false;
  public gridViewRef = true;
  public products;
  public wishlist;
  public cartList;
  public page = 1;
  public pageSize = 9;
  public searchText = '';
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
  public query = 'none'
  public query_method = 'none';
  public search_msg: string;

  /**
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param {FirebaseService}_fb
   * @param modalService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _fb: FirebaseService, private modalService: NgbModal
  ) {
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Update to List View
   */
  listView() {
    this.gridViewRef = false;
  }

  /**
   * Update to Grid View
   */
  gridView() {
    this.gridViewRef = true;
  }

  /**
   * Sort Product
   */

  /**
   * On init
   */
  ngOnInit(): void {
    this._fb
      .getOffers("buy").subscribe((data: any) => {
      // this.offers = data['data']['payload']
      this.offers = data.responseMessage
      //console.log(data)
    })

    this._fb.getCurrency().subscribe((data: any) => {
      this.currencies = data.responseMessage.currencies
      this.methods = data.responseMessage.methods
      //console.log( this.methods)
    }, (error) => {
      console.log(error)
    })


  }

  onNotify(value: number) {
    let user = JSON.parse(localStorage.getItem('user'))


  }

  onSliderChange(value: any) {
    let user = JSON.parse(localStorage.getItem('user'))

  }

  //filter by tag
  onTagChange(value: string) {
    this.offers = this.offers.filter((offer: any) => offer.tags == value)
  }

  getArray(offer_tags: any) {
    let formatted_tags = offer_tags.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, "")
    const arr = formatted_tags.slice(1, -1)
    return arr.split(',');

  }


// ng-select in model
  modalSelectOpen(modalSelect) {
    this.modalService.open(modalSelect, {
      windowClass: 'modal'
    });
  }

  changeFn(val: string) {
    if (val == null) {
      //document.querySelector('#btn-text').innerHTML = 'USD';
      this.query = 'none'
    } else {
      this.query = val
      document.querySelector('#btn-text').innerHTML = val;
      this.modalService.dismissAll();

    }
    //console.log("Dropdown selection:", val);


  }

  changeMethod(val) {
    if (val == null) {
      this.query_method = 'none'
    } else {
      this.query_method = val


    }
  }

  //filter offers by searching against API
  filterOffers() {
    let user = JSON.parse(localStorage.getItem('user'))
    let amount = (<HTMLInputElement>document.getElementById("search_amount")).value;
    if (amount == null || amount == '') {
      amount = 'none'
    }
    this._fb.filterOffers(user.token, user.username, {
      "type": "buy",
      "method": this.query_method,
      "amount": amount,
      "currency": this.query

    }).subscribe((data: any) => {
      //console.log(data.responseMessage)
      this.offers = data.responseMessage.offers
      this.search_msg = data.responseMessage.message


    })

  }

}
