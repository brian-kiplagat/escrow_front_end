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
    console.log(this.user)
    this.fb.getUser(this.user.username,this.user.token).subscribe((data: any) => {
     console.log(data.responseMessage);
     this.currentUser =data.responseMessage?.user_data[0];
   },(error)=>{
     console.log(error)
     this.router.navigate(['/'])
   });
    this.getNotificationsData(this.currentUser.username,this.currentUser.email,this.currentUser.token);
  }

  /**
   * Get Notifications Data
   */
  getNotificationsData(username:string,email:string,token:string): Promise<any[]> {
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'token': token,
      'username': username,
      'email':email

    }
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    return new Promise((resolve, reject) => {
      this._httpClient.get('https://api.coinpes.cash/api/coin/v1/fetchNotifications',requestOptions).subscribe((response: any) => {
        this.apiData = response;
        this.onApiDataChange.next(this.apiData);
        console.log(response)
        resolve(this.apiData);
      }, (error)=>{
        console.log(error)
        reject
      });
    });
  }
}
