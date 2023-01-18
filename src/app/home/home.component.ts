import { Component , ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ElementRef } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  username: any;
  @ViewChild('privateinput', { static: false }) privateinput: ElementRef;


  constructor(private http: HttpClient, private router: Router,private route: ActivatedRoute) {
    this.ngOnInit();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      console.log(this.username);
      const uname = document.getElementById('uname') as HTMLElement;
      uname.innerText = this.username;
    });


  }

  onJoinClick() {
    this.router.navigate(['/selectroom'], { queryParams: { username: this.username } });
  }

  signout()
  {
    const body = {
      username: this.username
    };
    interface Data {
      message: string;
    }
  
    this.http.post<Data>('http://localhost:3000/api/userroom/leaveall',body).subscribe({

    next: (data) => 
    {
      const msg=data.message;
       
      if(msg=='User not found in room' || msg=='User left room successfully')
      {
        this.router.navigate(['/']);
      }
    
    },
    error: (error) => 
    {
      console.error('Error!', error)
    }
 
    });
   
  }

  createroom()
  {
    interface Databody {
      message: string;
      roomId:string;
    }

    this.http.post<Databody>('http://localhost:3000/api/room/createroom',{username: this.username}).subscribe({
      next: (data) => 
      {
        const msg=data.message;
        const roomId=data.roomId;
         
        if(msg=='Room created successfully')
        {
          this.join(roomId);
        }
      },
      error: (error) => 
      {
        console.error('Error!', error)
      }
    });
  }


  joinprivate()
  {
    const errmsg=document.getElementById('errmsg') as HTMLElement;
    const roomIdInput = document.getElementById('privateinput') as HTMLInputElement;
    let roomId = roomIdInput.value;
    
    console.log(roomId);

    interface Databody {
      message: string;
    }

    this.http.post<Databody>('http://localhost:3000/api/room/joinprivate',{roomId: roomId}).subscribe({
      next: (data) => 
      {
        const msg=data.message;
         
        if(msg=='Room found')
        {
          this.join(roomId);
          errmsg.style.display='none';
        }
        else
        {
          
          errmsg.style.display='block';
        }
      },
      error: (error) => 
      {
        console.error('Error!', error)
      }
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
  
  
    this.http.post<Data>('http://localhost:3000/api/room/joinroom',{roomId:rid}).subscribe({
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
          
          this.router.navigate(['/play'], { queryParams: {  username: this.username,roomId:rid,private:1 } });
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
