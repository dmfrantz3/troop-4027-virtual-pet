import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { VirtualPet } from '../../_models/virtualPet';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-satiety',
  imports: [CommonModule],
  templateUrl: './satiety.html'
})
export class Satiety {
  @Input() satiety: number = 100;
}
