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

  constructor(private fb: FirebaseService, private firestore: AngularFirestore,private router: Router) {
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    let user: any = JSON.parse(localStorage.getItem('user'))
    this.fb.retrieveNotifications(user.email, user.username).subscribe((data: any) => {
      this.notifications = data;
      this.notifications.sort(function (x, y) {
        return y.timestamp - x.timestamp;
      })
      if (this.notifications[0].read == false) {
        //console.log('Play sound')
        if (this.notifications[0].heading == 'Escrow funded') {
          if (localStorage.getItem('sound') == 'yes') {
            this.playAudio('assets/sounds/turumturum.wav')
          }

        } else if (this.notifications[0].heading == 'New Login') {
          if (localStorage.getItem('sound') == 'yes') {
            this.playAudio('assets/sounds/windows_warning.wav')
          }
        } else if (this.notifications[0].heading == 'New Trade message') {
          if (localStorage.getItem('sound') == 'yes') {
            this.playAudio('assets/sounds/tirit.wav')
          }
        }
      }
      this.count = this.notifications.filter(obj => obj.read == false).length
      this.notifications = this.notifications.slice(0, 15)
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
    this.notifications.filter(obj => {
      if (obj.read == false) {
        this.firestore.collection('notifications').doc(obj.id).update({read: true});

      }
    })

  }

  redirect(resource_path: any) {
    this.router.navigate(['/' + resource_path])
  }
}
