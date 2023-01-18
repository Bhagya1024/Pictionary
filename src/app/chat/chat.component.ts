import { Component,EventEmitter, Output,Input  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  username: string | undefined;
  roomId: string;
  @Output() messageEvent = new EventEmitter<{sender: string, message: string,room: string }>();
  @Input() word: string;
  @Input() round: Number;
 


  constructor(private http: HttpClient, private route: ActivatedRoute) {}
  
  ngOnInit() {

    let guessed = false;
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      this.roomId=params['roomId'];
      // Do something with the username
      console.log(this.roomId)
    });
    
    const audio = new Audio('./assets/round.mp3');

    const messages = document.querySelector('#messages') as HTMLElement;
    const messageBox = document.querySelector('#messageBox') as HTMLInputElement;
    const hword = document.querySelector('#wordhidden') as HTMLElement;

    let ws: WebSocket | null;

    const uname=this.username

    const showMessage = (data: any) => {
      let message: string = 'unknown message';
      let sender: string = 'unknown';
      let room: string = 'unknown';
      if (typeof data === 'string') {
        const parsedData = JSON.parse(data);
        sender = parsedData.sender;
        message = parsedData.message;
        room = parsedData.room;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const parsedData = JSON.parse(reader.result as string);
          sender = parsedData.sender;
          message = parsedData.message;
          room = parsedData.room;
        };
        reader.readAsText(data);
      }
      if (room === this.roomId) {

        if(message === this.word){
          this.addpoints(sender,this.round);

          audio.play();

          messages.innerHTML += `\n<span class="chattxt" style="font-family: 'poppins-r';
          font-size: 14px;
          width: 100%;
          margin-left: 12px;
          overflow-x: hidden;
          color:rgb(6, 176, 14);
          background-color:rgba(6, 176, 14, 0.185);
          padding:8px;
          text-align: center;"> ${sender} guessed the word</span>\n`;
          messages.scrollTop = messages.scrollHeight;
          messageBox.value = '';
          
          // if(sender === this.username ){
          //   hword.innerText=this.word;
          // }
          
        }

        else{
          messages.innerHTML += `\n<span class="chattxt" style="font-family: 'poppins-r';
          font-size: 14px;
          width: 100%;
          margin-left: 12px;
          overflow-x: hidden;"> <span class="uname" style="font-family: 'poppins-s';">${sender}</span><span style="margin-right: 8px;">:</span> ${message}</span>\n`;
          messages.scrollTop = messages.scrollHeight;
          messageBox.value = '';
        }
 
      }
   
    }

    function init() {
      if (ws) {
        ws.onerror = ws.onopen = ws.onclose = null;
        ws.close();
      }

      ws = new WebSocket('ws://localhost:6969');
      ws.onopen = () => {
        console.log('Connection opened!');
      }
      ws.onmessage = ({ data }) => {
        if (typeof data === 'string') {
          showMessage(data);
        } else if (data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => showMessage(reader.result as string);
          reader.readAsText(data);
        }
      };
      
      ws.onclose = function() {
        ws = null;
      }
    }

    messageBox.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && ws) {
        const messageObject = {
          sender: uname!,
          message: messageBox.value,
          room: this.roomId
        };
        ws.send(JSON.stringify(messageObject));
        this.messageEvent.emit(messageObject);
        showMessage(JSON.stringify(messageObject));
      }
    });

    init();

    
  }

  addpoints(sender:String,round:Number){

    const body={
      username:sender,
      roomId:this.roomId,
      round:round,
      guessed:1
    }
    this.http.post('http://localhost:3000/api/userroom/addpoints',body).subscribe(data => {
  
  }, (error) => {
     if (error.status === 409) {
      console.error = function () {};
     }
  });

  }
}


