import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { CanvasComponent } from './canvas/canvas.component';
import { PlayComponent } from './play/play.component';
import { ChatComponent } from './chat/chat.component';
import { SelectRoomComponent } from './select-room/select-room.component';

const routes: Routes = [
  {path:'',component:SigninComponent},
  { path: 'home',component:HomeComponent },
  { path: 'signup',component:SignupComponent },
  { path: 'canvas',component:CanvasComponent },
  { path: 'play',component:PlayComponent },
  { path: 'chat',component:ChatComponent},
  { path: 'selectroom',component:SelectRoomComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
