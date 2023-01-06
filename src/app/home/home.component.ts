import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})




export class HomeComponent {

  
  constructor(private route: ActivatedRoute) {

    this.ngOnInit();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const username = params['username'];
      // Do something with the username
      console.log(username)
     const uname =document.getElementById('uname') as HTMLElement;

      uname.innerText=username;
      
    });
  }

  
  
}
