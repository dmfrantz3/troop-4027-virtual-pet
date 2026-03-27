import { Component, Input } from '@angular/core';
import { VirtualPet } from '../../_models/virtualPet';

@Component({
  selector: 'app-action-bar',
  imports: [],
  templateUrl: './action-bar.html',
  styleUrl: './action-bar.css',
})
export class ActionBar {
  @Input() myPet?: VirtualPet
  feedPet(){
    if (this.myPet)
      this.myPet.feedPet()
  }
}
