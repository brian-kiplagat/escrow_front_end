import { Component, OnInit, ViewEncapsulation,Input,Output,EventEmitter } from '@angular/core';
import { FirebaseService } from 'app/services/firebase.service';

@Component({
  selector: 'ecommerce-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['../market-buy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceSidebarComponent implements OnInit {
  @Input()type:string  | undefined;
  @Output()notify= new EventEmitter<string>()
  @Output()sliderChange= new EventEmitter<any>()
  @Output()tagChange =new EventEmitter<string>()
  // Public
  public sliderPriceValue = [1, 1000];
  public tags:any[]=[]
  public offers:any[]=[]

  constructor(private fb:FirebaseService) {}


  ngOnInit(): void {
    let user =JSON.parse(localStorage.getItem('user'))
    this.fb.getTags(user.username,user.token).subscribe((data:any)=>{
      console.log("here are the tags",data)
      this.tags = data.responseMessage
    })
  }
   //filter offers
   filterOffersByRange(e:any){
     this.notify.emit(e.target.value)

}
//notify slider
sliderValue(e:any){
this.sliderChange.emit(e)
}
//tag value
tagValue(e:any){
this.tagChange.emit(e.target.value)
}
}
