import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-select-room',
  templateUrl: './select-room.component.html',
  styleUrls: ['./select-room.component.css']
})
export class SelectRoomComponent {

roomId:String

constructor(private http: HttpClient, private router: Router) {}

join(rid:String) {

  this.roomId=rid;
  console.log(this.roomId)

  this.http.post('http://localhost:3000/api/room/joinroom',{roomId:this.roomId}).subscribe({
    next: (data) => 
    {
      
      console.log('Success!', data)

    },
    error: (error) => 
    {
      console.error('Error!', error)
    }
  });
  
  
}

}
