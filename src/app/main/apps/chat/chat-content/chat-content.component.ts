import {Component, ElementRef, OnInit, ViewChild, Input, SimpleChanges} from '@angular/core';

import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {FirebaseService} from 'app/services/firebase.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ChatService} from "../chat.service";
import {ToastrService, GlobalConfig} from 'ngx-toastr';
import {PaginationService} from '../pagination.service';
import {ChatComponent} from "../chat.component";
import Swal from "sweetalert2";
import {AngularFirestore} from "@angular/fire/compat/firestore";


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
              private toastr: ToastrService,
              private invoke: ChatComponent,
              private firestore: AngularFirestore,
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
      this.chatMessage = 'This message was censored because it violates out Terms. Don’t share your phone numbers contact like information e.g whatsapp, telegram, discord etc. Scammers can try to rip you on off by asking you to send money outside our Coinpes escrow platform which actually keeps you safe. You must insist to keep all your messages inside this chat so that if your trade ends up in a dispute, our team can fully help you'

    }
    let user = JSON.parse(localStorage.getItem('user'));
    //console.log("message: ",this.chatMessage)

    if (this.chatMessage != "") {
      this.fb.sendMessage({
        tradeId: this.trade.id,
        senderId: user.username,
        message: this.chatMessage,
        recepient: this.partner_data.username

      }).then(data => {
        //console.log(data)
        this.firestore.collection('notifications').add({
          heading: 'New Trade message',
          timestamp: Date.now(),
          resource_path: '/offers/chat/room/' + this.trade.id,
          text: user.username + ' has sent you a message',
          username: this.partner_data.username,
          read: false
        });

      }).catch(error => {
        console.log(error)
        this.showDialog('We could not sed your message. Please refresh the page', 'Ops', 'warning')
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
      //Refresh
      let lastElement = data[data.length - 1]
      console.log(lastElement)
      if (lastElement.senderId != this.user.username && lastElement.message == 'XYgvC1fsxZqGvC1fsxZqGPKvC1fsxZqGbGQvC1fsxZq') {
        console.log('I got the key')
        //Invoke instance of the sidebar class tto update new info
        this.invoke.okUpdateSideBar(routeParams.get('id'))
      }


      setTimeout(() => {
        this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
      }, 0);
    }, error => {
      console.log(error)
      Swal.fire({
        title: ' <h5>An error happened</h5>',
        html: ' <p class="card-text font-small-3">We could not obtain your Chat. Please refresh the page</p>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7367F0',
        cancelButtonColor: '#E42728',
        confirmButtonText:
          '<i class="fa fa-check-circle"></i> Refresh Page',
        confirmButtonAriaLabel: 'Confirm',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1'
        }
      }).then(async (result) => {
        if (result.value) {
          Swal.close()
          location.reload()

        }
      });

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

  goExternal(link
               :
               string
  ) {
    window.open(link)
  }


  upload(event) {

    const file = event.target.files[0];
    if (file) {
      this.fb.uploadImage(file)
        .then((url) => {
          // The image has been uploaded successfully
          console.log('Image URL:', url);
          this.fb.sendMessage({
            tradeId: this.trade.id,
            senderId: JSON.parse(localStorage.getItem('user')).username,
            message: url,
            recepient: this.partner_data.username

          })
          let text
          if (file.type == 'application/pdf') {
            text = JSON.parse(localStorage.getItem('user')).username + ' has uploaded a new document'

          } else {
            text = JSON.parse(localStorage.getItem('user')).username + ' has uploaded a new image'

          }

          this.firestore.collection('notifications').add({
            heading: 'New Trade Attachment',
            timestamp: Date.now(),
            resource_path: '/offers/chat/room/' + this.trade.id,
            text: text,
            username: this.partner_data.username,
            read: false
          });
        })
        .catch((error) => {
          // An error occurred during the upload process
          console.error('Error uploading image:', error);
          if (error == 'INVALID_FILE_TYPE') {
            this.showDialog('Only PNG, JPEG, and PDF files are allowed.', 'Invalid File', 'warning')
          }
        });
    }

  }

  showDialog(message, title, icon) {
    Swal.fire({
      title: ' <h5>' + title + '</h5>',
      html: '<p class="card-text font-small-3">' + message + '</p>',
      icon: icon,
      showCancelButton: false,
      confirmButtonColor: '#2746e4',
      confirmButtonText:
        'OK THANKS',
      customClass: {
        confirmButton: 'btn btn-primary'
      }
    })
  }
}
