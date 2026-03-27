import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { VirtualPet } from '../../_models/virtualPet';
import parseColor from 'parse-color';

@Component({
  selector: 'app-virtual-pet',
  imports: [],
  templateUrl: './virtual-pet.html',
  styleUrl: './virtual-pet.css'
})
export class VirtualPetComponent implements AfterViewInit {
  @ViewChild('petCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() myPet?: VirtualPet;
  @Input() satiety: number = 100;
  @Input() mood: string = "Happy";
  @Input() petType: string = "Cat";
  init: boolean = false;
  
  petColor?: string;

  private moodImages: HTMLImageElement[] = [];
  private accessoryImages: HTMLImageElement[] = [];
  private petImages: HTMLImageElement[] = [];
  private imageSources = ['cat-base.png', 'dog-base.png', 'unicorn-base.png', 'happy.png', 'sad.png', 'angry.png', 'bored.png', 'collar-girl.png', 'collar-boy.png'];

  ngAfterViewInit() {
    this.init = true;
    this.preloadImages(this.imageSources).then(loadedImages => {
      this.petImages = loadedImages.slice(0,3);
      this.moodImages = loadedImages.slice(3,7);
      this.accessoryImages = loadedImages.slice(7);
      this.drawPet(); // Start drawing once loaded
    });
  }

  preloadImages(sources: string[]): Promise<HTMLImageElement[]> {
    const promises = sources.map(src => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    });
    return Promise.all(promises);
  }

  ngOnChanges(){
    if (this.init)
      this.drawPet();
  }
  public getCanvasImage(): string {
    return this.canvasRef.nativeElement.toDataURL('image/png');
  }
  drawSimplePetBase(ctx: any){
    switch (this.petType){
      case "Cat":
        ctx.drawImage(this.petImages[0], 0, 0, 300, 380);
        break;
      case "Dog":
        ctx.drawImage(this.petImages[1], 0, 0, 300, 380);
        break;
      case "Unicorn":
        ctx.drawImage(this.petImages[2], 0, 0, 300, 380);
        break;
    }
    const imageData = ctx.getImageData(0, 0, 300, 380);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];

      if (alpha > 0 && this.petColor) {
        const rgbColor = parseColor(this.petColor).rgb;
        // Blend original with tint
        data[i] = (data[i] + rgbColor[0]) / 2;     // red
        data[i + 1] = (data[i + 1] + rgbColor[1]) / 2; // green
        data[i + 2] = (data[i + 2] + rgbColor[2]) / 2; // blue
      }
    }

    ctx.putImageData(imageData, 0, 0);

    //add collar
    if(this.myPet?.gender == "Girl"){
      if (this.petType == "Unicorn"){
        ctx.drawImage(this.accessoryImages[0], 100, 210, 100, 50);
      }
      else
        ctx.drawImage(this.accessoryImages[0], 100, 240, 100, 50);
    }
    else{
      ctx.drawImage(this.accessoryImages[1], 100, 240, 100, 50);
    }

    // //write the pet's name on the collar
    // // Set styles
    // ctx.font = '12px Arial';
    // ctx.fillStyle = '#000000';

    // // Draw text
    // var name = this.myPet?.name || 'Spot';

    // const totalAngle = -0.6; // e.g. 0.5 radians
    // const angleStep = totalAngle / (name.length - 1);

    // // Start angle so text is centered
    // let startAngle = -totalAngle / 2;

    //   for (let i = 0; i < name.length; i++) {
    //     const char = name[i];
    //     const angle = startAngle + i * angleStep;

    //     ctx.save();

    //     // Move to center
    //     ctx.translate(155, 222);

    //     // Rotate for curve
    //     ctx.rotate(angle);

    //     // Draw character outward from center
    //     ctx.fillText(char, 1, 40);

    //     ctx.restore();
    //   }
  }

  drawMood(ctx: any){
    var drawMood = this.mood;
    if (this.myPet && this.myPet.getSatiety() < 50){
      drawMood = "Sad";      
    }
    const img = new Image();
    switch(drawMood){
      case "Happy":
        ctx.drawImage(this.moodImages[0], 70, 110, 160, 70);
        break;
      case "Angry":
        ctx.drawImage(this.moodImages[2], 70, 110, 160, 70);
        break;
      case "Sad":
        ctx.drawImage(this.moodImages[1], 70, 110, 160, 70);
        break;
      case "Bored":
        ctx.drawImage(this.moodImages[3], 70, 110, 160, 70);
        break;
      default:
        ctx.drawImage(this.moodImages[0], 70, 110, 160, 70);
      break;
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

    

    

    this.drawSimplePetBase(ctx);

    this.drawMood(ctx);
  }

}
