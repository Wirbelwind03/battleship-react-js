import React, { useState } from 'react'
import ShipSelector from './ShipSelector'
import BoardEditor from './BoardEditor'

let BOARD_SIZE = 10

const BoardSetup = ({disableStartGameButton, isGameStarted, playerBoard, playerShips}) => {

    const [boardRows, setBoardRows] = useState(10);
    const [boardColumns, setBoardColumns] = useState(10);
    
    const [shipsForSelector, setShipsForSelector] = useState([
      { name: "Destroyer", size: 2, count: 2, hits: 0 },
      { name: "Cruiser", size: 2, count: 2, hits: 0 },
      { name: "Submarine", size: 3, count: 2, hits: 0 },
      { name: "Battleship", size: 4, count: 2, hits: 0 },
      { name: "Carrier", size: 5, count: 2, hits: 0 }
    ]);
    const [selectedShip, setSelectedShip] = useState(null);

    function generateBoard(){

      const newBoard = Array(10).fill(null).map((_, rowIndex) => {
        // Set first row with nulls
        if (rowIndex === 0) {
            return Array(10).fill({tileType : "HEADER", shipId: null, previewType: "", isShot: false});
        }
        // For other rows, set the first column to null and others to a board type
        return Array(10).fill(null).map((_, colIndex) => (colIndex === 0 ? {tileType : "HEADER", shipId: null, previewType: "", isShot: false} : {tileType : "WATER", shipId: null, previewType: "", isShot: false}));
      });

        
    };
  
    const handleBoardRowsChange = (e) => {
      setBoardRows(e.target.value);
    };
  
    const handleBoardColmunsChange = (e) => {
      setBoardColumns(e.target.value);
    };
  
    const updateShipCount = (shipName) => {
      setShipsForSelector((prevShips) =>
        prevShips.map((ship) => {
          if (ship.name === shipName && ship.count > 0) {
            // Update the selected ship when the count changes
            const updatedShip = { ...ship, count: ship.count - 1 };
            setSelectedShip(updatedShip);
            return updatedShip;
          }
          return ship;
        })
      );
    };

  return (
    <div className={`board-setup ${isGameStarted ? 'remove' : ' '}`}>
        <ShipSelector ships={shipsForSelector} setSelectedShip={setSelectedShip}/>
        <BoardEditor 
          updateShipCount={updateShipCount} 
          disableStartGameButton={disableStartGameButton} 
          selectedShip={selectedShip} 
          size={BOARD_SIZE} 
          playerBoard={playerBoard} 
          playerShips={playerShips}
        />
        {/* <div>
          <input type='number' value={boardRows} min={10} max={16} onChange={handleBoardRowsChange}></input>
          <span>x</span>
          <input type='number' value={boardColumns} min={10} max={16} onChange={handleBoardColmunsChange}></input>
        </div> */}
    </div>
  )
}

export default BoardSetup