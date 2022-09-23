export default class Battleship{
  constructor(long, position, row = true, sunk = false){
    this.long = long;
    this.position = position;
    this.sunk = sunk;
    this.row = row;
  }

  changeDirection(){
    this.row = !this.row;
    return this.row;
  }

  hit(target){
    for(let i = 0; i < this.position.length; i++){
      if(this.position[i] == target){
        this.position[i] = 'Hitted';
      }
    }
  }

  isSunk(){
    if(this.position.every('Hitted')){
      this.sunk = true;
      return this.sunk;
    }
  }
}
