import {Component, ElementRef, OnInit, ViewChild, Input} from '@angular/core';

import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {FirebaseService} from 'app/services/firebase.service';
import {Router, ActivatedRoute} from '@angular/router';
import {user} from "@angular/fire/auth";
import {ChatService} from "../chat.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-chat-content',
  templateUrl: './chat-content.component.html'
})
export class ChatContentComponent implements OnInit {
  // Decorator
  @ViewChild('scrollMe') scrollMe: ElementRef;
  scrolltop: number = null;

  // Public
  public activeChat: Boolean;
  public chats: any = [];
  public chatUser = {
    fullName: 'ochieng Warren',
    userId: 1,
    avatar: 'assets/images/avatars/12-small.png',
    status: 'online'
  };
  public userProfile;
  public chatMessage = '';
  public newChat;
  public startConvo: Boolean = true;
  public user: any = {}
  public currentUser: any = {}
  public tradeData: any = {}
  public trade: any = {}
  public chat_instruction;
  public uname;
  public buyer: boolean;
  public patner_data: any;

  constructor(private _chatService: ChatService,
              private _coreSidebarService: CoreSidebarService,
              private fb: FirebaseService,
              private route: ActivatedRoute,
              private router: Router
  ) {
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Update Chat
   */
  updateChat() {
    let user = JSON.parse(localStorage.getItem('user'));

    this.fb.sendMessage({
      tradeId: this.trade.id,
      senderId: user.username,
      message: this.chatMessage


    });
    this.chatMessage = '';//Reset the input to an empty value
    setTimeout(() => {
      this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
    }, 0);

    console.log(this.chatMessage)

  }

  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    const routeParams = this.route.snapshot.paramMap;
    this.fb.getUser(this.user.username, this.user.token).subscribe((data: any) => {
      this.currentUser = data.responseMessage?.user_data[0];

      if (this.trade.buyer == this.currentUser.email) {//Logged in user is the buyer
        console.log(this.currentUser.email + ': Logged in user is buyer')
        this.buyer = true;
        this.fb.getUserByMail(this.trade.seller, this.user.token, this.user.username).subscribe((data: any) => {
          this.patner_data = data.responseMessage?.[0];
        }, (error) => {
          console.log(error)
          this.router.navigate(['dashboard'])
        });

      } else if (this.trade.seller == this.currentUser.email) {//Logged in user is the seller
        console.log(this.currentUser.email + ': Logged in user is the seller')
        this.buyer = false;
        //Get the details of the buyer
        this.fb.getUserByMail(this.trade.buyer, this.user.token, this.user.username).subscribe((data: any) => {
          //console.log(data)
          this.patner_data = data.responseMessage?.[0];
        }, (error) => {
          console.log(error)
          // this.router.navigate(['dashboard'])
        });

      }

      this.fb.retrieveMessage(this.trade.id).subscribe((data: any) => {
        this.chats = data;
        console.log(data)
      });
    }, (error) => {
      console.log(error)
      this.router.navigate(['dashboard'])
    });
    this.fb.getTradeByID(this.user.username, this.user.token, routeParams.get('id')).subscribe((data: any) => {
      this.trade = data.responseMessage?.[0];
      console.log(data)
    }, (error) => {
      console.log('trade error' + error)
      this.router.navigate(['dashboard'])
    });

    this.activeChat = false;

  }

  openLink(username: string) {
    window.location.href = '/user/' + username
  }


}
