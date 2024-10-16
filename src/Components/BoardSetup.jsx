import React, { useState } from 'react'
import ShipSelector from './ShipSelector'
import BoardEditor from './BoardEditor'

let BOARD_SIZE = 10

const BoardSetup = ({disableStartGameButton, isGameStarted, playerBoard}) => {

    const [boardRows, setBoardRows] = useState(10);
    const [boardColumns, setBoardColumns] = useState(10);
    
    const [shipsForSelector, setShipsForSelector] = useState([
      { name: "Destroyer", size: 2, count: 2 },
      { name: "Cruiser", size: 2, count: 2 },
      { name: "Submarine", size: 3, count: 2 },
      { name: "Battleship", size: 4, count: 2 },
      { name: "Carrier", size: 5, count: 2 }
    ]);
    const [selectedShip, setSelectedShip] = useState(null);
  
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