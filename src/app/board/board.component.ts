import { Component, OnInit, ViewChild, ElementRef,Input } from '@angular/core';
import { CanvasRenderingContext2D } from 'canvas';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent{

  // @Input() color: string;
  // @Input() size: string;
 
  // @ViewChild('canvas') canvas: ElementRef;
  // ctx: CanvasRenderingContext2D;
  

  // timeout: any = null;

  // socket = io.connect('http://localhost:6969');

  // isDrawing = false;


  // constructor() { 
  //   this.ngOnInit();
  // }

  // ngOnInit() {
  //   this.socket.on('canvas-data', (data: string) => {
  //     const root = this;
  //     const interval = setInterval(() => {
  //       if (root.isDrawing) return;
  //       root.isDrawing = true;
  //       clearInterval(interval);
  //       const image = new Image();

  //       // const canvas = document.getElementById('board')! as HTMLCanvasElement;
  //       // const ctx = canvas.getContext('2d');
  //       const ctx = this.canvas.nativeElement.getContext('2d');
  //       console.log('ng onit ctx : ',ctx)
  //       image.onload = () => {
  //         ctx.drawImage(image, 0, 0);
  //         root.isDrawing = false;

  //       };
  //       image.src = data;
  //     }, 200);
  //   });

  //   this.drawOnCanvas();
  // }

  // drawOnCanvas() { 
  //   const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
  //   console.log('canvas : ',canvas)
  //   // this.ctx = this.board.nativeElement.getContext('2d');
  //   const ctx = this.ctx;
  //   console.log('ctx : ',ctx)

  //   const sketch = document.getElementById('sketch')! as HTMLElement;
  //   const sketchStyle = getComputedStyle(sketch);
  //   canvas.width = parseInt(sketchStyle.getPropertyValue('width'), 10);
  //   canvas.height = parseInt(sketchStyle.getPropertyValue('height'), 10);

  //   const mouse = { x: 0, y: 0 };
  //   const lastMouse = { x: 0, y: 0 };

  //   /* Mouse Capturing Work */
  //   canvas.addEventListener('mousemove', (e: MouseEvent) => {
  //     lastMouse.x = mouse.x;
  //     lastMouse.y = mouse.y;

  //     mouse.x = e.pageX - (this as any).offsetLeft;
  //     mouse.y = e.pageY - (this as any).offsetTop;
  //   }, false);

  //   /* Drawing on Paint App */
  //   ctx.lineWidth = Number(this.size);
  //   ctx.lineJoin = 'round';
  //   ctx.lineCap = 'round';
  //   ctx.strokeStyle = this.color;

    

  //   canvas.addEventListener('mousedown', () => {
  //     canvas.addEventListener('mousemove', onPaint, false);
  //   }, false);

  //   canvas.addEventListener('mouseup', () => {
  //     canvas.removeEventListener('mousemove', onPaint, false);
  //   }, false);

  //   const root = this;
  //   const onPaint = () => {
  //     ctx.beginPath();
  //     ctx.moveTo(lastMouse.x, lastMouse.y);
  //     ctx.lineTo(mouse.x, mouse.y);
  //     ctx.closePath();
  //     ctx.stroke();

  //     if (root.timeout != null) clearTimeout(root.timeout);
  //     root.timeout = setTimeout(() => {
  //       const base64ImageData = canvas.toDataURL('image/png');
  //       root.socket.emit('canvas-data', base64ImageData);
  //     }, 1000);
  //   };
  // }
}



