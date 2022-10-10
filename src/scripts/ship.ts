export default class Ship{
  longitude: number;
  hitted: (string)[];
  sunk: boolean;

  constructor(longitude: number, hitted: (string)[], sunk = false){
    this.longitude = longitude;
    this.hitted = hitted;
    this.sunk = sunk;
  }

  hit(target: string){
    if(target == 'Hitted'){
      this.hitted.push(target);
    }
  }

  isSunk(){
    return this.longitude == this.hitted.length ? true : false;
  }
}
