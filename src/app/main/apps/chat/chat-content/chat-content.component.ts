import {Component, ElementRef, OnInit, ViewChild, Input, SimpleChanges} from '@angular/core';

import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {FirebaseService} from 'app/services/firebase.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ChatService} from "../chat.service";
import {ToastrService, GlobalConfig} from 'ngx-toastr';
import {PaginationService} from '../pagination.service';

@Component({
  selector: 'app-chat-content',
  templateUrl: './chat-content.component.html'
})
export class ChatContentComponent implements OnInit {
  @Input() trade: any;
  @Input() partner_data: any;
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
    status: 'online',
    ago: '2 Minutes ago'

  };
  public userProfile;
  public chatMessage = '';
  public newChat;
  public startConvo: Boolean = true;
  public user: any = {}
  public currentUser: any = {}
  public tradeData: any = {}
  public buyer: boolean;
  public tradeId = ""

  constructor(private _chatService: ChatService,
              private _coreSidebarService: CoreSidebarService,
              private fb: FirebaseService,
              private route: ActivatedRoute,
              private router: Router,
              public page: PaginationService,
              private toastr: ToastrService
  ) {
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------
  scrollHandler(e: any) {
    // should log top or bottom
    if (e === 'bottom') {
      this.page.more()
    }
  }

  /**
   * Update Chat
   */
  updateChat() {
    let toCheck = ['Clubhouse', 'VKontakte', 'Quora', 'Twitter', 'Reddit', 'Pinterest', 'QZone', 'Snapchat',
      'Telegram', 'Weibo', 'Sina', 'QQ', 'Douyin', 'TikTok', 'LinkedIn', 'WeChat', 'Instagram', 'Facebook', 'Messenger', 'YouTube', 'whatsapp', 'Fuck', 'Asshole', 'Ass', 'Petrol', 'Diesel'];
    if (toCheck.some(o => this.chatMessage.toLowerCase().includes(o.toLowerCase()))) {
      this.chatMessage = 'This message was censored because it violates Coinpes TOS. Don’t share your phone numbers contact like information e.g whatsapp, telegram, discord etc. Scammers can try to rip you on off by asking you to send money outside our Coinpes escrow platform which actually keeps you safe. You must insist to keep all your messages inside this chat so that if your trade ends up in a dispute, our team can fully help you'

    }
    let user = JSON.parse(localStorage.getItem('user'));
    //console.log("message: ",this.chatMessage)

    if (this.chatMessage != "") {
      this.fb.sendMessage({
        tradeId: this.trade.id,
        senderId: user.username,
        message: this.chatMessage,
        recepient: this.partner_data.username

      })
      this.chatMessage = '';//Reset the input to an empty value
      setTimeout(
        () => {
          this
            .scrolltop = this.scrollMe?.nativeElement.scrollHeight;
        }, 0)
      ;
    }


  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(this.partner_data)
    this.chatUser.ago = this.partner_data[0].online
    if (this.chatUser.ago.includes('seconds') || this.chatUser.ago.includes('second')) {
      this.chatUser.status = 'online'
      return
    }
    if (this.chatUser.ago.includes('minutes') || this.chatUser.ago.includes('minute')) {
      this.chatUser.status = 'online'
      return
    }
    if (this.chatUser.ago.includes('hours') || this.chatUser.ago.includes('hour')) {
      this.chatUser.status = 'busy'
      return
    }
    if (this.chatUser.ago.includes('weeks') || this.chatUser.ago.includes('week')) {
      this.chatUser.status = 'away'
      return
    }
    if (this.chatUser.ago.includes('months') || this.chatUser.ago.includes('month')) {
      this.chatUser.status = 'offline'
      return
    }
    if (this.chatUser.ago.includes('year') || this.chatUser.ago.includes('years')) {
      this.chatUser.status = 'offline'
      return
    }


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
  ngOnInit()
    :
    void {
    const routeParams = this.route.snapshot.paramMap;
    this.user = JSON.parse(localStorage.getItem('user'));
    this.page.init(routeParams.get('id'), 'time', {reverse: true, prepend: false})
    this.fb.retrieveMessage(routeParams.get('id')).subscribe((data: any) => {
      this.chats = data;
      setTimeout(() => {
        this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
      }, 0);
    });
    this.activeChat = false;

  }

  block(ext_username, trade_id) {
    let user = JSON.parse(localStorage.getItem('user'));
    this.fb.blockNow(this.user.token, this.user.username, {

      "email": user.email,
      "please_block": ext_username,
      "trade_id": trade_id,

    }).subscribe((response: any) => {
      this.toastr.success(response.responseMessage, 'Done!', {
        toastClass: 'toast ngx-toastr',
        timeOut: 5000,
        closeButton: true
      });

    }, (err) => {
      this.toastr.error(err.error.responseMessage, 'Ops!', {
        toastClass: 'toast ngx-toastr',
        timeOut: 5000,
        closeButton: true
      });

    })
  }

  openLink(username
             :
             string
  ) {
    window.location.href = '/users/' + username
  }


}
