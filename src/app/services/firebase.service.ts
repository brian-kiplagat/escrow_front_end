import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'environments/environment';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import {Router} from '@angular/router';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject,Subject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  app = initializeApp(environment.firebase);
   db = getFirestore(this.app);
   auth1 = getAuth(this.app);
   signuperror:string =''
   loginerror:string = ''
   signuperrorChange: Subject<string> = new Subject<string>();
   loginerrorChange: Subject<string> = new Subject<string>();


  constructor(private router:Router, public auth: AngularFireAuth,private http: HttpClient) { 
      this.signuperrorChange.subscribe((value) => {
            this.signuperror = value
        });
         this.loginerrorChange.subscribe((value) => {
            this.loginerror = value
        });
  }
  // public methods
  login(email: string, password: string):void {
    this.auth.signInWithEmailAndPassword(email,password).then(()=>{
      this.router.navigate(['/dashboard/ecommerce']);
    }).catch((err)=>{
        this.loginerrorChange.next("user not found, please check email or password");
      console.log(err.message)
    })
  
  }

 async logout() {
    await this.auth.signOut().then(()=>{
      this.router.navigate(['/pages/login']);
    })
   
  }
   //create new user then login
  registration(email:string, password:string):void {

    this.auth.createUserWithEmailAndPassword(email, password).then((userData) => {
      console.log(userData.user)
      if (userData.user) {
        this.login(email, password)
        this.router.navigate(['/'])
        console.log(userData.user)
      }
      console.log(userData.user)
    }).catch((err)=>{
        this.signuperrorChange.next('user already exists');
      console.log(err.message)
    })}
    // retireive items from firestore

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
       


     return this.http.post('https://coinlif.com/api/coin/getOffers.php', data)
    }
    getBalance(){
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

     return this.http.post('http://coinlif.com/api/coin/read.php', data)
}
createWallet(){
              var data: any = new FormData();
      data.append('email', 'kiplagatbrian18@gmail.com');
      data.append('key', 'kwdmcpmpmwsx');
      data.append('secret', 'kxpwcnmpwcmcpc');


     return this.http.post('http://coinlif.com/api/coin/create.php', data)
}
}
