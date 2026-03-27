import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VirtualPet } from '../../_models/virtualPet';
import { DataService } from '../../_services/data.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-pet-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './create-pet-form.html',
  styleUrl: './create-pet-form.css',
})
export class CreatePetForm {
  myPet?: VirtualPet;
  constructor(private dataService: DataService, private router: Router){
    this.myPet = this.dataService.myPet;
  }

  createPet(){
    if (this.myPet && this.myPet.name && this.myPet.color){
      console.log("HELLO...");
      this.dataService.myPet = this.myPet;
      this.router.navigate(['/play']);
    }
    else{
      alert("Make sure to fill in all the information about your pet.")
    }
  }
}
