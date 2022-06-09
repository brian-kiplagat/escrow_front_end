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

  constructor(private fb: FirebaseService, private route: ActivatedRoute, private router: Router, private chat_service: ChatService) {

  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    const routeParams = this.route.snapshot.paramMap;
    this.fb.getUser(this.user.username, this.user.token).subscribe((data: any) => {
      this.currentUser = data.responseMessage?.user_data[0];
      console.log(this.currentUser)
    }, (error) => {
      console.log(error)
      this.router.navigate(['dashboard'])
    });
    this.fb.getTradeByID(this.user.username, this.user.token, routeParams.get('id')).subscribe((data: any) => {
      console.log(data)
      this.trade = data.responseMessage?.[0];

    }, (error) => {
      console.log(error)
      this.router.navigate(['dashboard'])
    });



  }
}
