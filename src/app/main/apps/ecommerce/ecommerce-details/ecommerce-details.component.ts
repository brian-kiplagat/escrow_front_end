import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../../../services/firebase.service';

@Component({
    selector: 'app-ecommerce-details',
    templateUrl: './ecommerce-details.component.html',
    styleUrls: ['./ecommerce-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'ecommerce-application' }
})
export class EcommerceDetailsComponent implements OnInit {
    // public
    public contentHeader: object;
    public product;
    public wishlist;
    public cartList;
    public relatedProducts;
    public offer: any = {};
    public offers = [];
    public oldoffer:any ={}
    public buyamount =""
    public currentUser:any ={}

    // Swiper
    public swiperResponsive: SwiperConfigInterface = {
        slidesPerView: 3,
        spaceBetween: 50,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        breakpoints: {
            1024: {
                slidesPerView: 3,
                spaceBetween: 40
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            640: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            320: {
                slidesPerView: 1,
                spaceBetween: 10
            }
        }
    };

    /**
     * Constructor
     *
     * @param {EcommerceService} _ecommerceService
     */
    constructor(
        private _ecommerceService: EcommerceService,
        private route: ActivatedRoute,
        private _fb: FirebaseService
    ) {}

    // Public Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle Wishlist
     *
     * @param product
     */
    toggleWishlist(product) {
        if (product.isInWishlist === true) {
            this._ecommerceService.removeFromWishlist(product.id).then((res) => {
                product.isInWishlist = false;
            });
        } else {
            this._ecommerceService.addToWishlist(product.id).then((res) => {
                product.isInWishlist = true;
            });
        }
    }

    /**
     * Add To Cart
     *
     * @param product
     */
    addToCart(product) {
        this._ecommerceService.addToCart(product.id).then((res) => {
            product.isInCart = true;
        });
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        let user = JSON.parse(localStorage.getItem('user'));
        const routeParams = this.route.snapshot.paramMap;
        const productIdFromRoute = routeParams.get('id');
        console.log(productIdFromRoute);
        this._fb.getInfo(user.username, user.token, productIdFromRoute).subscribe((data: any) => {
            this.offer = data.responseMessage.data;
            console.log(data.responseMessage.data);
        });
    
    }
    openTrade() {
        //get user and token from local stroge
        let user = JSON.parse(localStorage.getItem('user'));
        this._fb.getUser(user.username,user.token).subscribe((data:any)=>{
            this.currentUser=data.responseMessage.user_data[0]
             //get current loggedin user
        this._fb
        .getOffers(user.username,user.token,this.offer.type).subscribe((data:any) => {
            this.offers = data.responseMessage 
          const routeParams = this.route.snapshot.paramMap;    
          const productIdFromRoute = routeParams.get('id');
            this.oldoffer = this.offers.find(product => product.idd == productIdFromRoute);
            const body={   
                "requestId":this.oldoffer.requestId,
                "email":this.currentUser.email,
                "offer_id":this.oldoffer.idd,
                "amount_fiat":this.buyamount,
                "rate":this.oldoffer.margin,
                "min":this.offer.minimum,
                "max":this.offer.maximum
            }
              //formulate request body

        this._fb.openTrade(user.username, user.token,body).subscribe(
            (data: any) => {
                console.log(data);
            },
            (error) => {
                console.log(error);
            }
        );
            

        })
        })
       
      
    }
}
