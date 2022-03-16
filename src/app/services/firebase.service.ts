import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'environments/environment';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import {Router} from '@angular/router';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject,Subject } from "rxjs";

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


  constructor(private router:Router, public auth: AngularFireAuth,) { 
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
      this.router.navigate(['/dashboard']);
    }).catch((err)=>{
        this.loginerrorChange.next("user not found, please check email or password");
      console.log(err.message)
    })
  
  }

 async logout() {
    await this.auth.signOut().then(()=>{
      this.router.navigate(['/']);
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
}
