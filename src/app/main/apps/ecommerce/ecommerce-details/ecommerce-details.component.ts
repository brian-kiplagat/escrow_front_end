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
        let user = JSON.parse(localStorage.getItem('user'));
        this._fb.openTrade(user.username, user.token, this.offer).subscribe(
            (data: any) => {
                console.log(data);
            },
            (error) => {
                console.log(error);
            }
        );
    }
}
