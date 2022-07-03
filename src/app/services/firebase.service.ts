import {Injectable} from '@angular/core';
import {initializeApp} from 'firebase/app';
import {environment} from 'environments/environment';
import {getFirestore, collection, getDocs} from 'firebase/firestore/lite';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/compat/auth';

import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Subject, Observable, throwError, from} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  signuperror: string = 'kiplagatbrian18@gmail.com';
  loginerror: string = '';
  userData: any = {};
  signuperrorChange: Subject<string> = new Subject<string>();
  userDataChange: Subject<any> = new Subject<any>();
  loginerrorChange: Subject<string> = new Subject<string>();
  headerDict = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  constructor(
    private router: Router,
    public auth: AngularFireAuth,
    private http: HttpClient,
    private firestore: AngularFirestore
  ) {
    this.signuperrorChange.subscribe((value) => {
      this.signuperror = value;
    });
    this.loginerrorChange.subscribe((value) => {
      this.loginerror = value;
    });
    this.userDataChange.subscribe((value) => {
      this.userData = value;
    });
  }

  // public methods

  //login
  login(email: string, password: string) {
    const requestOptions = {
      headers: new HttpHeaders(this.headerDict)
    };
    return this.http.post(
      'https://api.coinlif.com/api/coin/v1/loginUser',
      {
        email: email,
        password: password
      },
      requestOptions
    );
  }

  //logout
  async logout() {
    this.router.navigate(['/pages/login']);
    localStorage.clear()
  }

  // reset password
  forgotPassword(email: string) {
    return this.http
      .post('http://localhost/coinlifapi/api/coin/v1/forgotPassword', {
        email: email
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  //create new user then login
  registration(email: string, password: string) {
    const requestOptions = {
      headers: new HttpHeaders(this.headerDict)
    };
    return this.http.post(
      'https://api.coinlif.com/api/coin/v1/registerUser',
      {
        email: email,
        password: password
      },
      requestOptions
    );
  }

  //get user by username
  getUser(username: string, token: string) {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: token,
      username: username
    };
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    return this.http.get(
      'https://api.coinlif.com/api/coin/v1/getUserDataByUsername/' + username,
      requestOptions
    );
  }
  //get user by mail
  getUserByMail(email: string,token: string,username: string,) {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: token,
      username: username,
    };
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    return this.http.get(
      'https://api.coinlif.com/api/coin/v1/getUserDataByEmail/' + email,
      requestOptions
    );
  }

  //get packages
  getPackages(token: string,username: string,email:string) {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: token,
      username: username,
    };
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    return this.http.get(
      'https://api.coinlif.com/api/coin/v1/getPackages/'+email,
      requestOptions
    );
  }

  // get notifications
  getNotifications(username: string, token: string) {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: token,
      username: username
    };
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    return this.http.get(
      'https://api.coinlif.com/api/coin/v1/fetchNotifications',
      requestOptions
    );
  }

  // get applications
  createOffer(token: string, username: string, formData: any) {
    const header = {
      'Content-Type': 'application/json',
      Accept: '*/*',
      token: token,
      username: username
    };
    const body = JSON.stringify(formData);
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    console.log(token, username, formData);
    return this.http.post('https://api.coinlif.com/api/coin/v1/createOffer', formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }

  // get currencies
  getCurrency(username: string, token: string) {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: token,
      username: username
    };
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    return this.http.get('https://api.coinlif.com/api/coin/v1/getCurrency', requestOptions);
  }

  // get offer tags
  getTags(username: string, token: string) {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: token,
      username: username
    };
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    return this.http.get('https://api.coinlif.com/api/coin/v1/getTags', requestOptions);
  }

  // retrieve list of feeds
  async retrieve(colletion: string) {
    const feedsCol = collection(this.db, colletion);

    const feedsSnapshot = await getDocs(feedsCol);
    return feedsSnapshot.docs;
  }

  // get offers
  getOffers(username: string, token: string, type: string) {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: token,
      username: username
    };
    const body = {
      type: type
    };
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    return this.http.post(
      'https://api.coinlif.com/api/coin/v1/getOffers',
      body,
      requestOptions
    );
  }

  // get offers
  getTradeByID(username: string, token: string, id: string) {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: token,
      username: username
    };
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    return this.http.get(
      'https://api.coinlif.com/api/coin/v1/' + id + '/fetchTradeId',
      requestOptions
    );
  }

  //get offerinformation
  getInfo(username: string, token: string, id: string) {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: token,
      username: username
    };
    const requesturl = 'https://api.coinlif.com/api/coin/v1/getOfferInfo/' + id;
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    return this.http.get(requesturl, requestOptions);
  }

  //open trade
  openTrade(username: string, token: string, data: any) {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: token,
      username: username
    };

    console.log(data);
    const requestOptions = {
      headers: new HttpHeaders(header)
    };

    return this.http.post(
      'https://api.coinlif.com/api/coin/v1/openTrade',
      data,
      requestOptions
    );
  }

  //invest trade
  investPackage(username: string, token: string, data: any) {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: token,
      username: username
    };

    console.log(data);
    const requestOptions = {
      headers: new HttpHeaders(header)
    };

    return this.http.post(
      'https://api.coinlif.com/api/coin/v1/invest',
      data,
      requestOptions
    );
  }

  getProfile() {
    var data: any = new FormData();
    data.append('username', 'MurderouLlipa455');
    data.append('key', 'kwdmcpmpmwsx');
    data.append('secret', 'kxpwcnmpwcmcpc');

    return this.http.post('https://coinlif.com/api/coin/getProfileData.php', data);
  }

  //chat logic
  createChat() {
  }

  //send message
  async sendMessage(data: any) {
    console.log(data);
    this.firestore.collection('trades').doc(data.tradeId.toString()).collection('chats').add({
      senderId: data.senderId,
      message: data.message,
      time: Date.now()
    });
  }

  //retrieve all messages
  retrieveMessage(docId: string) {
    let messages = this.firestore
      .collection('trades')
      .doc(docId.toString())
      .collection('chats', (ref) => ref.orderBy('time')).valueChanges()
      ;

    return messages;
  }
  getUserForProfile(userIdFromRoute: string, token: string, username: string) {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: token,
      username: username
    };
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    return this.http.get(
      'https://api.coinlif.com/api/coin/v1/getUserDataByUsername/' + userIdFromRoute,
      requestOptions
    );
  }
  // get applications
  blockNow(token: string, username: string, formData: any) {

       return this.http.post('https://api.coinlif.com/api/coin/v1/blockUser', formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }

  // get applications
  set2FAAuth(token: string, username: string, formData: any) {

    return this.http.post('https://api.coinlif.com/api/coin/v1/set2FA', formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }

  settoogle2FA(token: string, username: string, formData: any) {
    return this.http.post('https://api.coinlif.com/api/coin/v1/set2FA', formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }

  updateProfile(token, username, formData: any) {
    return this.http.post('https://api.coinlif.com/api/coin/v1/updateProfile', formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }
  setChangePaswordInApp(token, username, formData: any) {
    return this.http.post('https://api.coinlif.com/api/coin/v1/changePasswordInApp', formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }
  resetProfile(token: string, username: string) {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: token,
      username: username
    };
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    return this.http.get(
      'https://api.coinlif.com/api/coin/v1/resetProfile/' + username,
      requestOptions
    );
  }
  sendCrypto(token, username, formData: any) {
    return this.http.post('https://api.coinlif.com/api/coin/v1/sendCrypto', formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }
}
