import {Injectable} from '@angular/core';
import {initializeApp} from 'firebase/app';
import {environment} from 'environments/environment';
import {collection, getDocs, getFirestore} from 'firebase/firestore/lite';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/compat/auth';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  signuperror: string = '';
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
      `${environment.endpoint}/loginUser`,
      {
        email: email,
        password: password
      },
      requestOptions
    );
  }

  //logout
  async logout(token: string, username: string, email: string) {
    let formData: any = {
      token: token,
      email: email,
      username: username
    };
    console.log(formData)
    return this.http.post(
      `${environment.endpoint}/logout`,
      formData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: '*/*',
          token: token,
          username: username

        })
      });
  }

  // reset password
  forgotPassword(email: string) {
    return this.http
      .post(`${environment.endpoint}/forgotPassword`, {
        email: email
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  //create new user then login
  registration(email: string, password: string,referral:string) {
    const requestOptions = {
      headers: new HttpHeaders(this.headerDict)
    };
    return this.http.post(
      `${environment.endpoint}/registerUser`,
      {
        email: email,
        password: password,
        referral:referral
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
      `${environment.endpoint}/getUserDataByUsername/` + username,
      requestOptions
    );
  }


  //get user by username
  getUsersWithOffers(token, username) {
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
      `${environment.endpoint}/getUsersWithOffers`,
      requestOptions
    );
  }


  //get packages
  getPackages(token: string, username: string, email: string) {
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
      `${environment.endpoint}/getPackages/` + email,
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
      `${environment.endpoint}/fetchNotifications`,
      requestOptions
    );
  }

  // get applications
  createOffer(token: string, username: string, formData: any) {
    return this.http.post(`${environment.endpoint}/createOffer`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }

  //edit offer
  editOffer(token: string, username: string, formData: any) {
    console.log(formData);
    return this.http.post(`${environment.endpoint}/offer/update`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }

  // get currencies
  getCurrency() {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    return this.http.get(`${environment.endpoint}/getCurrency`, requestOptions);
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
    return this.http.get(`${environment.endpoint}/getTags`, requestOptions);
  }

  // retrieve list of feeds
  async retrieve(colletion: string) {
    const feedsCol = collection(this.db, colletion);

    const feedsSnapshot = await getDocs(feedsCol);
    return feedsSnapshot.docs;
  }

  // get offers
  getOffers(type: string) {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    const body = {
      type: type
    };
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    return this.http.post(
      `${environment.endpoint}/getOffers`,
      body,
      requestOptions
    );
  }

  // filter offers
  filterOffers(token: string, username: string, formData: any) {

    return this.http.post(`${environment.endpoint}/offer/filterOffers`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }

  // get Trade by ID
  getTradeByID(username: string, token: string, id: string) {

    const requestOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        token: token,
        username: username
      })
    };
    return this.http.get(
      `${environment.endpoint}/` + id + '/fetchTradeId',
      requestOptions
    );
  }

  //get offerinformation
  getInfo(id: string) {
    const header = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    const requestOptions = {
      headers: new HttpHeaders(header)
    };
    return this.http.get(`${environment.endpoint}/getOfferInfo/` + id, requestOptions);
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
      `${environment.endpoint}/openTrade`,

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

    return this.http.post(`${environment.endpoint}/invest`, data, requestOptions);
  }

  //send message
  async sendMessage(data: any) {
    //Send message
    this.firestore.collection('trades').doc(data.tradeId.toString()).collection('chats').add({
      senderId: data.senderId,
      message: data.message,
      time: Date.now()
    });
    this.firestore.collection('notifications').add({
      heading: 'New Trade message',
      timestamp: Date.now(),
      resource_path: '/offers/chat/room/' + data.tradeId,
      text: data.senderId + ' has sent you a message',
      username: data.recepient,
      read: false
    });


  }

  //retrieve all messages
  retrieveMessage(docId: string) {

    return this.firestore
      .collection('trades')
      .doc(docId.toString())
      .collection('chats', (ref) => ref.orderBy('time','asc'))
      .valueChanges();
  }

//retrieve firebase notifications
  retrieveNotifications(email: string, username: string,) {

    return this.firestore
      .collection('notifications', (ref) => ref.where('username', '==', username).orderBy('timestamp', 'desc').limit(10))
      .valueChanges();
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
      `${environment.endpoint}/getUserDataByUsername/` + userIdFromRoute,
      requestOptions
    );
  }

  // get applications
  blockNow(token: string, username: string, formData: any) {
    return this.http.post(`${environment.endpoint}/blockUser`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }
  // reopen Trade
  reopenTrade(token: string, username: string, formData: any) {
    return this.http.post(`${environment.endpoint}/reopenTrade`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }
  // quick offer edit
  quickEdit(token: string, username: string, formData: any) {
    return this.http.post(`${environment.endpoint}/offer/quickEdit`, formData, {
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
    return this.http.post(`${environment.endpoint}/set2FA`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }
  // Set Whitelist
  setWhitelist(token: string, username: string, formData: any) {
    return this.http.post(`${environment.endpoint}/setWhitelist`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }

  // confirm 2FA
  confirm2FAAuth(formData: any) {
    console.log(formData);
    return this.http.post(`${environment.endpoint}/confirmLogin`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*'
      })
    });
  }

  settoogle2FA(token: string, username: string, formData: any) {
    return this.http.post(`${environment.endpoint}/set2FA`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }

  updateProfile(token, username, formData: any) {
    return this.http.post(`${environment.endpoint}/updateProfile`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }

  setChangePaswordInApp(token, username, formData: any) {
    return this.http.post(`${environment.endpoint}/changePasswordAuth`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }

  sendResetLink(formData: any) {
    const requestOptions = {
      headers: new HttpHeaders(this.headerDict)
    };
    return this.http.post(
      `${environment.endpoint}/forgotPassword`,
      formData,
      requestOptions
    );
  }

  sendCodeToMail(token, username, formData: any) {
    return this.http.post(`${environment.endpoint}/send2FAMail`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }

  confirmResetPassword(formData: any) {
    const requestOptions = {
      headers: new HttpHeaders(this.headerDict)
    };
    return this.http.post(
      `${environment.endpoint}/changePassword`,
      formData,
      requestOptions
    );
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
      `${environment.endpoint}/resetProfile/` + username,
      requestOptions
    );
  }

  sendCrypto(token, username, formData: any) {
    return this.http.post(`${environment.endpoint}/sendCrypto`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }

  sendConfirmEmail(formData: any) {
    return this.http.post(
      `${environment.endpoint}/resendEmailVerification`,
      formData,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: '*/*'
        })
      }
    );
  }

  confirmMail(formData: any) {
    return this.http.post(`${environment.endpoint}/userEmailVerify`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*'
      })
    });
  }

  getGraph(formData: any) {
    return this.http.post(`${environment.endpoint}/getGraph`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*'
      })
    });
  }

  toggleAll(token: string, username: string, state: string) {

    return this.http.get(`${environment.endpoint}/offer/${state}/toggleall`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }

  toggleSingleOffer(token: string, username: string, offerId: any, action: string) {
    return this.http.get(`${environment.endpoint}/offer/${offerId}/${action}/toggle`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }

  deleteOffer(token: string, username: string, id: any) {
    return this.http.get(`${environment.endpoint}/offer/${id}/delete`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        token: token,
        username: username
      })
    });
  }
}
