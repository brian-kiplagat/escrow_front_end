import {Component, ElementRef, OnInit, ViewChild, Input} from '@angular/core';

import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {FirebaseService} from 'app/services/firebase.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ChatService} from "../chat.service";
import { ToastrService, GlobalConfig } from 'ngx-toastr';
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
    status: 'online'
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
  block(ext_username: string) {
    let user = JSON.parse(localStorage.getItem('user'));
    this.fb.blockNow(this.user.token, this.user.username, {

      "email": user.email,
      "please_block": ext_username,

    }).subscribe((response: any) => {
      this.toastr.success(response.responseMessage, 'Done!', {
        toastClass: 'toast ngx-toastr',
        timeOut: 5000,
        closeButton: true
      });

    }, (err) => {
      this.toastr.success(err.error, 'Ops!', {
        toastClass: 'toast ngx-toastr',
        timeOut: 5000,
        closeButton: true
      });

    })
  }
  openLink(username: string) {
    window.location.href = '/users/' + username
  }


}
