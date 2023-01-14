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
  profilePicture: File;
  key: string;
  name: string;
  url: string;
  imageUrl: string;

  constructor(private http: HttpClient, private router: Router) {

    this.imageUrl='../../assets/images/u.jpg';
    console.log(this.imageUrl)
  }

 

  uploadImage(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.onload = () => {
      this.profilePicture = file;
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

    console.log(file)
  }

  search() {
    const body = {
      username: this.username,
      password: this.password,
      email: this.email,
      imageurl:this.imageUrl
      
    };

    const imagebody = {
      username: this.username,
      image: this.profilePicture
 
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
                       
                        // saveAs(this.profilePicture, `${this.username}.jpg`);
                        // Use the HttpClient service to send the image to the backend
                       this.http.post('http://localhost:3000/api/user/saveimage',{image: this.profilePicture})
                       .subscribe(response => {
                        console.log(response);
                           
                      });

     

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
