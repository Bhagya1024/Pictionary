import { Component , OnInit, AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';

interface GameData {
  message: string;
}
interface GameStopData {
  message: string;
}


@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})




export class PlayComponent implements OnInit, AfterViewInit {
  

  username: string;
  roomId: any;
  connectedUsers: any[];
 

 
  
  constructor(private http: HttpClient, private router: Router,private route: ActivatedRoute) {

 
  }

  ngOnInit(){


    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      this.roomId  = params['roomId'];
      
    });

  }

  
  ngAfterViewInit() {

    

    const wait = document.getElementById('wait') as HTMLElement;
    let params = new HttpParams();
    params = params.append('roomId', this.roomId);
    params = params.append('connected', '1');

    setInterval(() => {
        this.http.get<any[]>('http://localhost:3000/api/userroom/conuser', { params: params })
            .subscribe((connectedUsers: any[]) => {
              this.connectedUsers = connectedUsers;
            
              if(this.connectedUsers.length>1)
              {

                wait.style.display='none';
                this.http.post<GameData>('http://localhost:3000/api/game/gamestatus',{ roomId: this.roomId }).subscribe(data => {

                const msg = data.message;

                if(msg=='game created successfully'){
                  this.gamestart();
                }
                else if (msg=='Game already started'){
                  this.gameongoing();
                }
              }, (error) => {
                 if (error.status === 409) {
                  console.error = function () {};
                 }
              });

              }

              else
              {
                wait.style.display='block';
                this.http.post<GameStopData>('http://localhost:3000/api/game/gamestop',{ roomId: this.roomId }).subscribe(data => {

                const msg1 = data.message;

                if(msg1=='Game stopped successfully'){
                  //handle the end of the game, and show the final first places.
                }
              }
                , (error) => {
                  if (error.status === 409) {
                   console.error = function () {};
                  }
               });
 

              }
              


            });
    }, 1000);
}

gamestart() {
  const rounds=10;
  const rounduser=null;
  let wordsarr: string[]
  let i = 0;

  interface getword {
    words: string[];
  }

  let roundword:string;

  const hword = document.getElementById('wordhidden') as HTMLElement;
  const roundshow = document.getElementById('round') as HTMLElement;

  this.http.post<getword>('http://localhost:3000/api/game/gameword', { roomId: this.roomId }).subscribe(data => {
    wordsarr = data.words;
    console.log(wordsarr);

    
    startRound();
  });

  const startRound = () => {
    roundword=wordsarr[i];
    const body = {
      roomId: this.roomId,
      round: i+1,
      currentWord:roundword
    };

    hword.innerText='';
    

    console.log('round '+ (i+1) + ' : ' +roundword );
    const count=roundword.length;

    roundshow.innerText = (i + 1).toString(); 

    this.http.post('http://localhost:3000/api/game/updateround',body).subscribe(data => {
    }
    , (error) => {
      if (error.status === 409) {
       console.error = function () {};
      }
   });

   let intervalTime = 60000;
   this.startTimer(intervalTime);
   
    for(let q=0;q<count;q++) {
      hword.innerText += '_';
      }
      
      if (i === rounds) {
      return;
      }
     i++;
     setTimeout(startRound, intervalTime);
  }
}


gameongoing()
{  
  const hword = document.getElementById('wordhidden') as HTMLElement;
  const roundshow = document.getElementById('round') as HTMLElement;
  hword.innerText += '';


  let word:string;
  let round:Number;

  interface Getround {
    currentWord: string,
    round:Number;
  }

  this.http.post<Getround>('http://localhost:3000/api/game/showround',{roomId:this.roomId}).subscribe(data => {

  word= data.currentWord;
  round=data.round;

  console.log(word);
  console.log(round);

  const count=word.length;

  hword.innerText = "_".repeat(word.length);

  roundshow.innerText = round.toString(); 


  }
  , (error) => {
    if (error.status === 409) {
     console.error = function () {};
    }
 });


}


startTimer(initialTime: number) {
  // Get a reference to the time element
  const timeElement = document.getElementById('time') as HTMLElement;
  
  // converting milliseconds to seconds 
  initialTime = initialTime / 1000;
  
  // Set the initial time in the time element
  timeElement.innerText = initialTime.toString();

  // Set an interval to update the time element every 1000 milliseconds (1 second)
  const interval = setInterval(() => {
    // Decrement the initial time by 1 second
    initialTime--;

    // Update the time element with the new time
    timeElement.innerText = initialTime.toString();

    // If the time has reached 0, clear the interval and stop the countdown
    if (initialTime === 0) {
        clearInterval(interval);
    }
  }, 1000);
}



leaveroom() {
  const connect=0;
  const points=0;
  const body = {
    username: this.username,
    roomId: this.roomId,
    connected:connect,
    points:points
  };
  interface Data {
    message: string;
  }

  this.http.post<Data>('http://localhost:3000/api/userroom/leaveroom',body).subscribe({
    next: (data) => 
    {
      const msg=data.message;
       
      if(msg=='User left room successfully')
      {
        this.roomId = null;
        this.router.navigate(['/selectroom'], { queryParams: { username: this.username,roomId: this.roomId } });
      }
    },
    error: (error) => 
    {
      console.error('Error!', error)
    }
  });
    
  }


  


 
}