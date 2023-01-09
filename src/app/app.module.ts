import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { PlayComponent } from './play/play.component';
import { RoomComponent } from './room/room.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BoardComponent } from './board/board.component';
import { ContainerComponent } from './container/container.component';
import { CanvasComponent } from './canvas/canvas.component';
import { ChatComponent } from './chat/chat.component';



@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    HomeComponent,
    PlayComponent,
    RoomComponent,
    BoardComponent,
    ContainerComponent,
    CanvasComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})



export class AppModule { }
