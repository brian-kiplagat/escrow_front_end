import { Email } from 'app/main/apps/email/email.model';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseService } from 'app/services/firebase.service';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  // Public
  public apiData = [];
  public onApiDataChange: BehaviorSubject<any>;
  public user:any ={}
  public currentUser:any={}

  /**
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient,private router:Router,private fb:FirebaseService) {
    this.onApiDataChange = new BehaviorSubject('');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fb.getUser(this.user.username,this.user.token).subscribe((data: any) => {
    
     this.currentUser =data.responseMessage?.user_data[0];
     console.log(this.currentUser);
    
   },(error)=>{
     console.log(error)
     this.router.navigate(['/'])
   });
   this.getNotificationsData(this.user.username,this.user.token);
  }

  /**
   * Get Notifications Data
   */
  getNotificationsData(username:string,token:string): Promise<any[]> {
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'token': token,
      'username': username,

    }
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    return new Promise((resolve, reject) => {
      this._httpClient.get('https://api.supabeta.com/api/coin/v1/fetchNotifications',requestOptions).subscribe((response: any) => {
        this.apiData = response.responseMessage;
        this.onApiDataChange.next(this.apiData);
        console.log(this.apiData)
        resolve(this.apiData);
      }, (error)=>{
        console.log(error)
        reject
      });
    });
  }
}
