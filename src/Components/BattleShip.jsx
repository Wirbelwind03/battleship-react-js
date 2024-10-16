import React, { useEffect, useRef, useState } from 'react'
import BoardSetup from './BoardSetup'
import Board from './Board';

const BattleShip = () => {

  const [isGameNotReady, disableStartGameButton] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const playerBoard = useRef(null);
  const playerShips = useRef([]);

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