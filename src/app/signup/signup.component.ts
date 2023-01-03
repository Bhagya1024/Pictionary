import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})


export class SignupComponent {

  username: string;
  password: string;
  email:string;
  profilePicture: File;
  key: string;
  name: string;
  url: string;
  

  constructor(private http: HttpClient, private router: Router) {}


  search() {
    const body = {
      username: this.username,
      password: this.password,
      email: this.email,
      profilePicture: this.profilePicture
      
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

    console.log(this.username)
    console.log(this.password)
    console.log(this.email)
    console.log(this.profilePicture)

    if(this.username==null || this.password==null || this.email==null)
    {
        errmsg.style.display='block';
        errmsg.innerText='Please fill all the fields';
        glassbox.style.height='640px';
    }
    else
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
