import React, { useEffect, useRef, useState } from 'react'
import BoardSetup from './BoardSetup'
import Board from './Board';

const BattleShip = () => {

  const [isGameNotReady, disableStartGameButton] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);
  //const [playerBoard, setPlayerBoard] = useState(null);
  const playerBoard = useRef(null);

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
          />
          <button onClick={() => startGame()} disabled={isGameNotReady}>Start game</button>
        </div>
        
        <div className={`boards-container ${!isGameStarted ? 'remove' : ' '}`}>
          {playerBoard.current && isGameStarted ? <Board rows={playerBoard.current} /> : null}
          {playerBoard.current && isGameStarted ? <Board rows={playerBoard.current} /> : null}
        </div>
        
        
    </div>
  )
}

export default BattleShip