import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {ChatService} from 'app/main/apps/chat/chat.service';
import {GlobalConfig, ToastrService} from 'ngx-toastr';
import Swal from "sweetalert2";
import {Subscription} from "rxjs";
import {environment} from "../../../../../../environments/environment";
import {FirebaseService} from "../../../../../services/firebase.service";
import {ActivatedRoute} from "@angular/router";
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html'
})
export class ChatSidebarComponent implements OnInit, OnChanges {
  @Input() trade: any;
  @Input() currentUser: any;
  @Input() partner_data: any;
  // Public
  public searchText;
  public selectedIndex = null;
  public userProfile;
  private options: GlobalConfig;
  public user: any = {}
  public storage: any;

  //TIMER
  countDown: Subscription;
  counter;//1800
  tick = 1000;
  public minutes;
  public seconds
  //TIMER
  public mmss: string = "00:00";
  public reopenErr: any;
  public CHECK_POSITIVE: boolean;
  public CHECK_NEGATIVE: boolean;
  public PARTNER_FLAG: boolean;
  public feed_success: any;
  public feed_error
  public partner_comment = ' No comment yet';
  public my_comment = '';

  /**
   * Constructor
   *
   * @param route
   * @param fb
   * @param {ChatService} _chatService
   * @param {CoreSidebarService} _coreSidebarService
   * @param toastr
   */
  constructor(private route: ActivatedRoute, private fb: FirebaseService, private _chatService: ChatService, private _coreSidebarService: CoreSidebarService, private toastr: ToastrService) {
    this.options = this.toastr.toastrConfig;
  }

  showDialog(message, title) {
    Swal.fire({
      title: ' <h5>' + title + '</h5>',
      html: '<p class="card-text font-small-3">' + message + '</p>',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#2746e4',
      confirmButtonText:
        'OK THANKS',
      customClass: {
        confirmButton: 'btn btn-primary'
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.trade == null) {
      this.showDialog('We could not get this trade', 'Trade not found')

    }
    //Get the future date of expiry
    //Get the current time
    //Count down the difference
    //Prevent interval from running if the trade has expired i.e count < o
    //Only run interval for open trades

    let future = new Date(this.trade.created_at).getTime() + 1800000
    let count = future - new Date().getTime();
    this.mmss = new Date(count).toISOString().substr(14, 5);
    //console.log(this.mmss,count)

    if (count >= 0 && this.trade.status == 'OPENED'){
      let interval = setInterval(() => {
        count -= 1000;
        this.mmss = new Date(count).toISOString().substr(14, 5);
        console.log('minutes remaining:',count/60000)
        //The trade has just expired
        if (count/60000 <= 0) {
          clearInterval(interval);
          console.log('cleared timer interval')
          this.mmss = '00:00'
          this.fb.playAudio('assets/sounds/windows_warning.wav')

        }
        //The trade has 5 minutes remaining
        if (this.mmss === "05:00") {
          this.showDialog('You have 5 minutes remaining. This trade will expire soon and the trade will be automatically cancelled. If you have not sent the money please be quick, send the money and confirm it by clicking the PAID button', 'Trade about to expire')
          this.fb.playAudio('assets/sounds/tirit.wav')
        }
        //The trade has 2 minutes remaining
        if (this.mmss === "02:00") {
          this.showDialog('You have 2 minutes remaining. If you have sent the money please confirm it by clicking the PAID button otherwise the trade will be automatically cancelled and the crypto returned to the seller', 'Time is running out')
          this.fb.playAudio('assets/sounds/tirit.wav')
        }

      }, 1000);

    }


    if (this.trade[1][this.partner_data.username] != null) {
      this.partner_comment = ' ' + this.trade[1][this.partner_data.username]['comment']
      if (this.trade[1][this.partner_data.username]['flag'] == 'POSITIVE') {
        this.PARTNER_FLAG = true;
      } else {
        this.PARTNER_FLAG = false;
      }
    }
    if (this.trade[1][this.storage.username] != null) {
      this.my_comment = this.trade[1][this.storage.username]['comment']
      if (this.trade[1][this.storage.username]['flag'] == 'POSITIVE') {
        this.CHECK_POSITIVE = true;
        this.CHECK_NEGATIVE = false;

      } else {
        this.CHECK_POSITIVE = false;
        this.CHECK_NEGATIVE = true;
      }


    }


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

  ngOnInit(): void {
    this.storage = JSON.parse(localStorage.getItem('user'));
    this.openChat(1);//1


  }

  mark_paid = async (id: any) => {
    if (this.trade.buyer !== this.storage.email) {
      this.fb.playAudio('assets/sounds/windows_warning.wav');
      this.toast('Invalid Action', 'You cant do that', 'error');
      return;
    }

    this.fb.playAudio('assets/sounds/windows_warning.wav');

    const swalResult = await Swal.fire({
      title: '<h5>Are you sure?</h5>',
      html: '<p class="card-text font-small-3">You must ensure that you have sent the money first before clicking this button. Providing false information or coinlocking will cause your account to be banned</p>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      cancelButtonColor: '#E42728',
      confirmButtonText: '<i class="fa fa-check-circle"></i> Confirm Payment',
      confirmButtonAriaLabel: 'Confirm',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    });

    if (!swalResult.isConfirmed) {
      return; // User clicked "Cancel" or closed the dialog
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: user.token,
      username: user.username
    };

    const requestOptions = {
      headers: new Headers(headerDict),
      method: 'POST',
      body: JSON.stringify({
        id: id
      })
    };

    try {
      const response = await fetch(`${environment.endpoint}/markPaid`, requestOptions);

      if (!response.ok) {
        this.toast('FAILED', '👋 Seems an error happened. Please try again', 'error');
        return;
      }

      this.trade.status = 'PAID';
      this.toast('Great', '👋 You just confirmed your payment. It\'s now the seller\'s turn to send the Bitcoin', 'success');
      this.fb.playAudio('assets/sounds/tirit.wav');
    } catch (error) {
      this.toast('Ops', '👋 An error happened. Try again', 'error');
    }
  };


  cancel_trade = async (id: any) => {
    if (this.trade.buyer !== this.storage.email) {
      this.toast('Invalid Action', 'You cant do that', 'error');
      return;
    }

    this.fb.playAudio('assets/sounds/windows_warning.wav');

    const swalResult = await Swal.fire({
      title: '<h5>Hey Wait!</h5>',
      html: '<p class="card-text font-small-3">Stay on this trade if you\'ve already made this payment. For any other issues, click Back and start a dispute.</p>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2746e4',
      cancelButtonColor: '#E42728',
      cancelButtonText: 'Go back',
      confirmButtonText: '<i class="fa fa-ban"></i> CANCEL TRADE',
      confirmButtonAriaLabel: 'GO BACK',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    });

    if (!swalResult.isConfirmed) {
      return; // User clicked "Go back" or closed the dialog
    }


    const user = JSON.parse(localStorage.getItem('user'));
    const headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: user.token,
      username: user.username
    };

    const requestOptions = {
      headers: new Headers(headerDict),
      method: 'POST',
      body: JSON.stringify({
        id: id
      })
    };

    try {
      const response = await fetch(`${environment.endpoint}/cancelTrade`, requestOptions);

      if (!response.ok) {
        this.toast('Failed', '👋 An error happened. Please try again', 'error');
        return;
      }

      this.trade.status = 'CANCELLED_BUYER';
      this.toast('Cancelled', '👋 You just cancelled this trade. If you wish to trade again, you must open a new trade to reserve escrow for safe payments', 'success');
      this.fb.playAudio('assets/sounds/turumturum.wav');
    } catch (error) {
      this.toast('Ops', '👋 An error happened. Try again', 'error');
    }
  };


  okSendCrpto(otp: string, id: any) {
    let user = JSON.parse(localStorage.getItem('user'))
    const headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: user.token,
      username: user.username
    }
    const requestOptions = {
      headers: new Headers(headerDict),
      method: 'POST',
      body: JSON.stringify({
        "email": user.email,
        "id": id,
        "otp": otp
      })

    };
    return fetch(`${environment.endpoint}/releaseCrypto`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
        if (result.status == true) {
          this.trade.status = "SUCCESSFUL"
          this.toast('Congratulations', '👋 You just sold BTC. If you wish to trade again you must open a trade, so that we reserve an escrow for safe payments', 'success')
          this.fb.playAudio('assets/sounds/turumturum.wav')
        } else {
          this.toast('Failed', '👋 ' + result.responseMessage, 'error')
          return
        }
      })
      .catch((error) => {
        console.log(error)
        this.toast('Ops', '👋 An error happened try again', 'error')

      })

  }

  release_btc = async (id: any) => {

    if (this.trade.seller !== this.storage.email) {
      this.toast('INVALID', 'You cant do that', 'error');
      return;
    }

    this.fb.playAudio('assets/sounds/windows_warning.wav');

    if (this.trade[0].seller_2fa === '2FA' && this.trade[0].seller_2fa_status === 1) {
      console.log('Show 2fa dialog');

      const fireSwal = (option: string, title: string, msg: string) => {
        Swal.fire({
          title: title,
          html: msg,
          icon: 'error',
          confirmButtonText: 'OKAY',
          customClass: { confirmButton: 'btn btn-primary' },
        });
      };

      const result = await Swal.mixin({
        input: 'text',
        confirmButtonText: 'SEND BITCOIN',
        showCancelButton: true,
        progressSteps: ['1', '2'],
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1',
        },
      }).queue([
        {
          title: '<h5>Are you sure!</h5>',
          html:
            '<p class="card-text font-small-3">Before releasing the Bitcoin, check your balance to confirm that you’ve actually received your money. Once you release BTC, the transaction is final. </p>' +
            '<p class="card-text font-small-3">Enter your 2FA Code to authorize this transaction</p>',
        },
      ]);

      const otp = (<HTMLInputElement>result).value[0];

      if (!otp) {
        fireSwal(
          'error',
          'OTP REQUIRED',
          'Please input the 2FA Code. Get your code from Authy or Google Authenticator to authorize this action'
        );
      } else if (otp.length > 6) {
        fireSwal('error', 'OTP TOO LONG', 'Your 2FA code cannot be longer than 6 numbers. Get your code from Authy or Google Authenticator');
      } else if (otp.length < 6) {
        fireSwal('error', 'OTP TOO SHORT', 'Your 2FA code cannot be shorter than 6 numbers. Get your code from Authy or Google Authenticator');
      } else if (!/^\d+$/.test(otp)) {
        fireSwal('error', 'OTP MUST BE A NUMBER', 'Your 2FA code must be a 6-digit number. Get your code from Authy or Google Authenticator');
      } else {
        await this.okSendCrpto(otp, id);
      }
    } else {
      const result = await Swal.fire({
        title: ' <h5>Are you sure!</h5>',
        html: `<p class="card-text font-small-3">Before releasing the Bitcoin, check your balance to confirm that you’ve actually received your money. Once you release BTC, the transaction is final. </p>
                <p class="card-text font-small-3">Enter your 2FA Code to authorize this transaction</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2746e4',
        cancelButtonColor: '#E42728',
        cancelButtonText: 'Go back',
        confirmButtonText: '<i class="fa fa-ban"></i> RELEASE BTC',
        confirmButtonAriaLabel: 'CANCEL',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1',
        },
      });

      if (result.value) {
        await this.okSendCrpto('', id);
      }
    }
  };

  open_dispute = async (id: any) => {
    this.fb.playAudio('assets/sounds/windows_warning.wav');

    try {
      const result = await Swal.mixin({
        input: 'text',
        confirmButtonText: 'Next &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2'],
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1'
        }
      }).queue([
        {
          title: 'Reason',
          text: 'Why open this dispute?'
        },
        {
          title: 'Explain',
          text: 'Tell us briefly what happened'
        }
      ]) as any;

      if (result.value) {
        const [reason, explanation] = result.value;

        const user = JSON.parse(localStorage.getItem('user'));
        const headerDict = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          token: user.token,
          username: user.username
        };

        const requestOptions = {
          headers: new Headers(headerDict),
          method: 'POST',
          body: JSON.stringify({
            requestId: uuidv4() + Math.round(new Date().getTime() / 1000).toString(),
            email: user.email,
            tradeId: id,
            reason,
            explanation
          })
        };

        const response = await fetch(`${environment.endpoint}/openDispute`, requestOptions);
        const data = await response.json();

        if (data.status) {
          Swal.fire({
            title: 'DISPUTE STARTED',
            html: `<p style="text-align: start;" class="card-text text-body-heading">Provide the moderator with as much information and evidence as you can, which could be any of the following:</p>
            <p style="text-align: start;" class="card-text font-small-3 text-start">1. Transaction receipt.</p>
            <p style="text-align: start;" class="card-text font-small-3 text-start">2. Screenshot of payment confirmation.</p>
            <p style="text-align: start;" class="card-text font-small-3 text-start">3. Video or screen recording of payment being made.</p>
            <p style="text-align: start;" class="card-text font-small-3 text-start">4. Proof of ownership receipts online and offline in transactions involving gift cards.</p>`,
            confirmButtonText: 'OKAY',
            customClass: { confirmButton: 'btn btn-primary' }
          });
          console.log(data.responseMessage);
        } else {
          console.log('ops', data.responseMessage);
          Swal.fire({
            title: 'Whoops!',
            icon: 'warning',
            html: `<p class="card-text font-small-3">${data.responseMessage}</p>`,
            confirmButtonText: 'OKAY',
            customClass: { confirmButton: 'btn btn-primary' }
          });
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };


  view_offer(idd: any) {
    window.location.href = '/offers/bitcoin/details/' + idd

  }

  reopen_trade = async (tradeId: any) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (this.trade.seller != this.storage.email){
      this.fb.playAudio('assets/sounds/windows_warning.wav');
      this.toast('Invalid Action', 'Only the seller can reopen a trade', 'error');
      return

    }
    try {
      const result = await Swal.fire({
        title: '<h5>Reopen this trade?</h5>',
        html: '<p class="card-text font-small-3">This will reopen the trade and escrow will be reserved so that payments can be made safely.</p>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7367F0',
        cancelButtonColor: '#E42728',
        confirmButtonText: '<i class="fa fa-check-circle"></i> Reopen Trade',
        confirmButtonAriaLabel: 'Confirm',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1'
        }
      });

      if (result.value) {
        const headerDict = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          token: user.token,
          username: user.username
        };

        const requestOptions = {
          headers: new Headers(headerDict),
          method: 'POST',
          body: JSON.stringify({
            requestId: uuidv4() + Math.round(new Date().getTime() / 1000).toString(),
            email: user.email,
            tradeId: tradeId
          })
        };

        const response = await fetch(`${environment.endpoint}/reopenTrade`, requestOptions);
        const data = await response.json();

        if (data.status) {
          console.log(data.responseMessage);
          this.trade.status = 'OPENED';
          this.fb.playAudio('assets/sounds/turumturum.wav');
        } else {
          this.reopenErr = data.responseMessage;
          this.fb.playAudio('assets/sounds/windows_warning.wav');
          return;
        }
      }
    } catch (error) {
      console.log(error);
      this.toast('Ops', '👋 An error happened, try again', 'error');
    }
  };


  submit_feedback = async (tradeId: any, partner_data: any) => {
    const comment = (document.getElementById("email-id-icon") as HTMLInputElement)?.value;
    let type;

    if (this.CHECK_NEGATIVE) {
      type = 'NEGATIVE';
    } else if (this.CHECK_POSITIVE) {
      type = 'POSITIVE';
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: user.token,
      username: user.username
    };

    const requestOptions = {
      headers: new Headers(headerDict),
      method: 'POST',
      body: JSON.stringify({
        requestId: uuidv4() + Math.round(new Date().getTime() / 1000).toString(),
        feedback_type: type,
        trade_id: tradeId,
        comment: comment,
        target: partner_data.username
      })
    };

    try {
      const response = await fetch(`${environment.endpoint}/postFeedback`, requestOptions);
      const result = await response.json();

      if (result.status) {
        this.feed_success = result.responseMessage;
        this.feed_error = null;
        this.fb.playAudio('assets/sounds/turumturum.wav');
      } else {
        this.feed_error = result.responseMessage;
        this.feed_success = null;
        this.fb.playAudio('assets/sounds/windows_warning.wav');
        return;
      }
    } catch (error) {
      this.feed_error = 'An error happened, consult admin';
      console.log(error);
      this.toast('Ops', '👋 An error happened, try again', 'error');
    }
  };


  onRadioChange(e, type) {
    //console.log(e)
    if (e.target.checked) {
      if (type == 'POSITIVE') {
        this.CHECK_POSITIVE = true;
        this.CHECK_NEGATIVE = false;
      } else if (type == 'NEGATIVE') {
        this.CHECK_POSITIVE = false;
        this.CHECK_NEGATIVE = true;
      }

    }
  }

}
