import { Component, ViewEncapsulation,OnInit } from '@angular/core';
import { FirebaseService } from 'app/services/firebase.service';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'chat-application' }
})
export class ChatComponent implements OnInit {
  public user:any={}
  public currentUser:any ={}
  public tradeData:any ={}
  public trade:any ={}
  constructor(private fb : FirebaseService, private route: ActivatedRoute,private router:Router){
  
  }
  ngOnInit():void{
    this.user = JSON.parse(localStorage.getItem('user'));
    const routeParams = this.route.snapshot.paramMap;    
    const productIdFromRoute = routeParams.get('id');
    this.fb.getUser(this.user.username,this.user.token).subscribe((data: any) => {
     this.currentUser =data.responseMessage?.user_data[0];
     this.tradeData = data.responseMessage?.trade_data;
    this.trade = this.tradeData.find(product => product.id == productIdFromRoute);
    console.log(this.trade)
   },(error)=>{
     console.log(error)
     this.router.navigate(['dashboard'])
   });
 

  }
}
