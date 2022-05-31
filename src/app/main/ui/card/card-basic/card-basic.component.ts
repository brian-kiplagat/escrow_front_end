import {
  Component,
  OnInit
} from '@angular/core';

import {FirebaseService} from "../../../../services/firebase.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-basic-card',
  templateUrl: './card-basic.component.html'
})
export class CardBasicComponent implements OnInit {
  // public
  public contentHeader: object;
  public user: any = {}
  public currentUser: any = {}
  public withdrawal_tx: any = []
  public deposit_tx: any = []

  constructor(private fb: FirebaseService, private router: Router) {
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this.contentHeader = {
      headerTitle: 'My wallet',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Send and Receive BTC',
            isLink: true,
            link: '/'
          }
        ]
      }
    };
    this.user = JSON.parse(localStorage.getItem('user'))
    this.fb.getUser(this.user.username, this.user.token).subscribe((data: any) => {
      this.currentUser = data.responseMessage?.user_data[0]
      this.deposit_tx = data.responseMessage?.deposit_tx
      this.withdrawal_tx = data.responseMessage?.withdrawal_tx
    }, (error) => {
      console.log(error)
      this.router.navigate(['/'])
    });


  }
}
