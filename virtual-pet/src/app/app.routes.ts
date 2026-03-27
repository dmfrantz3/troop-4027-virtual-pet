import { Routes } from '@angular/router';
import { MainGame } from './_components/main-game/main-game';
import { CreatePetForm } from './_components/create-pet-form/create-pet-form';

export const routes: Routes = [
    { path: '', component: CreatePetForm },
    {path: 'play',component: MainGame}
];
