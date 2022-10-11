import Ship from "./ship";

const BOARD_SIZE = 10;

export default class Gameboard{
  board: Array<any>;

  constructor(){
    this.board = [];
    this.init();
  }

  init(){
    for(let row = 0; row < BOARD_SIZE; row++){
      this.board[row] = [];
      for(let col = 0; col < BOARD_SIZE; col++){
        this.board[row][col] = 0; 
      }
    }
  }

  receiveAttack(row: number, col: number){
    if(this.board[row][col] == 0)
      this.board[row][col] = "X"; 
    else 
      if(typeof this.board[row][col] == 'object')
        this.board[row][col] = "Hitted";
  }

  placeShip(ship: Ship, row: number, col: number, vertical: boolean){
    if(vertical == true && this.isShipPlaceable(ship, row, col, vertical) == true){
      for(let i = 0; i < ship.longitude; i++){
        this.board[row + i][col] = ship;
      } 
      this.enableShipPlace(ship, row, col, vertical);
      return true;
    }        
    else if(vertical == false && this.isShipPlaceable(ship, row, col, vertical) == true){
      for(let i = 0; i < ship.longitude; i++){
        this.board[row][col + i] = ship;
      }
      this.enableShipPlace(ship, row, col, vertical);
      return true;
    }
  }

  enableShipPlace(ship: Ship, row: number, col: number, vertical: boolean){
    let colsCounter = 0;
    let rowsCounter = 0;

    for(let i = col; i < 10; i++){ 
      colsCounter++;
    }
    for(let i = row; i < 10; i++){
      rowsCounter++;
    }

    if(vertical == true){
      if(col == 0){
        if(row == 0){
          this.board[row + ship.longitude][col] = 1;
          for(let i = row; i <= row + ship.longitude - 1; i++){
            this.board[i][col + 1] = 1;
          }
        }
        else if(ship.longitude == rowsCounter){
          this.board[row - 1][col] = 1;
          for(let i = row; i <= row + ship.longitude - 1; i++){
            this.board[i][col + 1] = 1;
          }
        }
        else{
          this.board[row - 1][col] = 1;
          this.board[row + ship.longitude][col] = 1;
          for(let i = row; i <= row + ship.longitude - 1; i++){
            this.board[i][col + 1] = 1;
          }
        }
      }
      else if(col == 9){
        if(row == 0){
          this.board[row + ship.longitude][col] = 1;
          for(let i = row; i <= row + ship.longitude - 1; i++){
            this.board[i][col - 1] = 1;
          }
        }
        else if(ship.longitude == rowsCounter){
          this.board[row - 1][col] = 1;
          for(let i = row; i <= row + ship.longitude - 1; i++){
            this.board[i][col - 1] = 1;
          }
        }
        else{
          this.board[row - 1][col] = 1;
          this.board[row + ship.longitude][col] = 1;
          for(let i = row; i <= row + ship.longitude - 1; i++){
            this.board[i][col - 1] = 1;
          }
        }
      }
      else{
        if(row == 0){
          this.board[row + ship.longitude][col] = 1;
          for(let i = row; i <= row + ship.longitude - 1; i++){
            this.board[i][col - 1] = 1;
            this.board[i][col + 1] = 1;
          }
        }
        else if(ship.longitude == rowsCounter){
          this.board[row - 1][col] = 1;
          for(let i = row; i <= row + ship.longitude - 1; i++){
            this.board[i][col - 1] = 1;
            this.board[i][col + 1] = 1;
          }
        }
        else{
          this.board[row - 1][col] = 1;
          this.board[row + ship.longitude][col] = 1;
          for(let i = row; i <= row + ship.longitude - 1; i++){
            this.board[i][col - 1] = 1;
            this.board[i][col + 1] = 1;
          }
        }
      }
    }
    else{
      if(row == 0){
        if(col == 0){
          this.board[row][col + ship.longitude] = 1;
          for(let i = col; i <= col + ship.longitude - 1; i++){
            this.board[row + 1][i] = 1;
          }
        }
        else if(ship.longitude == colsCounter){
          this.board[row][col - 1] = 1;
          for(let i = col; i <= col + ship.longitude - 1; i++){
            this.board[row + 1][i] = 1;
          }
        }
        else{
          this.board[row][col + ship.longitude] = 1;
          this.board[row][col - 1] = 1;
          for(let i = col; i <= col + ship.longitude - 1; i++){
            this.board[row + 1][i] = 1;
          }
        }
      }
      else if(row == 9){
        if(col == 0){
          this.board[row][col + ship.longitude] = 1;
          for(let i = col; i <= col + ship.longitude - 1; i++){
            this.board[row - 1][i] = 1;
          }
        }
        else if(ship.longitude == colsCounter){
          this.board[row][col - 1] = 1;
          for(let i = col; i <= col + ship.longitude - 1; i++){
            this.board[row - 1][i] = 1;
          }
        }
        else{
          this.board[row][col + ship.longitude] = 1;
          this.board[row][col - 1] = 1;
          for(let i = col; i <= col + ship.longitude - 1; i++){
            this.board[row-1][i] = 1;
          }
        }
      }
      else{
        if(col == 0){
          this.board[row][col + ship.longitude] = 1;
          for(let i = col; i <= col + ship.longitude - 1; i++){
            this.board[row + 1][i] = 1;
            this.board[row - 1][i] = 1;
          }
        }
        else if(ship.longitude == colsCounter){
          this.board[row][col - 1] = 1;
          for(let i = col; i <= col + ship.longitude - 1; i++){
            this.board[row + 1][i] = 1;
            this.board[row - 1][i] = 1;
          }
        }
        else{
          this.board[row][col + ship.longitude] = 1;
          this.board[row][col - 1] = 1;
          for(let i = col; i <= col + ship.longitude - 1; i++){
            this.board[row + 1][i] = 1;
            this.board[row - 1][i] = 1;
          }
        }
      }
    }
  }

  shipCollisions(ship: Ship, row: number, col: number, vertical: boolean){
    let colCollision: boolean;
    let colsCounter = 0; 
    let rowCollision: boolean;
    let rowsCounter = 0;

    let counter = 0;

    for(let i = col; i < 10; i++){ 
      colsCounter++;
    }
    for(let i = row; i < 10; i++){
      rowsCounter++;
    }
    if(vertical == false){
      if(ship.longitude > colsCounter){
        return true;
      }else {
        while(counter < ship.longitude){
          if(this.board[row][col + counter] != 0){
            colCollision = true;
            break;
          }
          else if(this.board[row][col + counter] == 0)
            colCollision = false;
          counter++;
        }
      }
      return colCollision;
    }
    else{
      if(ship.longitude > rowsCounter){
        return true;
      }else{
        while(counter < ship.longitude){
          if(this.board[row + counter][col] != 0){
            rowCollision = true;
            break;
          }
          else if(this.board[row + counter][col] == 0)  
            rowCollision = false;
          counter++;
        }
      }
      return rowCollision;
    }
  }

  isShipPlaceable(ship: Ship, row: number, col: number, vertical: boolean){
    if(this.board[row][col] != 0 && this.shipCollisions(ship, row, col, vertical) == true){
      return false;
    }else if(this.board[row][col] == 0 && this.shipCollisions(ship, row, col, vertical) == false){
      return true;
    }
  }

  placeShipRandomly(){
    let counter = 0;

    let carrier = new Ship(4, [], false);
    let battleship = new Ship(4, [], false);
    let cruiser = new Ship(3, [], false);
    let submarine = new Ship(2, [], false);
    let patrol = new Ship(2, [], false);

    let row: number;
    let col: number;

    let verticalSelector: number;
    let vertical: boolean;

    do{
      verticalSelector = Math.random();
      vertical = verticalSelector > 0.5 ? true : false;

      row = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
      col = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
      switch(counter){
        case 0:
          if(this.board[row][col] != 0){
            while(this.board[row][col] != 0){
              row = Math.floor(Math.random() * (9 + 1));
              col = Math.floor(Math.random() * (9 + 1));
            }
            this.placeShip(carrier, row, col, vertical);
          }
          else{
            this.placeShip(carrier, row, col, vertical); 
          }
        case 1:
          if(this.board[row][col] != 0){
            while(this.board[row][col] != 0){
              row = Math.floor(Math.random() * (9 + 1));
              col = Math.floor(Math.random() * (9 + 1));
            }
            this.placeShip(battleship, row, col, vertical);
          }
          else{
            this.placeShip(battleship, row, col, vertical); 
          }
        case 2:
          if(this.board[row][col] != 0){
            while(this.board[row][col] != 0){
              row = Math.floor(Math.random() * (9 + 1));
              col = Math.floor(Math.random() * (9 + 1));
            }
            this.placeShip(cruiser, row, col, vertical);
          }
          else{
            this.placeShip(cruiser, row, col, vertical); 
          }
        case 3: 
          if(this.board[row][col] != 0){
            while(this.board[row][col] != 0){
              row = Math.floor(Math.random() * (9 + 1));
              col = Math.floor(Math.random() * (9 + 1));
            }
            this.placeShip(submarine, row, col, vertical);
          }
          else{
            this.placeShip(submarine, row, col, vertical); 
          }
        case 4:
          if(this.board[row][col] != 0){
            while(this.board[row][col] != 0){
              row = Math.floor(Math.random() * (9 + 1));
              col = Math.floor(Math.random() * (9 + 1));
            }
            this.placeShip(patrol, row, col, vertical);
          }
          else{
            this.placeShip(patrol, row, col, vertical); 
          }
      }
      counter++;
    }while(counter < 6);
  }

}
