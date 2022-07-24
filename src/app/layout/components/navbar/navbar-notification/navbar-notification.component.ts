import {FirebaseService} from 'app/services/firebase.service';
import {Component, OnInit} from '@angular/core';
import {switchMap} from "rxjs/operators";
import {Subject} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";


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

  constructor(private fb: FirebaseService, private firestore: AngularFirestore) {
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    let user: any = JSON.parse(localStorage.getItem('user'))
    this.fb.retrieveNotifications(user.email, user.username).subscribe((data: any) => {
      console.log(data)
      this.notifications = data;
      this.count = this.notifications.filter(obj => obj.read == false).length
      this.notifications.sort(function (x, y) {
        return y.timestamp - x.timestamp;
      })
      if (this.notifications[0].read == false) {
        //console.log('Play sound')
        if (this.notifications[0].heading == 'Escrow funded') {
          this.playAudio('assets/sounds/turumturum.wav')

        } else if (this.notifications[0].heading == 'New Login') {
          this.playAudio('assets/sounds/windows_warning.wav')
        } else if (this.notifications[0].heading == 'New Trade message') {
          this.playAudio('assets/sounds/tirit.wav')
        }
      }
    }, error => {
      console.log(error)
    });


  }

  playAudio(path) {
    let audio = new Audio();
    audio.src = path;
    audio.load();
    audio.play();
  }

  mark_read() {

  }
}
