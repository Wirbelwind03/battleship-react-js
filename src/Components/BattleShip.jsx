import React, { useEffect, useRef, useState } from 'react'
import BoardSetup from './BoardSetup'
import Board from './Board';
import { TILE_SHIP } from './Tile';

const BattleShip = () => {

  const [isGameNotReady, disableStartGameButton] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const playerBoard = useRef(null);
  const playerShips = useRef([]);

  function placeShip(board, rowIndex, columIndex, shipLength, direction){
    if ((direction === "vertical" && rowIndex + shipLength > 11) || 
        (direction === "horizontal" && columIndex + shipLength > 11)) {
      return false;
    }

    const isOverlapping = (rowIndex, columIndex) => {
      const tile = board[rowIndex][columIndex]

      if (tile.tileType === TILE_SHIP){
        return true;
      }
      else{
        board[rowIndex][columIndex] = {...tile, tileType: TILE_SHIP}
      }

    }

    for (let index = 0; index < shipLength; index++) {
      // Check if the ship is vertical or horizontal
      const rowIndex = direction === "vertical" ? rowIndex + index : rowIndex;
      const columnIndex = direction === "horizontal" ? columnIndex + index : columnIndex;
      
      // Restart the loop if overlap between two ships is found
      if (isOverlapping(rowIndex, columnIndex)) {
          index = -1; 
      }
    }

    return true;
  }
  
  function generateBoard(ships){
    const newBoard = Array(11).fill(null).map((_, rowIndex) => {
      // Set first row with nulls
      if (rowIndex === 0) {
          return Array(11).fill({tileType : "HEADER", shipId: null, previewType: "", isShot: false});
      }
      // For other rows, set the first column to null and others to a board type
      return Array(11).fill(null).map((_, colIndex) => (colIndex === 0 ? {tileType : "HEADER", shipId: null, previewType: "", isShot: false} : {tileType : "WATER", shipId: null, previewType: "", isShot: false}));
    });

    ships.forEach(ship => {
      let isPlaced = false;
      while (!isPlaced){
        const direction = Math.random() < 0.5 ? "vertical" : "horizontal";
        const rowIndex = Math.floor(Math.random() * 11) + 1;
        const columnIndex = Math.floor(Math.random() * 11) + 1;
        if (placeShip(newBoard, rowIndex, columnIndex, ship.size, direction)){
          isPlaced = true;
        }
      }
    });
  };


  const startGame = () => {
    setIsGameStarted(true);
  };

  return (
    <div className='battleship'>
        <h1>Battleship</h1>
        <div className={`board-setup-container ${isGameStarted ? 'remove' : ' '}`}>
          <BoardSetup 
            disableStartGameButton={disableStartGameButton} 
            isGameStarted={isGameStarted} 
            playerBoard={playerBoard}
            playerShips={playerShips}
          />
          <button onClick={() => startGame()} disabled={isGameNotReady}>Start game</button>
        </div>
        
        <div className={`boards-container ${!isGameStarted ? 'remove' : ' '}`}>
          {playerBoard.current && isGameStarted ? <Board size={playerBoard.current.length} rows={playerBoard.current} ships={playerShips.current} /> : null}
          {playerBoard.current && isGameStarted ? <Board size={playerBoard.current.length} rows={playerBoard.current} ships={playerShips.current} /> : null}
        </div>
        
        
    </div>
  )
}

export default BattleShip