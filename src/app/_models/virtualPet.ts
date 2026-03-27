export class VirtualPet {
  name:string;
  color:string;
  mood: string;
  attribute2: string;
  attribute3: string;
  satiety: number = 100;

  constructor(name: string, color: string, mood: string, attribute2: string, attribute3: string) {
    this.name = name;
    this.color = color;
    this.mood = mood;
    this.attribute2 = attribute2;
    this.attribute3 = attribute3;
  }

  emptyBelly(){
    this.satiety = this.satiety - 20;
  }
  feedPet(){
    console.log("NOM... NOM... NOM")
    this.satiety +=20;
  }
  getSatiety(): number{
    if (this.satiety)
        return this.satiety
    else
        return 0
  }
}