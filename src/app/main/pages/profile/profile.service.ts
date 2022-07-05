import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import {FirebaseService} from "../../../services/firebase.service";
//import { FirebaseService } from 'app/services/firebase.service';
@Injectable()
export class ProfileService implements Resolve<any> {
  rows: any;
  onPricingChanged: BehaviorSubject<any>;
  public currentUser:any ={}
  public user:any ={}

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   * @param fb
   * @param router
   */
  constructor(private _httpClient: HttpClient , public fb: FirebaseService,
  private router:Router
) {
    // Set the defaults
    this.onPricingChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/profile-data').subscribe((response: any) => {
        this.rows = response;
        this.onPricingChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }

  /**
   * On init
   */
  ngOnInit(): void {
    // get the currentUser details from localStorage
    this.user = JSON.parse(localStorage.getItem('user'));

    this.fb.getUser(this.user.username,this.user.token).subscribe((data: any) => {
      this.currentUser =data.responseMessage?.user_data[0];
      console.log(data)
    },(error)=>{
      console.log(error)
      this.router.navigate(['/'])
    });


  }

  getEmail(){
    return  localStorage.getItem('user')
  }

}
