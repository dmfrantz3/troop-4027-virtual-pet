import { Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import { Satiety } from '../satiety/satiety';
import { VirtualPetComponent } from '../virtual-pet/virtual-pet';
import { ActionBar } from '../action-bar/action-bar';
import { DataService } from '../../_services/data.service';
import { CommonModule } from '@angular/common';
import { VirtualPet } from '../../_models/virtualPet';
import { Router } from '@angular/router';


@Component({
  selector: 'app-main-game',
  imports: [VirtualPetComponent, Satiety, ActionBar, CommonModule],
  templateUrl: './main-game.html',
  styleUrl: './main-game.css',
})
export class MainGame {
  intervalId: any;
  gameOver: boolean = false;
  myPet?: VirtualPet;
  private petComponent: VirtualPetComponent | undefined;
  @ViewChild(VirtualPetComponent) set content(content: VirtualPetComponent) {
   if(content) { 
       this.petComponent = content;
   }
}

  constructor(private dataService: DataService, private router: Router, private cdr: ChangeDetectorRef){
    this.myPet = this.dataService.myPet;
  }
  ngOnInit(){
    if (!this.myPet || !this.myPet.name){
      this.router.navigate(['/']);
    }
    else{
      this.intervalId = setInterval(() => {
      if (!this.myPet || this.myPet.getSatiety() <= 0) {
        this.endGame();
        return;
      }
      this.myPet.emptyBelly();
      this.cdr.detectChanges();
    }, 5000);
    }
  }
  endGame(){
    this.gameOver = true;
    this.cdr.detectChanges();
  }
  feedPet(){
    if (this.myPet)
      this.myPet.satiety = this.myPet.feedPet();
  }
  takePhoto(){
    if (this.myPet && this.petComponent) {
      const dataUrl = this.petComponent.getCanvasImage();
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'canvas-image.png';
      link.click();
    }
      
  }
}
