import { TILE_HEADER, TILE_SHIP, TILE_WATER } from "../Components/Tile";

export function erasePreviews(newRows, boardSize){
    // Remove the previews;
    for (let row = 1; row < boardSize; row++){
        for(let column = 1; column < boardSize; column++){
            const tile = newRows[row][column];
            newRows[row][column] = {...tile, previewType: ""};
        }
    }
};

export const getRandomCoordinates = (boardSize) => {
  const randomRowIndex = Math.floor(Math.random() * boardSize) + 1;
  const randomColumnIndex = Math.floor(Math.random() * boardSize) + 1;
  return { rowIndex: randomRowIndex, columnIndex: randomColumnIndex };
};


export function placeShip(board, coordinates, ship, direction){
    if ((direction === "vertical" && coordinates.rowIndex + ship.size > 11) || 
        (direction === "horizontal" && coordinates.columnIndex + ship.size > 11)) {
      return false;
    }

    console.log(`Coordinates : ${coordinates.rowIndex} ${coordinates.columnIndex}`);

    // Check if the ship is overlapping with another one
    const isOverlapping = (rowIndex, columnIndex) => {
      const tile = board[rowIndex][columnIndex];
      
      // If it's overlap with another one, return true
      if (tile.tileType === TILE_SHIP){
        return true;
      }
      else{
        board[rowIndex][columnIndex] = {...tile, shipId: ship.id, tileType: TILE_SHIP}
      }

    }

    for (let index = 0; index < ship.size; index++) {
      // Check if the ship is vertical or horizontal
      const rowIndex = direction === "vertical" ? coordinates.rowIndex + index : coordinates.rowIndex;
      const columnIndex = direction === "horizontal" ? coordinates.columnIndex + index : coordinates.columnIndex;
      
      // Restart the loop if overlap between two ships is found
      if (isOverlapping(rowIndex, columnIndex)) {
          index = -1; 
      }
    }

    return true;
  }
  
  export function generateBoard(ships){
    const newBoard = Array(11).fill(null).map((_, rowIndex) => {
      // Set first row with nulls
      if (rowIndex === 0) {
          return Array(11).fill({tileType : TILE_HEADER, shipId: null, previewType: "", isShot: false});
      }
      // For other rows, set the first column to null and others to a board type
      return Array(11).fill(null).map((_, colIndex) => (colIndex === 0 ? {tileType : TILE_HEADER, shipId: null, previewType: "", isShot: false} : {tileType : TILE_WATER, shipId: null, previewType: "", isShot: false}));
    });

    ships.forEach(ship => {
      let isPlaced = false;
      while (!isPlaced){
        const direction = Math.random() < 0.5 ? "vertical" : "horizontal";
        const randomCoordinates = getRandomCoordinates(11);
        if (placeShip(newBoard, randomCoordinates, ship, direction)){

          isPlaced = true;
        }
      }
    });

    return newBoard;
  };