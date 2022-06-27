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
  // Public
  public chatUser;
  email: string = '';
  public userData: any = {
    about: "No about yet",
    active: 1,
    feed_neg: 0,
    feed_pos: 0,
    geolocation: "none",
    ip: "none",
    registration_date: "2022-04-01 13:14:34",
    status: 1
  };
  public user: any = {};
  public external_username;
  public has_blocked;
  public blocked_by;
  public currentUser: any = {};
  public msg;
  public success = false;
  public error = false;
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
    this.external_username = this.route.snapshot.paramMap.get('id');

    console.log(this.external_username);
    // get the currentUser details from localStorage
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fb.getUserForProfile(this.external_username, this.user.token, this.user.username).subscribe((data: any) => {
      this.currentUser = data.responseMessage?.user_data[0];
      this.has_blocked = data.responseMessage?.has_blocked.length;
      this.blocked_by = data.responseMessage?.blocked_by.length;
      console.log(data);
    }, (error) => {
      console.log(error);
     // this.router.navigate(['/']);
    });
    this._chatService.onSelectedChatUserChange.subscribe(res => {
      this.chatUser = res;
    });
  }
}
