export default class Ship{
  initialRow: number;
  initialCol: number;

  longitude: number;
  hitCounter: number;
  sunk: boolean;

  coordinates: number[];

  constructor(longitude: number, hitCounter: number, sunk: boolean, coordinates: number[]){
    this.longitude = longitude;
    this.hitCounter = hitCounter;
    this.sunk = hitCounter == longitude ? true : false;
    this.coordinates = coordinates;
  }

  positionX(direction: boolean = false, row: number, col: number){
    this.initialRow = row;
    for(let i = 0; i < this.longitude; i++){
      this.coordinates.push(col + i);
    }
  }

  positionY(direction: boolean = true, row: number, col: number){
    this.initialCol = col;
    for(let i = 0; i < this.longitude; i++){
      this.coordinates.push(row + i);
    }
  }

  hitX(row: number, col: number){
    if(row == this.initialRow){
      for(let i = 0; i < this.coordinates.length; i++){
        if(col == this.coordinates[i]){
          this.hitCounter++;
        }
      }
    }
  }

  hitY(row: number, col: number){
    if(col == this.initialCol){
      for(let i = 0; i < this.coordinates.length; i++){
        if(row == this.coordinates[i]){
          this.hitCounter++;
        }
      }
    } 
  }

  isSunk(){
    if(this.hitCounter == this.longitude){
      this.sunk = true;
      return this.sunk;
    }
  }
}
