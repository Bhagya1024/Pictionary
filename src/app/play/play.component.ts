import { Component , OnInit, AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { CanvasComponent } from '../canvas/canvas.component';

interface GameData {
  message: string;
}
interface GameStopData {
  message: string;
}

interface UserRoom {
  username: string;
  points: number;
  rank: number;
}

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})



export class PlayComponent implements OnInit, AfterViewInit {
  

  username: string;
  roomId: any;
  word:string;
  connectedUsers: UserRoom[];
  allUsers:UserRoom[];
  round:Number;
  private:Number;
  
  constructor(private http: HttpClient, private router: Router,private route: ActivatedRoute,private canvasComponent:CanvasComponent) {}

  

  ngOnInit(){

   const roomdiv=document.getElementById('roomiddiv') as HTMLElement;
   const rid=document.getElementById('rid') as HTMLElement;

    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      this.roomId  = params['roomId'];
      this.private  = params['private'];
      console.log(this.private)

      if(this.private==1)
      {
        roomdiv.style.display='block';
      }
      else
      {
        roomdiv.style.display='none';
      }
    });

    rid.innerText=this.roomId;


    const ClipboardJS = require('clipboard');

    const clipboard = new ClipboardJS('#roomiddiv');

    clipboard.on('success', (e: ClipboardEvent) => {
      alert("Room ID copied to clipboard");
  });

  }

  
  
  ngAfterViewInit() {

   
  

    const wait = document.getElementById('wait') as HTMLElement;
    let params = new HttpParams();
    params = params.append('roomId', this.roomId);
    params = params.append('connected', '1');

     setInterval(() => {
        this.http.get<UserRoom[]>('http://localhost:3000/api/userroom/conuser', { params: params })
            .subscribe((connectedUsers: UserRoom[]) => {
              this.connectedUsers = connectedUsers;

              this.allUsers=this.connectedUsers;

              this.connectedUsers.sort((a, b) => b.points - a.points);
          // Set the rank of each user
          this.connectedUsers.forEach((user, index) => user.rank = index + 1);

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
             
                console.log(error)
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

               });
 

              }
              


            });
    }, 1000);
    
}



gamestart() {

  let currentrounduser:String;
  let roundUser;
  let unameround:String;

  const rounds=3;
  let wordsarr: string[]
  let i = 0;

  interface getword {
    words: string[];
  }

  interface getrounduser {
    roundUser: string;
  }

  interface updateround {
    message: string;
  }


  interface GuessedUsers {
    usernames: string[];
    }
  
  let roundword:string;

  const hword = document.getElementById('wordhidden') as HTMLElement;
  const roundshow = document.getElementById('round') as HTMLElement;
  const timeshow = document.getElementById('time') as HTMLElement;
  const wordheading=document.getElementById('wordheading') as HTMLElement;
  const canvasapp=document.getElementById("canvasapp")as HTMLElement;
  const bigdiv=document.getElementById("bigdiv")as HTMLElement;
  var c = document.getElementById("drawing-canvas") as HTMLCanvasElement;

  bigdiv.style.display='none';
  canvasapp.style.display='block';

  this.http.post<getword>('http://localhost:3000/api/game/gameword', { roomId: this.roomId }).subscribe(data => {
    wordsarr = data.words;
    console.log(wordsarr);

    startRound();
  });

  const startRound = () => {

     const ctx = c.getContext('2d');
    if(ctx)
    {
      ctx.clearRect(0, 0, c.width, c.height);
      
    }

    hword.innerText='';

    const ROUND_DURATION = 70000; // 60 second

    roundword=wordsarr[i];
    const body = {
      roomId: this.roomId,
      round: i+1,
      currentWord:roundword
    };

    const round=i+1;

    //assign a user to draw for each round
    roundUser = this.connectedUsers[i % this.connectedUsers.length];
    unameround=roundUser.username;
  

    const bodyround = {
      roomId: this.roomId,
      roundUser:unameround
    };


    this.http.post<getrounduser>('http://localhost:3000/api/game/changerounduser', bodyround).subscribe(data => {

      currentrounduser = data.roundUser;
      if(currentrounduser){
        const selecteduser=document.querySelector(`#user-${currentrounduser}`) as HTMLElement;
        selecteduser.classList.add("round-user");
      }
      else
      {
        console.error('round user is undefined');
      }

    });
    

    console.log('round '+ (i+1) + ' : ' +roundword );

    roundshow.innerText = (i + 1).toString(); 

    if(round<=3){
      this.http.post<updateround>('http://localhost:3000/api/game/updateround',body).subscribe(data => {

      const ms=data.message;
      console.log(ms);
  
      }
      , (error) => {
  
         console.error(error);
        
     });
    }



 

   this.startTimer(ROUND_DURATION);

      
      if (i === rounds) {
        
        bigdiv.style.display='block';
        canvasapp.style.display='none';
        wordheading.innerText='Game Over';
        this.gameend();
        hword.innerText='';
        timeshow.innerText='';

      }
     i++;
     setTimeout(startRound, ROUND_DURATION);
  }
}


gameongoing()
{  
  const canvasapp=document.getElementById("canvasapp")as HTMLElement;
  const bigdiv=document.getElementById("bigdiv")as HTMLElement;

  bigdiv.style.display='none';
  canvasapp.style.display='block';
  canvasapp.style.cursor='not-allowed';
  canvasapp.style.pointerEvents='none';

  const hword = document.getElementById('wordhidden') as HTMLElement;
  const roundshow = document.getElementById('round') as HTMLElement;
  const timeshow = document.getElementById('time') as HTMLElement;
;
  hword.innerText += '';

  interface getrounduser {
    roundUser: string;
  }
  interface getsound {
    message: String;
  }
 
  
  let time:number;
  let timeleft:number;

  interface Getround {
    currentWord: string,
    round:Number;
  }

  interface Gettime {
    time: number;
  }
  interface GuessedUsers {
    usernames: string[];
    }

    interface showrankData {
      firstPlace: string;
      secondPlace: string;
      thirdPlace: string;
      userPoints: Array<{username: string, points: number}>;
    }
const firstel=document.getElementById("first" ) as HTMLElement;
const secel=document.getElementById("second") as HTMLElement;
const thirdel=document.getElementById("third") as HTMLElement;
const firstp=document.getElementById("firstpoints")as HTMLElement;
const secp=document.getElementById("secondpoints")as HTMLElement;
const thirdp=document.getElementById("thirdpoints")as HTMLElement;

  this.http.post<Getround>('http://localhost:3000/api/game/showround',{roomId:this.roomId}).subscribe(data => {

  this.word= data.currentWord;
  this.round=data.round;


  hword.innerText = "_".repeat(this.word.length);

  roundshow.innerText = this.round.toString(); 

  if(this.round==11){
    
    this.http.post<showrankData>('http://localhost:3000/api/userroom/showrank', { roomId: this.roomId }).subscribe(data => {

    
      const firstPlace = data.firstPlace;
      const secondPlace = data.secondPlace;
      const thirdPlace = data.thirdPlace;
      const userPoints = data.userPoints;
  
      // Use the returned data here
      console.log(firstPlace);
      console.log(secondPlace);
      console.log(thirdPlace);
      console.log(userPoints);

      const fp=userPoints[0].points;
      const sp=userPoints[1].points;
      const tp=userPoints[2].points;


        bigdiv.style.display='block';
        canvasapp.style.display='none'; 
      
        firstel.innerText=firstPlace;
        secel.innerText=secondPlace;
        thirdel.innerText=thirdPlace;
      
        firstp.innerText=fp+" pt";
        secp.innerText=sp+" pt";
        thirdp.innerText=tp+" pt";


        hword.innerText='';
        timeshow.innerText='';
    
        wordheading.innerText='Game Over';
    
      
  });

  
  setTimeout(() => {
    this.http.post('http://localhost:3000/api/game/gamestop', { roomId: this.roomId }).subscribe(data => {

  });
    
  }, 15000); 


  }


  }
  , (error) => {

    if (error.status === 409) {
     console.error = function () {};
    }

    

 });

  

 const wordheading=document.getElementById('wordheading') as HTMLElement;
 const wordbox=document.getElementById('wordbox') as HTMLElement;
 const clearbtn=document.getElementById('clearbtn') as HTMLButtonElement;


 this.http.post<getrounduser>('http://localhost:3000/api/game/showrounduser', { roomId: this.roomId }).subscribe(data => {
 const currentrounduser = data.roundUser;

  const selecteduser=document.querySelector(`#user-${currentrounduser}`) as HTMLElement;
  selecteduser.classList.add("round-user");

  if(currentrounduser === this.username) {
    hword.innerText = this.word;
    
    wordheading.innerText='Draw the word';
    canvasapp.style.cursor='auto';
    canvasapp.style.pointerEvents='initial';
    clearbtn.style.display='block';

    }
    else
    {
      wordheading.innerText='Guess the word';
      canvasapp.style.cursor='not-allowed';
      canvasapp.style.pointerEvents='none';
      clearbtn.style.display='none';
    }
  
});
 
const audio = new Audio('./assets/r.mp3');


 this.http.post<Gettime>('http://localhost:3000/api/game/showtime',{ roomId: this.roomId}).subscribe(data => {


  time= data.time;
  timeleft= time-10;
  timeshow.innerText = timeleft.toString(); 

  if(time<10)
  {

    this.http.post<getsound>('http://localhost:3000/api/game/updatesound', { roomId: this.roomId }).subscribe(data => {

      const msg  = data.message;
     
      if(msg=="sound playing"){
        audio.play();
    
      }
       
     });

    timeshow.innerText = '0';
    if(time<10 && time>3){
      wordheading.innerText='The word was';
      hword.innerText=this.word;
    }


  }
  else if(timeleft==null)
  {
    timeshow.innerText = '';
  }


}, (error) => {
   if (error.status === 409) {
    console.error = function () {};
   }
});


}


startTimer(initialTime: number) {
  
  initialTime = initialTime / 1000;

  
  
  const interval = setInterval(() => {

    this.http.post('http://localhost:3000/api/game/updatetime',{ roomId: this.roomId,time:initialTime }).subscribe(data => {

}, (error) => {
   if (error.status === 409) {
    console.error = function () {};
   }
});
    // Decrement the initial time by 1 second
    initialTime--;

    
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
        this.router.navigate(['/home'], { queryParams: { username: this.username} });
      }
    },
    error: (error) => 
    {
      console.error('Error!', error)
    }
  });
    
  }


  gameend()
  {


const canvasapp=document.getElementById("canvasapp")as HTMLElement;
const bigdiv=document.getElementById("bigdiv")as HTMLElement;

bigdiv.style.display='block';
canvasapp.style.display='none';

  console.log('Updating round...');
this.http.post('http://localhost:3000/api/game/updateroundend', { roomId: this.roomId }).subscribe(data => {
   console.log('Round updated successfully');
});


 

    this.http.post('http://localhost:3000/api/userroom/getrank',{roomId:this.roomId}).subscribe(data => {

  });



  }



  // clearCanvas()
  // {
  //   this.canvasComponent.clearCanvas();

  // }



 
}