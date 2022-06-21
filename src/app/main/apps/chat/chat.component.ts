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

  public partner_data: any = {}

  constructor(private fb: FirebaseService, private route: ActivatedRoute, private router: Router, private chat_service: ChatService) {

  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    const routeParams = this.route.snapshot.paramMap;
    this.fb.getTradeByID(this.user.username, this.user.token, routeParams.get('id')).subscribe((data: any) => {
      this.trade = data.responseMessage.trade?.[0];
      if (this.user.email == this.trade.buyer) {//Logged in user is buyer
        this.partner_data = data.responseMessage.seller//Assign to seller details so that seller details will be show in chat-content.html
      } else if ((this.user.email == this.trade.seller)) {//Logged in user is seller
        this.partner_data = data.responseMessage.buyer//Assign to buyer details so that buyer details will be show in chat-content.html
      }


    }, (error) => {
      console.log(error)
      this.router.navigate(['dashboard/overview'])
    });


  }

}
