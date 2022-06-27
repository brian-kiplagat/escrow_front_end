import { Component, OnInit,Input} from '@angular/core';

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
}
