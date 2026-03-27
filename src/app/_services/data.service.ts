import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { VirtualPet } from '../_models/virtualPet';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  myPet: VirtualPet = new VirtualPet("Spot","#ff0000","Happy","Cat","Girl");
  constructor() { }
    
}