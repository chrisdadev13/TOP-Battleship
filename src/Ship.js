class Ship{
  constructor(name, long, position, sunk = false){
    this.name = name;
    this.long = long;
    this.position = position;
    this.sunk = sunk;
  }

  setSunk(sunk){
    this.sunk = sunk;
    return this;
  }

  hit(target){
    for(let i = 0; i < this.position.length; i++){
      if(target == this.position[i]){
        this.position[i] = 'hit';
      }
    }
    return this.position;
  }

  isSunk(){
    for(let i = 0; i < this.position.length; i++){
      if(this.position[i] != 'hit'){
        this.setSunk(false)
      }else{
        this.setSunk(true);
      }
    }
    return this.sunk;
  }
}

module.exports = Ship;
