import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {FirebaseService} from 'app/services/firebase.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ChatService} from "./chat.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {class: 'chat-application'}
})
export class ChatComponent implements OnInit {
  public user: any = {}
  public currentUser: any = {}
  public tradeData: any = {}
  public trade: any = {}
  public buyer: boolean;
  public partner_data:any={}
  constructor(private fb: FirebaseService, private route: ActivatedRoute, private router: Router, private chat_service: ChatService) {

  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    const routeParams = this.route.snapshot.paramMap;
    this.fb.getTradeByID(this.user.username, this.user.token, routeParams.get('id')).subscribe((data: any) => {
     let tradeBuyer = data.responseMessage.buyer.message
     let tradeSeller = data.responseMessage.seller.message
     if(this.user.username ==tradeBuyer.username){
      this.partner_data = tradeBuyer
     }else{
      this.partner_data = tradeSeller
     }
      this.trade = data.responseMessage.trade?.[0];
    }, (error) => {
      console.log(error)
      this.router.navigate(['dashboard'])
    });



  }
}
