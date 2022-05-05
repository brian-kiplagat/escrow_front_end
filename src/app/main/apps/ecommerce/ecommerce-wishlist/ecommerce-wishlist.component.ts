import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { FirebaseService } from '../../../../services/firebase.service';
@Component({
    selector: 'app-ecommerce-wishlist',
    templateUrl: './ecommerce-wishlist.component.html',
    styleUrls: ['./ecommerce-wishlist.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'ecommerce-application' }
})
export class EcommerceWishlistComponent implements OnInit {
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
    public currency:any[] = []
    public currencies =[]
    public methods =[]



    /**
     *
     * @param {CoreSidebarService} _coreSidebarService
     * @param {EcommerceService} _ecommerceService
     * @param {FirebaseService}_fb
     */
    constructor(
        private _coreSidebarService: CoreSidebarService,
        private _ecommerceService: EcommerceService,
        private _fb: FirebaseService
    ) { }

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
    sortProduct(sortParam) {
        this._ecommerceService.sortProduct(sortParam);
    }

    /**
     * On init
     */
    ngOnInit(): void {
        let user =JSON.parse(localStorage.getItem('user'))
        this._fb
            .getOffers(user.username,user.token,"sell").subscribe((data:any) => {
                // this.offers = data['data']['payload']
                this.offers = data.responseMessage
                console.log(data)
            })
            this._fb.getExchange().subscribe((data)=>{

                let listnew = data['data']['rates']
              this.currency = Object.keys(listnew)
                console.log(this.currency)
            })
            this._fb.getCurrency(user.username,user.token).subscribe((data:any)=>{
                this.currencies =data.responseMessage.currencies
                //this.currency = Object.keys(listNew);
                //this.methods = data.responsemessage.methods
                this.methods = data.responseMessage.methods
                console.log( this.methods)
              },(error)=>{
                console.log(error)
              })
        // Subscribe to ProductList change
        this._ecommerceService.onProductListChange.subscribe((res) => {
            this.products = res;
            this.products.isInWishlist = false;
        });

        // Subscribe to Wishlist change
        this._ecommerceService.onWishlistChange.subscribe((res) => (this.wishlist = res));

        // Subscribe to Cartlist change
        this._ecommerceService.onCartListChange.subscribe((res) => (this.cartList = res));

        // update product is in Wishlist & is in CartList : Boolean
        this.products.forEach((product) => {
            product.isInWishlist = this.wishlist.findIndex((p) => p.productId === product.id) > -1;
            product.isInCart = this.cartList.findIndex((p) => p.productId === product.id) > -1;
        });
    }
}
