import { Component , OnInit, AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})




export class PlayComponent implements OnInit, AfterViewInit {

  username:any

  constructor(private http: HttpClient, private router: Router,private route: ActivatedRoute) {}

  ngOnInit(){
    this.showWords();

    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      console.log(this.username);
      
    });
  }

  initialTime = 80;
  
  ngAfterViewInit() {
    // Start the countdown timer when the component's view has been initialized
    this.startTimer();
  }


  // showword(){
  //  const hword=document.getElementById('wordhidden') as HTMLElement;
  //   interface RandomWord {
  //     word:String;
  //   }

  //   console.log('inside showword funciton')
  //   this.http.get<RandomWord>('http://localhost:3000/api/word/getwords').subscribe(data => {
  //     console.log(data);
  //     const value=data.word;
  //     console.log(value)
  //     const count=value.length;
  //     console.log(count)

  //     for(let i=0;i<count;i++){
  //       hword.innerText+='_'
  //       console.log(hword)
  //     }
      
  //   });
  // }

  showWords() {

    interface getword {
      words: string[];
    }

    let roundword=null;
    const hword = document.getElementById('wordhidden') as HTMLElement;

    console.log('inside show words funciton');

    this.http.get<getword>('http://localhost:3000/api/word/getwords').subscribe(data => {
  
      // Get the array of words from the response data
      const wordsarr = data;
      console.log(wordsarr.words);
      const n1=wordsarr.words[2];
      console.log(n1)
      // Get the word for each round and show the  number of underscores
      for (let i = 0; i < 10; i++) {
        hword.innerText='';
        roundword=wordsarr.words[i];
        const count=roundword.length;

        console.log(roundword)
        console.log(count)

        for(let q=0;q<count;q++)
        {
          hword.innerText += '_';
          console.log(hword);
        }

      }
     
    });
  }
  
  startTimer() {
    // Get a reference to the time element
    const timeElement = document.getElementById('time') as HTMLElement;

    // Set the initial time in the time element
    timeElement.innerText = this.initialTime.toString();

    // Set an interval to update the time element every 1000 milliseconds (1 second)
    const interval = setInterval(() => {
      // Decrement the initial time by 1 second
      this.initialTime--;

      // Update the time element with the new time
      timeElement.innerText = this.initialTime.toString();

      // If the time has reached 0, clear the interval and stop the countdown
      if (this.initialTime === 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

}
