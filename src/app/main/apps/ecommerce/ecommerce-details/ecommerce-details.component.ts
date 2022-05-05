import { Component, OnInit, ViewEncapsulation ,Input} from '@angular/core';

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
  public offer;
  public offers = []

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
  constructor(private _ecommerceService: EcommerceService,private route: ActivatedRoute,private _fb: FirebaseService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Wishlist
   *
   * @param product
   */
  toggleWishlist(product) {
    if (product.isInWishlist === true) {
      this._ecommerceService.removeFromWishlist(product.id).then(res => {
        product.isInWishlist = false;
      });
    } else {
      this._ecommerceService.addToWishlist(product.id).then(res => {
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
    this._ecommerceService.addToCart(product.id).then(res => {
      product.isInCart = true;
    });
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    let user =JSON.parse(localStorage.getItem('user'))
    this._fb
    .getOffers(user.username,user.token,"buy").subscribe((data) => {
        this.offers = data['data']['payload']
      console.log(this.offers)
      const routeParams = this.route.snapshot.paramMap;    
      const productIdFromRoute = routeParams.get('id');
      console.log(productIdFromRoute)
        this.offer = this.offers.find(product => product.id === productIdFromRoute);
    console.log(this.offer)
    })
    const routeParams = this.route.snapshot.paramMap;    
    const productIdFromRoute = routeParams.get('id');
    console.log(productIdFromRoute)
    this._fb
    .getInfo(productIdFromRoute).subscribe((data) => {
        let info= data
        console.log(info)
    })
 
  
    // Find the product that correspond with the id provided in route.
  
    // Subscribe to Wishlist change
    this._ecommerceService.onWishlistChange.subscribe(res => (this.wishlist = res));

    // Subscribe to Cartlist change
    this._ecommerceService.onCartListChange.subscribe(res => (this.cartList = res));

    // Get Related Products
    this._ecommerceService.getRelatedProducts().then(response => {
      this.relatedProducts = response;
    });

    this.product.isInWishlist = this.wishlist.findIndex(p => p.productId === this.product.id) > -1;
    this.product.isInCart = this.cartList.findIndex(p => p.productId === this.product.id) > -1;

    // content header
    this.contentHeader = {
      headerTitle: 'Product Details',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'eCommerce',
            isLink: true,
            link: '/'
          },
          {
            name: 'Shop',
            isLink: true,
            link: '/'
          },
          {
            name: 'Details',
            isLink: false
          }
        ]
      }
    };
  }
}
