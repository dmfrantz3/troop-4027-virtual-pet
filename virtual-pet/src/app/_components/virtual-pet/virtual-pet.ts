import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DataService } from '../../_services/data.service';
import { VirtualPet } from '../../_models/virtualPet';

@Component({
  selector: 'app-virtual-pet',
  imports: [],
  templateUrl: './virtual-pet.html'
})
export class VirtualPetComponent implements AfterViewInit {
  @ViewChild('petCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() myPet?: VirtualPet;
  @Input() satiety: number = 100;
  init: boolean = false;
  
  petColor?: string;

  ngAfterViewInit() {
    this.init = true;
    this.drawPet();
  }
  ngOnChanges(){
    if (this.init)
      this.drawPet();
  }

  drawMouth(ctx: any){
    if (this.myPet && this.myPet.getSatiety() < 50){
      //draw a frown
      ctx.strokeStyle = '#2F5D50';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(150, 205, 20, Math.PI, 0);
      ctx.stroke();
    }
    else{
      // 😊 Smile
      ctx.strokeStyle = '#2F5D50';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(150, 185, 20, 0, Math.PI);
      ctx.stroke();
    }
  }

  drawPet() {
    this.petColor = this.myPet?.color;
    if (!this.petColor)
      this.petColor = "#000000";
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Clear canvas (transparent background)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🐾 PET BODY (rounded blob)
    ctx.beginPath();
    ctx.arc(150, 170, 80, 0, Math.PI * 2);
    ctx.fillStyle = this.petColor;
    ctx.fill();

    // 👂 LEFT EAR
    ctx.beginPath();
    ctx.ellipse(100, 100, 30, 50, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // 👂 RIGHT EAR
    ctx.beginPath();
    ctx.ellipse(200, 100, 30, 50, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // 👀 EYES
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(120, 150, 12, 0, Math.PI * 2);
    ctx.arc(180, 150, 12, 0, Math.PI * 2);
    ctx.fill();

    // 👁 Pupils
    ctx.fillStyle = '#2F5D50';
    ctx.beginPath();
    ctx.arc(120, 150, 6, 0, Math.PI * 2);
    ctx.arc(180, 150, 6, 0, Math.PI * 2);
    ctx.fill();

    this.drawMouth(ctx);
  }

}
