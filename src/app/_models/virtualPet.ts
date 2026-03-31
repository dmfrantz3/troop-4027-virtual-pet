export class VirtualPet {
  name:string;
  color:string;
  mood: string;
  petType: string;
  gender: string;
  satiety: number = 100;
  
  constructor(name: string, color: string, mood: string, petType: string, gender: string) {
    this.name = name;
    this.color = color;
    this.mood = mood;
    this.petType = petType;
    this.gender = gender;
  }

  emptyBelly(){
    this.satiety = this.satiety - 5;
  }
  feedPet(): number{
    if (this.satiety+20 > 100)
      return 100;
    return this.satiety+20;
  }
  getSatiety(): number{
    if (this.satiety)
        return this.satiety
    else
        return 0
  }
}