import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {ChatService} from 'app/main/apps/chat/chat.service';
import {GlobalConfig, ToastrService} from 'ngx-toastr';
import Swal from "sweetalert2";
import {Subscription, timer} from "rxjs";

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html'
})
export class ChatSidebarComponent implements OnInit, OnChanges {
  @Input() trade: any;
  @Input() currentUser: any;
  // Public
  public contacts;
  public chatUsers;
  public searchText;
  public chats;
  public selectedIndex = null;
  public userProfile;
  private options: GlobalConfig;
  public user: any = {}
  public storage: any;
  public status: any;

  //TIMER
  countDown: Subscription;
  counter;//1800
  tick = 1000;
  public minutes;
  public seconds
  //TIMER
  public mmss: string;


  /**
   * Constructor
   *
   * @param {ChatService} _chatService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _chatService: ChatService, private _coreSidebarService: CoreSidebarService, private toastr: ToastrService) {
    this.options = this.toastr.toastrConfig;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(this.trade)
    //console.log(this.status)

    this.status = this.trade.status;
    const secs_since_start = new Date(this.trade.created_at).getTime() / 1000;//Here update with trade.created_at
    const current_time_stamp = Math.floor(Date.now() / 1000)
    this.counter = 1800 - (current_time_stamp - secs_since_start)
    this.countDown = timer(0, this.tick)
      .subscribe(() => {
        --this.counter
        //console.log(this.counter)
        this.mmss = this.transform(this.counter)
        if (this.counter == 500) {
          this.toast('Hurry up', 'You have 5 minutes left to conclude this exchange', 'error')
        }
      })
    //console.log(this.trade,changes)
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
  buyer_online: boolean = true;

  /**
   * On init
   */
  playAudio(path) {
    let audio = new Audio();
    audio.src = path;
    audio.load();
    audio.play();
  }

  ngOnInit(): void {
    // Subscribe to contacts

    this.storage = JSON.parse(localStorage.getItem('user'));

    //Load up chat interface to the template....pass a chat id to pull up message...contact data is available .../@fake-db/chat.data.ts
    this.openChat(1);//1

  }

  transform(value: number): string {
    //MM:SS format
    const minutes: number = Math.floor(value / 60);
    return ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);

  }

  mark_paid(id: any) {
    if (this.trade.buyer == this.storage.email) {
      Swal.fire({
        title: ' <h5>Are you sure?</h5>',
        html: ' <p class="card-text font-small-3">You must ensure that you have sent the money first before clicking this button. Providing false information or coinlocking will cause your account to be banned</p>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7367F0',
        cancelButtonColor: '#E42728',
        confirmButtonText:
          '<i class="fa fa-check-circle"></i> Confirm Payment',
        confirmButtonAriaLabel: 'Confirm',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1'
        }
      }).then(async (result) => {
        if (result.value) {
          let user = JSON.parse(localStorage.getItem('user'))
          const headerDict = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            token: user.token,
            username: user.username
          }
          const requestOptions = {
            headers: new Headers(headerDict),
          };
          await fetch('https://api.coinlif.com/api/coin/v1/markPaid/' + id, requestOptions).then((response) => {
            console.log(response);
            if (!response.ok) {

              throw new Error(response.statusText);
            } else {
              this.status = "PAID"
              this.toast('Great', '👋 You just confirmed your payment. Its now the sellers turn to send the Bitcoin', 'success')
              this.playAudio('assets/sounds/tirit.wav')
            }
          }).catch((error) => {
            this.toast('Ops', '👋 An error happened try again', 'error')
          })
        }
      });
    } else {
      this.toast('INVALID', 'You cant do that', 'error')
    }
  }

  cancel_trade(id: any) {
    if (this.trade.buyer == this.storage.email) {
      Swal.fire({
        title: ' <h5>Hey Wait!</h5>',
        html: ' <p class="card-text font-small-3">Stay on this trade if you\'ve already made this payment. For any other issues, click Back and start a dispute.</p>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2746e4',
        cancelButtonColor: '#E42728',
        cancelButtonText: 'Go back',
        confirmButtonText:
          '<i class="fa fa-ban"></i> CANCEL TRADE',
        confirmButtonAriaLabel: 'CANCEL',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1'
        }
      }).then(async (result) => {
        if (result.value) {
          let user = JSON.parse(localStorage.getItem('user'))
          const headerDict = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            token: user.token,
            username: user.username
          }
          const requestOptions = {
            headers: new Headers(headerDict),
          };
          await fetch('https://api.coinlif.com/api/coin/v1/cancelTrade/' + id, requestOptions).then((response) => {
            console.log(response);
            if (!response.ok) {

              throw new Error(response.statusText);
            } else {
              this.status = "CANCELLED_BUYER"
              this.toast('Cancelled', '👋 You just cancelled this trade. If you wish to trade again you must open a trade, so that we reserve an escrow for safe payments', 'success')
              this.playAudio('assets/sounds/turumturum.wav')
            }
          }).catch((error) => {
            this.toast('Ops', '👋 An error happened try again', 'error')
          })
        }
      });
    } else {
      this.toast('INVALID', 'You cant do that', 'error')
    }

  }

  release_btc(id: any) {
    if (this.trade.seller == this.storage.email) {
      Swal.fire({
        title: ' <h5>Are you sure!</h5>',
        html: ' <p class="card-text font-small-3">Before releasing the Bitcoin, be sure to check your balance to confirm that you’ve received your money. Once you\'ve released your funds, the transaction is final. If you have any issues, click Back, start a dispute and well join in to help.</p>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2746e4',
        cancelButtonColor: '#E42728',
        cancelButtonText: 'Go back',
        confirmButtonText:
          '<i class="fa fa-ban"></i> RELEASE BTC',
        confirmButtonAriaLabel: 'CANCEL',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1'
        }
      }).then(async (result) => {
        if (result.value) {
          let user = JSON.parse(localStorage.getItem('user'))
          const headerDict = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            token: user.token,
            username: user.username
          }
          const requestOptions = {
            headers: new Headers(headerDict),
          };
          await fetch('https://api.coinlif.com/api/coin/v1/releaseCrypto/' + id, requestOptions).then((response) => {
            console.log(response);
            if (!response.ok) {

              throw new Error(response.statusText);
            } else {
              this.status = "SUCCESSFUL"
              this.toast('Congratulations', '👋 You just sold BTC. If you wish to trade again you must open a trade, so that we reserve an escrow for safe payments', 'success')
              this.playAudio('assets/sounds/turumturum.wav')
            }
          }).catch((error) => {
            this.toast('Ops', '👋 An error happened try again', 'error')

          })
        }
      });
    } else {
      this.toast('INVALID', 'You cant do that', 'error')
    }

  }

  open_dispute(id) {
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2'],
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    })
      .queue([
        {
          title: 'Reason',
          text: 'Enter a brief explanation'
        },
        {
          title: 'Explain',
          text: 'Tell us briefly what happened'
        },

      ])
      .then(function (result) {
        if ((<HTMLInputElement>result).value) {
          console.log((<HTMLInputElement>result).value);
          let reason = (<HTMLInputElement>result).value[0]
          let explanation = (<HTMLInputElement>result).value[1]
          console.log(reason + ": " + explanation)
          Swal.fire({
            title: 'DISPUTE OPEN',
            html: 'Provide the moderator with as much information and evidence as you can. Check your email for details on how to win. Well be joining you shortly to help you',
            confirmButtonText: 'OKAY',
            customClass: {confirmButton: 'btn btn-primary'}
          })

        }
      });

  }

  view_offer(idd: any) {
    window.location.href = '/offers/bitcoin/details/' + idd

  }

  private toast(title: string, message: string, type: string) {
    if (type == 'success') {
      this.toastr.success(message, title, {
        toastClass: 'toast ngx-toastr',
        timeOut: 5000,
        closeButton: true,
        positionClass: 'toast-top-right',
        progressBar: true
      });
    } else {
      this.toastr.error(message, title, {
        toastClass: 'toast ngx-toastr',
        timeOut: 5000,
        closeButton: true,
        positionClass: 'toast-top-right',
        progressBar: true
      });

    }

  }
}
