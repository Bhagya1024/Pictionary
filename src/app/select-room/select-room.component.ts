import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-select-room',
  templateUrl: './select-room.component.html',
  styleUrls: ['./select-room.component.css']
})
export class SelectRoomComponent {

roomId:String
username:String

constructor(private http: HttpClient, private router: Router,private route: ActivatedRoute) {}

ngOnInit(){
  
  this.route.queryParams.subscribe(params => {
    this.username = params['username'];
    console.log(this.username);
});
}


join(rid:String) {

  const connect=1;
  const points=0;
  const body = {
    username: this.username,
    roomId: rid,
    connected:connect,
    points:points
  };

  interface Data {
    message: string;
  }
  interface DataJoin {
    message: string;
  }

  this.roomId=rid;
  
  console.log(this.roomId)

  this.http.post<Data>('http://localhost:3000/api/room/joinroom',{roomId:this.roomId}).subscribe({
    next: (data) => 
    {
      const msg=data.message;
       
      if(msg=='Successfully joined room')
      {
        this.http.post<DataJoin>('http://localhost:3000/api/userroom/userjoinroom',body).subscribe({
    next: (data) => 
    {
      const msg2=data.message;
       
      if(msg2=='User joined room successfully')
      {
        
        this.router.navigate(['/play'], { queryParams: { roomId: this.roomId, username:this.username } });
        console.log('Success!', data)
      }
      

    },
    error: (error) => 
    {
      console.error('Error!', error)
    }
  });
      }

      else
      {
        console.log('error occurred');
      }
      

    },
    error: (error) => 
    {
      console.error('Error!', error)
    }
  });
  
  
}

}
