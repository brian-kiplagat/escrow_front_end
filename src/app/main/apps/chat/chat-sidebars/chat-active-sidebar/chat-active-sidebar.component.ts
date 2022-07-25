import {Component, OnInit, Input, SimpleChanges} from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { ChatService } from 'app/main/apps/chat/chat.service';
import {ActivatedRoute, Router} from "@angular/router";
import {FirebaseService} from 'app/services/firebase.service';


@Component({
  selector: 'app-chat-active-sidebar',
  templateUrl: './chat-active-sidebar.component.html'
})
export class ChatActiveSidebarComponent implements OnInit {
  @Input() partner_data: any;
  public chatUser = {
    fullName: 'ochieng Warren',
    userId: 1,
    avatar: 'assets/images/avatars/12-small.png',
    status: 'online',
    ago: '2 Minutes ago'

  };

  /**
   * Constructor
   *
   * @param {ChatService} _chatService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _chatService: ChatService, private _coreSidebarService: CoreSidebarService, private route: ActivatedRoute,private fb: FirebaseService, private router:Router) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

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

  }
  
  ngOnChanges(changes: SimpleChanges) {
    this.chatUser.ago = this.partner_data[0].online
    if (this.chatUser.ago.includes('seconds') || this.chatUser.ago.includes('second')){
      this.chatUser.status = 'online'
      return
    } if (this.chatUser.ago.includes('minutes') || this.chatUser.ago.includes('minute')){
      this.chatUser.status = 'online'
      return
    } if (this.chatUser.ago.includes('hours') || this.chatUser.ago.includes('hour')){
      this.chatUser.status = 'busy'
      return
    }
    if (this.chatUser.ago.includes('weeks') || this.chatUser.ago.includes('week')){
      this.chatUser.status = 'away'
      return
    } if (this.chatUser.ago.includes('months') || this.chatUser.ago.includes('month')){
      this.chatUser.status = 'offline'
      return
    } if (this.chatUser.ago.includes('year') || this.chatUser.ago.includes('years')){
      this.chatUser.status = 'offline'
      return
    }


  }
}
