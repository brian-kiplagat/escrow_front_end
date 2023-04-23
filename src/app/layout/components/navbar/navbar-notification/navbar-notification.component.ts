import {FirebaseService} from 'app/services/firebase.service';
import {Component, OnInit} from '@angular/core';
import {switchMap} from "rxjs/operators";
import {Subject} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";


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
  public notifications: any[] = [];
  public count;

  constructor(private fb: FirebaseService, private firestore: AngularFirestore, private router: Router) {
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    let user: any = JSON.parse(localStorage.getItem('user'))
    this.fb.retrieveNotifications(user.username).subscribe((data: any) => {
      this.notifications = data;
      console.log('New notification received:', data);
      if (this.notifications[0].read == false) {
        this.fb.playAudio('assets/sounds/turumturum.wav')
        if (this.notifications[0].heading == 'Escrow funded') {
          this.fb.playAudio('assets/sounds/turumturum.wav')
        } else if (this.notifications[0].heading == 'New Login') {
          this.fb.playAudio('assets/sounds/windows_warning.wav')
        } else if (this.notifications[0].heading == 'New Trade message') {
          this.fb.playAudio('assets/sounds/tirit.wav')
        }
      }
      this.count = this.notifications.filter(obj => obj.read == false).length

    }, error => {
      console.log(error)
    });


  }


  mark_read() {
    this.notifications.filter(obj => {
      if (obj.read == false) {
        this.firestore.collection('notifications').doc(obj.id).update({read: true});

      }
    })

  }

  redirect(resource_path: any) {
    this.router.navigate(['/' + resource_path])
  }

  getFeatherIcon(message) {
    const heading = message?.heading || '';
    if (heading.includes('cancelled')) {
      return 'x';
    }
    if (heading.includes('Dispute')) {
      return 'gitlab';
    } if (heading === 'Feedback Updated') {
      return 'edit';
    }
    if (message.text.includes('Positive')) {
      return 'thumbs-up';
    }
    if (message.text.includes('Negative')) {
      return 'thumbs-down';
    }
    if (heading.includes('Paid')) {
      return 'check';
    }
    if (heading.includes('expired')) {
      return 'x-circle';
    }
    if (heading === 'Password Changed') {
      return 'alert-circle';
    }

    if (heading === 'You bought Bitcoin') {
      return 'dollar-sign';
    }
    if (heading === 'New Profile View') {
      return 'user';
    }
    if (heading === 'New Trade message') {
      return 'message-circle';
    }
    if (heading === 'New Login') {
      return 'alert-triangle';
    }
    if (heading === 'You sold Bitcoin') {
      return 'check-circle';
    }
    if (heading === 'Escrow funded') {
      return 'shield';
    }
    if (heading === 'Bitcoin Sent') {
      return 'dollar-sign';
    }
    if (heading === 'Bitcoin Received') {
      return 'dollar-sign';
    }

    return 'bell';
  }

  getBackgroundClass(message) {

    const heading = message?.heading || '';
    if (heading.includes('cancelled')) {
      return 'bg-light-danger';
    }
    if (heading.includes('Dispute')) {
      return 'bg-light-info';
    }
    if (message.text.includes('Positive')) {
      return 'bg-light-success';
    }
    if (message.text.includes('Negative')) {
      return 'bg-light-danger';
    }
    if (heading.includes('paid')) {
      return 'bg-light-info';
    }
    if (heading.includes('expired')) {
      return 'bg-light-danger';
    }
    if (heading === 'Password Changed') {
      return 'bg-light-danger';
    }

    if (heading === 'You bought Bitcoin') {
      return 'bg-light-success';
    }
    if (heading === 'New Profile View') {
      return 'bg-light-success';
    }
    if (heading === 'New Trade message') {
      return 'bg-light-info';
    }
    if (heading === 'New Login') {
      return 'bg-light-danger';
    }
    if (heading === 'You sold Bitcoin') {
      return 'bg-light-success';
    }
    if (heading === 'Escrow funded') {
      return 'bg-light-primary';
    }
    if (heading === 'Bitcoin Sent') {
      return 'bg-light-primary';
    }
    if (heading === 'Bitcoin Received') {
      return 'bg-light-success';
    }
    if (heading === 'Bitcoin Incoming') {
      return 'bg-light-warning';
    }
    if (heading === 'Feedback Updated') {
      return 'bg-light-info';
    }
    return 'bg-light-success';
  }

}
