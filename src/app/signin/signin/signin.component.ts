import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';



@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})


export class SigninComponent {

  username: string;
  password: string;

  
constructor(private http: HttpClient, private router: Router) {}


  login() {
    const body = {
      username: this.username,
      password: this.password
    };
    interface Data {
      message: string;
      success: boolean;
    }

   const errmsg=document.getElementById('errmsg') as HTMLElement
   const glassbox=document.getElementById('glassbox') as HTMLElement

    console.log(this.username)
    console.log(this.password)


    this.http.post<Data>('http://localhost:3000/api/user/login', body).subscribe({
      next: (data) => 
      {
        
        console.log('Success!', data)
        
        const msg=data.message;
        console.log(msg)

        if(msg=='login successful!')
        {
  
          this.router.navigate(['/home'], { queryParams: { username: this.username } });
           errmsg.style.display='none';
           glassbox.style.height='440px';
        }
        else
        {
          errmsg.style.display='block';
          glassbox.style.height='480px';

        }
       
      },
      error: (error) => 
      {
        console.error('Error!', error)
      }
    });
    
    
  }
}
