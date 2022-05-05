import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { FirebaseService } from '../../../../services/firebase.service';
@Component({
    selector: 'app-ecommerce-shop',
    templateUrl: './ecommerce-shop.component.html',
    styleUrls: ['./ecommerce-shop.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'ecommerce-application' }
})
export class EcommerceShopComponent implements OnInit {
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
    public selectBasic: any[] = ['Bank Transfer', 'Mpesa', 'Paypal', 'Skrill'];
    public selectBasicLoading = false;
    public offers = []
    public currency:any[] = []
    public currencies =[]
    public methods =[]
   
    public filters ={
         currency:"",
         method:"",
        amount :""
    }

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

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        let user =JSON.parse(localStorage.getItem('user'))
        this._fb
            .getOffers(user.username,user.token).subscribe((data:any)=>{
                this.offers = data.responseMessage
                console.log(data)
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
    //filter offers
    filterOffers(){
        let user =JSON.parse(localStorage.getItem('user'))
        this._fb
            .getOffers(user.username,user.token).subscribe((data:any)=>{
                this.offers = data.responseMessage
                console.log(data)
            })
            console.log("method",this.filters.method,"currency",this.filters.currency,"amount",this.filters.amount)
    }
}
