import { Component, HostListener } from '@angular/core';



@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  private currentColor = '#000000';
  private ws: WebSocket;

  constructor() {
    
  }

  ngOnInit() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = this.canvas.getContext('2d');
    if(ctx) {
      this.context = ctx;
    }

    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.onopen = () => {
      console.log('Connection opened! - drawing');
    };
  }

 
  // Set up mouse events for drawing
  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    this.isDrawing = true;
    this.lastX = event.offsetX;
    this.lastY = event.offsetY;
    this.draw(event.offsetX, event.offsetY);
  }
  

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    this.isDrawing = false;
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    if (this.isDrawing) {
      this.draw(event.offsetX, event.offsetY);
      this.lastX = event.offsetX;
      this.lastY = event.offsetY;
    }
  }
  

  // // Set up touch events for drawing on mobile devices
  // @HostListener('touchstart', ['$event']) onTouchStart(event: TouchEvent) {
  //   const touch = event.touches[0];
  //   this.isDrawing = true;
  //   this.lastX = touch.clientX - this.canvas.offsetLeft;
  //   this.lastY = touch.clientY - this.canvas.offsetTop;
  // }

  // @HostListener('touchend', ['$event']) onTouchEnd(event: TouchEvent) {
  //   this.isDrawing = false;
  // }

  // @HostListener('touchmove', ['$event']) onTouchMove(event: TouchEvent) {
  //   const touch = event.touches[0];
  //   if (this.isDrawing) {
  //     const rect = this.canvas.getBoundingClientRect();
  //     this.draw(touch.clientX - rect.left, touch.clientY - rect.top);
  //   }
  // }
  

  public draw(x: number, y: number) {
    this.context.strokeStyle = this.currentColor;
    this.context.lineWidth = 3;
    this.context.beginPath();
    this.context.moveTo(this.lastX, this.lastY);
    this.context.lineTo(x, y);
    this.context.stroke();
    this.lastX = x;
    this.lastY = y;
 
    console.log(this.lastX)
    console.log(this.lastY)

    this.ws.send(JSON.stringify({
      x: this.lastX,
      y: this.lastY,
      color: this.currentColor
      
    }));
  }
  

}
