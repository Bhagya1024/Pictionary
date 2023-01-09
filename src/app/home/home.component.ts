import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  username: any;

  constructor(private route: ActivatedRoute, private router: Router) {
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
    this.router.navigate(['/play'], { queryParams: { username: this.username } });
  }
}
