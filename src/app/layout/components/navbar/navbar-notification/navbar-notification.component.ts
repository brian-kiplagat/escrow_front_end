import { FirebaseService } from 'app/services/firebase.service';
import { Component, OnInit } from '@angular/core';


// Interface
interface notification {
  messages: [];
  systemMessages: [];
  system: Boolean;
}

@Component({
  selector: 'app-navbar-notification',
  templateUrl: './navbar-notification.component.html'
})
export class NavbarNotificationComponent implements OnInit {
  // Public
  public notifications: any[]=[];

  constructor(private fb:FirebaseService) {}

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    let user:any = JSON.parse(localStorage.getItem('user'))
   
    this.fb.getNotifications(user.username,user.token).subscribe((data:any)=>{
      this.notifications =data.responseMessage
      console.log(this.notifications)
    },(err)=>{
      console.log(err)
    })
  }
}
