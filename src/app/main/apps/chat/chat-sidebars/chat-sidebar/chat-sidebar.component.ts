import {Component, OnInit, Input} from '@angular/core';
import {first} from 'rxjs/operators';

import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';

import {ChatService} from 'app/main/apps/chat/chat.service';

import clipboard from 'clipboardy';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import Swal from "sweetalert2";

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html'
})
export class ChatSidebarComponent implements OnInit {
  // Public
  public contacts;
  public chatUsers;
  public searchText;
  public chats;
  public selectedIndex = null;
  public userProfile;
  private options: GlobalConfig;
  public status = 'Started';

  @Input() trade: any;

  /**
   * Constructor
   *
   * @param {ChatService} _chatService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _chatService: ChatService, private _coreSidebarService: CoreSidebarService, private toastr: ToastrService) {
    this.options = this.toastr.toastrConfig;
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open Chat
   *
   * @param id
   * @param newChat
   */
  openChat(id) {
    this._chatService.openChat(id);//Invoke chat.service.ts instance

    // Reset unread Message to zero
    this.chatUsers.map(user => {
      if (user.id === id) {
        user.unseenMsgs = 0;
      }
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

  /**
   * Set Index
   *
   * @param index
   */
  setIndex(index: number) {
    this.selectedIndex = index;
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------


  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to contacts
    this._chatService.onContactsChange.subscribe(res => {
      this.contacts = res;
    });

    let skipFirst = 0;

    // Subscribe to chat users
    this._chatService.onChatUsersChange.subscribe(res => {
      this.chatUsers = res;

      // Skip setIndex first time when initialized
      if (skipFirst >= 1) {
        this.setIndex(this.chatUsers.length - 1);
      }
      skipFirst++;
    });

    // Subscribe to selected Chats
    this._chatService.onSelectedChatChange.subscribe(res => {
      this.chats = res;
    });

    // Add Unseen Message To Chat User
    this._chatService.onChatsChange.pipe(first()).subscribe(chats => {
      chats.map(chat => {
        this.chatUsers.map(user => {
          if (user.id === chat.userId) {
            user.unseenMsgs = chat.unseenMsgs;
          }
        });
      });
    });

    // Subscribe to User Profile
    this._chatService.onUserProfileChange.subscribe(response => {
      this.userProfile = response;
    });
    //Load up chat interface to the template....pass a chat id to pull up message...contact data is aailable .../@fake-db/chat.data.ts
    this.openChat(1);//1

  }

  mark_paid(text: any) {
    Swal.fire ({
      title: 'Are you sure?',
      text: "You must ensure that you have sent the money first before clicking this button. Providing wrong information or coinlocking will cause your account to be banned",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      cancelButtonColor: '#E42728',
      confirmButtonText: 'Yes, ive sent it',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    }).then(function (result) {
      if (result.value) {

        return fetch('https://api.coinbase.com/v2/exchange-rates?currency=BTC')
          .then(function (response) {
            console.log(response);
            if (!response.ok) {

              throw new Error(response.statusText);
            }else{

              Swal.fire({
                title: 'Trade Marked as Paid',
                text: 'The seller will check on your payment and send the BTC shortly',
                icon: 'success',
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              });
            }
            return response.json();
          })
          .catch(function (error) {
            Swal.fire({
              title: 'Ops',
              text: 'An error happened please try again',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            });
          });

      }
    });

  }

}
