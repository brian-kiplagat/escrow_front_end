import { Component, OnInit, ViewEncapsulation,Input } from '@angular/core';
import { FirebaseService } from 'app/services/firebase.service';

@Component({
  selector: 'ecommerce-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['../ecommerce-shop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceSidebarComponent implements OnInit {
  @Input()methods:any
  // Public
  public sliderPriceValue = [1, 100];
  public tags:any[]=[]

  constructor(private fb:FirebaseService) {}

  ngOnInit(): void {
    let user =JSON.parse(localStorage.getItem('user'))
    this.fb.getTags(user.username,user.token).subscribe((data:any)=>{
      console.log("here are the tags",data)
      this.tags = data.responseMessage
    })
  }
}
