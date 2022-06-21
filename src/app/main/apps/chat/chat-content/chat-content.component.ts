import {Component, ElementRef, OnInit, ViewChild, Input} from '@angular/core';

import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {FirebaseService} from 'app/services/firebase.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ChatService} from "../chat.service";
import { Observable } from 'rxjs';
import { PaginationService } from '../pagination.service';

@Component({
  selector: 'app-chat-content',
  templateUrl: './chat-content.component.html'
})
export class ChatContentComponent implements OnInit {
  @Input() trade: any;
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
  public chat_instruction;
  public uname;
  public buyer: boolean;
  public patner_data: any;
  public tradeId = ""

  constructor(private _chatService: ChatService,
              private _coreSidebarService: CoreSidebarService,
              private fb: FirebaseService,
              private route: ActivatedRoute,
              private router: Router,
              public page: PaginationService

  ) {
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------
  scrollHandler(e:any) {
    // should log top or bottom
    if (e === 'bottom') {
      this.page.more()
    }
  }
  /**
   * Update Chat
   */
  updateChat() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.fb.sendMessage({
      tradeId: this.trade.id,
      senderId: user.username,
      message: this.chatMessage


    })
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
console.log(this.trade)
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fb.getUser(this.user.username, this.user.token).subscribe((data: any) => {
      this.currentUser = data.responseMessage?.user_data[0];

      if (this.trade.buyer == this.currentUser.email) {//Logged in user is the buyer
        this.buyer = true;
        this.fb.getUserByMail(this.trade.seller, this.user.token, this.user.username).subscribe((data: any) => {
          this.patner_data = data.responseMessage?.[0];
        }, (error) => {
          console.log(error)
          this.router.navigate(['dashboard'])
        });

      } else if (this.trade.seller == this.currentUser.email) {//Logged in user is the seller
       
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
     this.tradeId =this.trade.id.toString()
      this.page.init(this.trade.id.toString(), 'time', { reverse: true, prepend: false })
    }, (error) => {
      console.log(error)
      this.router.navigate(['dashboard'])
    });
    
    
    this.activeChat = false;

  }

  openLink(username: string) {
    window.location.href = '/user/' + username
  }


}
