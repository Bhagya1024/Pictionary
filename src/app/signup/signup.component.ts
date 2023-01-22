import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver'; // import the file-saver module


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})


export class SignupComponent {

  username: string;
  password: string;
  email:string;

  name: string;


  constructor(private http: HttpClient, private router: Router) {

  }

 



  search() {
    const body = {
      username: this.username,
      password: this.password,
      email: this.email
      
    };

    const uname = {
      username: this.username
    };
    interface Data {
      message: string;
      success: boolean;
     
    }

    interface User {
      exists:Number;
    }

   const errmsg=document.getElementById('errmsg') as HTMLElement
   const glassbox=document.getElementById('sgb') as HTMLElement

   
   if(this.username==null || this.password==null || this.email==null)
   {
       errmsg.style.display='block';
       errmsg.innerText='Please fill all the fields';
       glassbox.style.height='640px';
   }
   else{

   // Email validation using regular expressions
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(this.email)) {
        errmsg.style.display='block';
        errmsg.innerText='Invalid email';
        glassbox.style.height='640px';
        return;
    }
 
 
     // Password validation
     if (this.password.length < 8) {
       errmsg.style.display='block';
       errmsg.innerText='Password is weak';
       glassbox.style.height='640px';
       return;
   }
 

   if(this.password.length >= 8 && emailRegex.test(this.email) )
   {
            errmsg.style.display='none';
            glassbox.style.height='580px';

            //search if there's an existing username

            this.http.post<User>('http://localhost:3000/api/user/search', uname).subscribe({
             next: (data) => 
             {
               
               console.log('Success!', data)
               
               const exists=data.exists;
               console.log(exists)
       
               if(exists==1)
               {
                 
                 errmsg.style.display='block';
                 errmsg.innerText='Username already exists';
                 glassbox.style.height='640px';
                 
               }
               else
               {
                 this.http.post<Data>('http://localhost:3000/api/user/adduser', body).subscribe({
                   next: (data) => 
                   {
                     
                     console.log('Success!', data)
                     
                     const msg=data.message;
                     console.log(msg)
                     
                     if(msg=='user added successfully')
                     {

   
                       this.router.navigate(['/']).then(
                         () => {
                          
                         },
                         (error) => {
                           console.error('Error navigating to home page:', error);
                           // handle error here
                         }
                       );
                       
                     }
                     else
                     {
                       errmsg.style.display='block';
                       errmsg.innerText='An error occured. please try again';
                       glassbox.style.height='640px';
                      
             
                     }
                    
                   },
                   error: (error) => 
                   {
                     console.error('Error!', error)
                   }
                 });
       
               }
              
             },
             error: (error) => 
             {
               console.error('Error!', error)
             }
           });


     
   }
 
   }


   
  

   
  }

}
