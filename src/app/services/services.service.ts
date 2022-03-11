import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import {Router} from '@angular/router';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class ServicesService {
   app = initializeApp(environment.firebase);
   db = getFirestore(this.app);
   auth1 = getAuth(this.app);


  constructor(private router:Router, public auth: AngularFireAuth,) { }
  // public methods
  login(email: string, password: string):void {
    this.auth.signInWithEmailAndPassword(email,password).then(()=>{
      this.router.navigate(['/dashboard']);
    }).catch((err)=>{
      console.log("err",err.message)
    })
  
  }

 async logout() {
    await this.auth.signOut().then(()=>{
      this.router.navigate(['/']);
    })
   
  }
   //create new user then login
  registration(email:string, password:string):void {

    this.auth.createUserWithEmailAndPassword(email,password).then((userData)=>{
      if (userData.user) {
        this.login(email, password)
        this.router.navigate(['/dashboard']);
        console.log(userData.user)
      } else {
      }
      console.log(userData.user)
    }).catch((err)=>{
      console.log('err',err)
    })}

}
