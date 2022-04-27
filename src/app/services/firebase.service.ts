import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'environments/environment';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import {Router} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject,Subject } from "rxjs";
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable, throwError,from } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  app = initializeApp(environment.firebase);
   db = getFirestore(this.app);
   signuperror:string =''
   loginerror:string = ''
   signuperrorChange: Subject<string> = new Subject<string>();
   loginerrorChange: Subject<string> = new Subject<string>();



  constructor(private router:Router, public auth: AngularFireAuth,private http: HttpClient,private firestore:AngularFirestore) {
      this.signuperrorChange.subscribe((value) => {
            this.signuperror = value
        });
         this.loginerrorChange.subscribe((value) => {
            this.loginerror = value
        });
  }
  // public methods

  //login
  login(email: string, password: string) {
    return this.http.post('https://api.coinpes.cash/api/coin/v1/loginUser', {
      "email":email,
      "password":password
    }).subscribe((data)=>{
      console.log(data)
    })

  }
//logout
 async logout() {
  this.router.navigate(['/pages/login']);
   
  }
  // reset password
  forgotPassword(email:string){
    return this.http.post('http://localhost/coinlifapi/api/coin/v1/forgotPassword', {
      "email":email
     
    }).subscribe((data)=>{
      console.log(data)
    })
  }
  headerDict = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'

  }
   //create new user then login
  registration(email: string, password: string) {
    const requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
    this.http.post('https://api.supabeta.com/api/coin/v1/registerUser', {
      "email": email,
      "password": password
    }, requestOptions).subscribe((data:any) => {
      if (data.responseCode ==200) {
        this.router.navigate(['dashboard/overview']);
        }
        console.log(data)
      })}

    //get user by email
    getUser(){
      return this.http.get('https://api.coinpes.cash/api/coin/v1/fetchUserDetails/fidbyy@gmail.com')
    }
    // create wallet
    createWallet(email:string){
      var data: any = new FormData();
data.append('email', email);
data.append('key', 'kwdmcpmpmwsx');
data.append('secret', 'kxpwcnmpwcmcpc');


return this.http.post('https://coinlif.com/api/coin/create.php', data).subscribe((data)=>{
  console.log(data)
})
}

  // get applications
  async getApplications(collectionName:string){
    const citiesCol = collection(this.db, collectionName);
    const citySnapshot = await getDocs(citiesCol);
    return citySnapshot.docs;
  }
  // retrieve list of feeds
  async retrieve(colletion : string) {
    const feedsCol = collection(this.db, colletion);

    const feedsSnapshot = await getDocs(feedsCol);
    return feedsSnapshot.docs;}

    // get offers
   getOffers(){
      var data: any = new FormData();
      data.append('email', 'kiplagatbrian18@gmail.com');
      data.append('key', 'kwdmcpmpmwsx');
      data.append('secret', 'kxpwcnmpwcmcpc');
      data.append('method', 'paypal');
      data.append('currency', 'KES');
       data.append("type", "sell");
       data.append("minimum", "1100");
       data.append("maximum", "5000");
       data.append("margin","4");
       data.append("tags", "friends and family");
       data.append( "terms", "Buy BTC");
       data.append("instructions", "Say hi");
       data.append("new_trader_limit", "5");
       data.append("blocked_countries", "KE");
       data.append("allowed_countries", "KE");
       data.append("vpn", "0");
       data.append("amount", "");



     return this.http.post('https://coinlif.com/api/coin/getOffers.php', data)
    }
//     getBalance(){
//             var data: any = new FormData();
//       data.append('email', 'kiplagatbrian18@gmail.com');
//       data.append('key', 'kwdmcpmpmwsx');
//       data.append('secret', 'kxpwcnmpwcmcpc');
//       data.append('method', 'paypal');
//       data.append('currency', 'KES');
//        data.append("type", "sell");
//        data.append("minimum", "1100");
//        data.append("maximum", "5000");
//        data.append("margin","4");
//        data.append("tags", "friends and family");
//        data.append( "terms", "Buy BTC");
//        data.append("instructions", "Say hi");
//        data.append("new_trader_limit", "5");
//        data.append("blocked_countries", "KE");
//        data.append("allowed_countries", "KE");
//        data.append("vpn", "0");

//      return this.http.post('https://coinlif.com/api/coin/getBalance.php', data)
// }


getInfo(id:string){
  var data: any = new FormData();
data.append('id','36');
data.append('key', 'kwdmcpmpmwsx');
data.append('secret', 'kxpwcnmpwcmcpc');


return this.http.post('https://coinlif.com/api/coin/getOfferInfo.php', data)
}
getExchange(){
  return this.http.get('https://api.coinbase.com/v2/exchange-rates?currency=BTC')
}
getTags(){
  var data: any = new FormData();
data.append('key', 'kwdmcpmpmwsx');
data.append('secret', 'kxpwcnmpwcmcpc');


return this.http.post('https://coinlif.com/api/coin/getTags.php', data)
}
getCountries(){
  var data: any = new FormData();
data.append('key', 'kwdmcpmpmwsx');
data.append('secret', 'kxpwcnmpwcmcpc');


return this.http.post('https://coinlif.com/api/coin/getCurrency.php', data)
}
getProfile(){
  var data: any = new FormData();
  data.append('username', 'MurderouLlipa455');
data.append('key', 'kwdmcpmpmwsx');
data.append('secret', 'kxpwcnmpwcmcpc');


return this.http.post('https://coinlif.com/api/coin/getProfileData.php', data)
}

//chat logic
createChat(){

}
//send message
async sendMessage(data){
 this.firestore.collection('trades').doc(data.tradeId).collection("chats").add({
   senderId:data.senderId,
   message:data.message
 })

}
//retrieve all messages
retrieveMessage(docId){
let users =this.firestore.collection('trades').doc(docId).collection("chats").valueChanges()
console.log(users)
return users
}

}
