import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
  @Output() satiety = new EventEmitter<void>();
  @ViewChild('foodItem') foodItem!: ElementRef<HTMLImageElement>;
  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;
  currentX = 0;
  currentY = 0;

  ngAfterViewInit(): void {
    const item = this.foodItem.nativeElement;

    item.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
  }
  onPointerDown = (event: PointerEvent) => {
    this.isDragging = true;
    const item = this.foodItem.nativeElement;
    item.classList.add('dragging');
    item.setPointerCapture?.(event.pointerId);

    // this.offsetX = event.clientX - rect.left;
    // this.offsetY = event.clientY - rect.top;

  };

  onPointerMove = (event: PointerEvent) => {
    if (!this.isDragging) return;
      console.log('pointer move');
    
    if (!this.isDragging) return;

    const item = this.foodItem.nativeElement;
    this.currentX = event.clientX-400;
    this.currentY = event.clientY - 700;

    item.style.left = this.currentX+'px';
    item.style.top = this.currentY+'px';
  };

  onPointerUp = (event: PointerEvent) => {
    console.log('pointer up fired');
    if (!this.isDragging) return;
    let x = event.clientX;
    let y = event.clientY;

    const item = this.foodItem.nativeElement;
    this.isDragging = false;
    item.classList.remove('dragging');

    const mouthRect = {xMin:537, yMin: 440, xMax: 590, yMax: 490};
    if ((x >= mouthRect.xMin && x <= mouthRect.xMax) && (y >= mouthRect.yMin && y <= mouthRect.yMax)){
      this.satiety.emit();
    }
    item.style.left = '20px';
    item.style.top = '26px';
  };
  feedPet(){
    console.log("FEEDING THE PET..."+this.myPet?.satiety);
    if (this.myPet)
      this.satiety.emit();
  }

  takePhoto(){
    this.photoClick.emit();
  }
}
