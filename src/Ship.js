const Ship = (name,  direction, long, position, sunk = false) => {
  const hit = (target) => {
    for(let i = 0; i < position.length; i++){
      if(target == position[i]){
        position[i] = 'hit';
      }
    }
    return position;
  }

  const isSunk = () => {
    for(let i = 0; i < position.length; i++){
      if(position[i] != 'hit'){
        sunk = false;
      }else{
        sunk = true;
      }
    }
    return sunk;
  }
  return { name, direction, long, position, sunk, hit, isSunk };
}

module.exports = Ship;
