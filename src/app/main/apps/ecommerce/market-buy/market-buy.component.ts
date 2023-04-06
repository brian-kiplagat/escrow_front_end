import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';

import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {FirebaseService} from '../../../../services/firebase.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-ecommerce-shop',
  templateUrl: './market-buy.component.html',
  styleUrls: ['./market-buy.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {class: 'ecommerce-application'}
})
export class MarketBuyComponent implements OnInit {
  // public
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
  public selectBasicLoading = false;
  public offers = []
  public currency: any[] = []
  public currencies = []
  public type: string = "sell"
  public methods = []
  public amount = 0
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


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._fb.getOffers(this.type).subscribe((data: any) => {
      this.offers = data.responseMessage
      console.log(this.offers)
    })
    this._fb.getCurrency().subscribe((data: any) => {
      this.currencies = data.responseMessage.currencies
      this.methods = data.responseMessage.methods
      //console.log(this.currencies)
    }, (error) => {
      console.log(error)
    })


  }



  // filter  by slider chamge
  onSliderChange(value: any) {
    let user = JSON.parse(localStorage.getItem('user'))
    this._fb
      .getOffers(this.type).subscribe((data: any) => {
      this.offers = data.responseMessage

      console.log(value[0])
      this.offers = data.responseMessage.filter((item: any) => {

        if (value && value[0] < Number(item.minimum) && value[1] > Number(item.maximum)) {
          return true
        }

        return false;
      });

      console.log(this.offers)
    })
  }

  // filter offers by price range
  onNotify(value: number) {
    let user = JSON.parse(localStorage.getItem('user'))
    this._fb
      .getOffers(this.type).subscribe((data: any) => {
      this.offers = data.responseMessage

      console.log(value)
      this.offers = data.responseMessage.filter((item: any) => {


        if (value == 1) {

          return true
        } else if (value == 2 && 10 < Number(item.minimum)) {
          return false
        } else if (value == 3 && 10 < Number(item.minimum) && 100 < Number(item.maximum)) {
          return false
        } else if (value == 4 && 100 < Number(item.minimum) && 500 < Number(item.maximum)) {
          return false
        } else if (value == 5 && 500 > Number(item.minimum)) {
          return false
        } else {
          return true;
        }

      });

      console.log(this.offers)
    })

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
      "type": "sell",
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
