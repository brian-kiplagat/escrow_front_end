import {Component, ElementRef, OnInit, ViewChild, Input} from '@angular/core';

import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {FirebaseService} from 'app/services/firebase.service';
import {Router, ActivatedRoute} from '@angular/router';
import {user} from "@angular/fire/auth";

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

  /**
   * Constructor
   *
   * @param {ChatService} _chatService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
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

    this.chat_instruction = 'Hello world'

    this.user = JSON.parse(localStorage.getItem('user'));
    const routeParams = this.route.snapshot.paramMap;
    const productIdFromRoute = routeParams.get('id');

    if (this.trade.buyer == this.user.email) {//Here i try to check if the logged in user is the buyer,,,,but i cant seem to access the users email
      console.log('Logged in user is buyer')

      //Logged in user is the buyer
    } else {
      //Logged in user is the seller
      console.log('Logged in user is the seller')
    }

    this.fb.getUser(this.user.username, this.user.token).subscribe((data: any) => {
      this.currentUser = data.responseMessage?.user_data[0];
      this.tradeData = data.responseMessage?.trade_data;
      this.trade = this.tradeData.find(product => product.id == productIdFromRoute);
      console.log(this.trade)
    //  console.log(this.currentUser)

      this.fb.retrieveMessage(this.trade.id).subscribe((data: any) => {
        this.chats = data;
        console.log(data)
      });
    }, (error) => {
      console.log(error)
      this.router.navigate(['dashboard'])
    });
    this.activeChat = false;

  }
}
