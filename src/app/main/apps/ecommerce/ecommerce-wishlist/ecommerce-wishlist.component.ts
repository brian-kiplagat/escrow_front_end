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
    public   amount =0
    public type:string ="sell"
    public filters ={
         currency:"",
         method:"",
      
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
        this.products.forEach((product:any) => {
            product.isInWishlist = this.wishlist.findIndex((p:any) => p.productId === product.id) > -1;
            product.isInCart = this.cartList.findIndex((p:any) => p.productId === product.id) > -1;
        });

    }
    onNotify(value:number){
         let user =JSON.parse(localStorage.getItem('user'))
    this._fb
        .getOffers(user.username,user.token,this.type).subscribe((data:any)=>{
            this.offers = data.responseMessage
         
           console.log(value)
            this.offers=data.responseMessage.filter((item:any) =>{

                
                if(value ==1){
                    
                    return true
                }else if(value ==2&&10 < Number(item.minimum)){
                    return false
                }else if(value ==3&&10 < Number(item.minimum)&& 100 < Number(item.maximum)){
                    return false
                }
                else if(value ==4&&100 < Number(item.minimum)&& 500 < Number(item.maximum)){
                    return false
                }
              
               else if(value ==5&&500 >Number(item.minimum)){
                  return false
              }else{
                return true;
              }
                
              });
              
              console.log(this.offers)
        })
      
    }
    onSliderChange(value:any){
        let user =JSON.parse(localStorage.getItem('user'))
        this._fb
            .getOffers(user.username,user.token,this.type).subscribe((data:any)=>{
                this.offers = data.responseMessage
             
               console.log(this.offers,value)
                this.offers=data.responseMessage.filter((item:any) =>{

                    if(value&&value[0] < Number(item.minimum)&& value[1] > Number(item.maximum)){
                        return true
                    }
                  
                    return false;
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
        //filter offers
        filterOffers(){
            let user =JSON.parse(localStorage.getItem('user'))
            this._fb
                .getOffers(user.username,user.token,"sell").subscribe((data:any)=>{
                    this.offers = data.responseMessage
                   
                    this.offers=data.responseMessage.filter((item:any) =>{
                        
                        if(this.amount!=0&&this.amount < Number(item.minimum)|| this.amount > Number(item.maximum)){
                            
                            return false
                        }
                        if(this.filters.currency&& item.currency != this.filters.currency){
                            return false
                        }
                        if(this.filters.method&& item.method != this.filters.method){
                            return false
                        }
                        return true;
                      });
                      
                      console.log(this.offers)
                })
              
        }
 
}
