import { AfterViewInit, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
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
  currentFrame: number = 0;
  currentMouthFrame: number = 0;
  isEating: Boolean = false;
  isBlinking: Boolean = false;
  lastSatiety: number = 100;
  private moodImages: HTMLImageElement[] = [];
  private accessoryImages: HTMLImageElement[] = [];
  private petImages: HTMLImageElement[] = [];
  private petEyes: HTMLImageElement[] = [];
  private imageSources = ['cat-base.png', 'dog-base.png', 'unicorn-base.png', 'cat-mouth-closed.png', 'cat-mouth-open.png', 'unicorn-mouth-closed.png', 'unicorn-mouth-open.png', 'collar-girl.png', 'collar-boy.png', 'happy-eyes.png', 'eyes-half.png', 'eyes-closed.png'];

  ngAfterViewInit() {
    setInterval(() => {
    // random delay between blinks
    if (!this.isBlinking && Math.random() < 0.3) {
        this.blink();
      }
    }, 2000);
    this.init = true;
    this.preloadImages(this.imageSources).then(loadedImages => {
      this.petImages = loadedImages.slice(0,3);
      this.moodImages = loadedImages.slice(3,7);
      this.accessoryImages = loadedImages.slice(7,9);
      this.petEyes = loadedImages.slice(9,12)
      this.drawPet(); // Start drawing once loaded
    });
  }
  eat(){
    if (this.isEating) return;
    console.log("STARTED EATING");
    this.isEating = true;
    var frameCount = 4;
    const eatInterval = setInterval(()=>{
      this.currentMouthFrame = frameCount % 2;
      console.log("MOUTH FRAME "+this.currentMouthFrame);
      this.drawPet();
      frameCount--;
      if (frameCount <= 0){
        clearInterval(eatInterval);
        console.log("STOPPED EATING");
        this.currentMouthFrame = 0;
        this.isEating = false;
        this.drawPet();
      }
    }, 100);
  }
  blink(){
    if (this.isBlinking) return;
    console.log("STARTED A BLINK");
    this.isBlinking = true;
    var frameIndex = 0;
    const blinkInterval = setInterval(() => { 
      this.currentFrame = frameIndex;
      this.drawPet();
      frameIndex++;
      console.log("BLINKED..."+frameIndex);
      if (frameIndex >= 3) {
        clearInterval(blinkInterval);
        setTimeout(() => {
          this.currentFrame = 0;
          this.drawPet();
          console.log("STOPPED BLINKING");
          this.isBlinking = false;
        }, 100);
      }
    }, 100); // speed of blink
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

  ngOnChanges(changes: SimpleChanges){
    if (this.init && changes['satiety']){
      const change = changes['satiety'];
      if (change.currentValue > change.previousValue)
        this.eat();
      //else
        //this.drawPet();
    }
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
    var collarImg = this.accessoryImages[0];
    if(this.myPet?.gender != "Girl")
      collarImg = this.accessoryImages[1];

    //add collar
    if (this.petType == "Unicorn"){
      ctx.drawImage(collarImg, 100, 210, 100, 50);
    }
    else if (this.petType == "Dog"){
      ctx.drawImage(collarImg, 100, 215, 100, 50);
    }
    else
      ctx.drawImage(collarImg, 100, 240, 100, 50);

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

    const img = new Image();
    //draw animated eyes
    switch(this.myPet?.petType){
      case 'Unicorn':
        ctx.drawImage(this.petEyes[this.currentFrame], 90, 120, 120, 50);
        ctx.drawImage(this.moodImages[this.currentMouthFrame+2], 120, 140, 60, 50);
        break;
      default:
        ctx.drawImage(this.petEyes[this.currentFrame], 70, 110, 160, 70);
        ctx.drawImage(this.moodImages[this.currentMouthFrame], 120, 140, 60, 80);
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
