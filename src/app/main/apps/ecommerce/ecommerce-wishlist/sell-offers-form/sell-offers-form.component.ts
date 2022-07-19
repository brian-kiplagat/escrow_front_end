import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sell-offers-form',
  templateUrl: './sell-offers-form.component.html',
  styleUrls: ['./sell-offers-form.component.scss']
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

  constructor() { }

  ngOnInit(): void {
  }

}
