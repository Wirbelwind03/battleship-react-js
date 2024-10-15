import React, { useEffect, useRef, useState } from 'react'
import Board from './Board'
import ShipSelector from './ShipSelector'

let BOARD_SIZE = 10

const BattleShip = () => {

  const [boardRows, setBoardRows] = useState(10);
  const [boardColumns, setBoardColumns] = useState(10);
  
  const [ships, setShips] = useState([
    { name: "Destroyer", size: 2, count: 2 },
    { name: "Cruiser", size: 2, count: 2 },
    { name: "Submarine", size: 3, count: 2 },
    { name: "Battleship", size: 4, count: 2 },
    { name: "Carrier", size: 5, count: 2 }
  ]);
  const [selectedShip, setSelectedShip] = useState(null);
  const [isGameReady, setIsGameReady] = useState(true);

  const handleBoardRowsChange = (e) => {
    setBoardRows(e.target.value);
  };

  const handleBoardColmunsChange = (e) => {
    setBoardColumns(e.target.value);
  };

  const updateShipCount = (shipName) => {
    setShips((prevShips) =>
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
    <div className='battleship'>
        <h1>Battleship</h1>
        <div className='boards-container'>
            <ShipSelector ships={ships} setSelectedShip={setSelectedShip}/>
            <Board updateShipCount={updateShipCount} setIsGameReady={setIsGameReady} selectedShip={selectedShip} size={BOARD_SIZE} />
        </div>
        {/* <div>
          <input type='number' value={boardRows} min={10} max={16} onChange={handleBoardRowsChange}></input>
          <span>x</span>
          <input type='number' value={boardColumns} min={10} max={16} onChange={handleBoardColmunsChange}></input>
        </div> */}
        <button disabled={isGameReady}>Start game</button>
        
    </div>
  )
}

export default BattleShip