import { Component } from '@angular/core';
import { BoardComponent } from '../board/board.component';


@Component({
  selector: 'app-container',
  templateUrl: `./container.component.html`,
  styleUrls: ['./container.component.css']
})

export class ContainerComponent {

  color: string = "#000000";
  size: string = "5";
  

  changeColor(event: any) {
    this.color = event.target.value;
  }

  changeSize(event: any) {
    this.size = event.target.value;
  }
}
