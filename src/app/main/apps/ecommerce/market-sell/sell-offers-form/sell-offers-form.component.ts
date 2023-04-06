import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FirebaseService } from 'app/services/firebase.service';

@Component({
  selector: 'app-sell-offers-form',
  templateUrl: './sell-offers-form.component.html',
  styleUrls: ['./sell-offers-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }

})
export class SellOffersFormComponent implements OnInit {
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
  public type:string ="buy"
  public filters ={
       currency:"",
       method:"",

  }

  constructor(private _fb: FirebaseService) { }

  ngOnInit(): void {
    this._fb
    .getOffers("buy").subscribe((data:any) => {
        // this.offers = data['data']['payload']
        this.offers = data.responseMessage
        console.log(data)
    })

    this._fb.getCurrency().subscribe((data:any)=>{
        this.currencies =data.responseMessage.currencies
        //this.currency = Object.keys(listNew);
        //this.methods = data.responsemessage.methods
        this.methods = data.responseMessage.methods
        console.log( this.methods)
      },(error)=>{
        console.log(error)
      })
  }

}
