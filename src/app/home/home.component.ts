import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  username: any;

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

    // const joinbtn = document.getElementById('join') as HTMLElement;

    // joinbtn.onclick = () => {
    //   this.router.navigate(['/play'], { queryParams: { username: this.username } });
    // };

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
         
        if(msg=='User left room successfully' || msg=='User not found in room')
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

  
}
