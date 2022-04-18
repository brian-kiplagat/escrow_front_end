import { Component, ViewEncapsulation,OnInit } from '@angular/core';
import { FirebaseService } from 'app/services/firebase.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'chat-application' }
})
export class ChatComponent implements OnInit {
  constructor(private fb : FirebaseService){

   
  }
  ngOnInit():void{
  }
}
