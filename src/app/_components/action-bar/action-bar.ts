import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { VirtualPet } from '../../_models/virtualPet';
import { VirtualPetComponent } from '../virtual-pet/virtual-pet';

@Component({
  selector: 'app-action-bar',
  imports: [],
  templateUrl: './action-bar.html',
  styleUrl: './action-bar.css',
})
export class ActionBar {
  @Input() myPet?: VirtualPet;
  @Output() photoClick = new EventEmitter<void>();
  feedPet(){
    if (this.myPet)
      this.myPet.feedPet()
  }

  takePhoto(){
    this.photoClick.emit();
  }
}
