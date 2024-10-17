import React, { useEffect, useRef, useState } from 'react'
import BoardSetup from './BoardSetup'
import Board from './Board';
import { generateBoard } from '../utils/BoardUtils';

const BattleShip = () => {

  const [isGameNotReady, disableStartGameButton] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(0);

  const playerBoard = useRef(null);
  const playerShips = useRef([]);
  
  const opponentBoard = useRef(null);
  const opponentShips = useRef([]);

  const startGame = () => {
    opponentShips.current = JSON.parse(JSON.stringify(playerShips.current));
    opponentBoard.current = generateBoard(opponentShips.current);
    setIsGameStarted(true);
  };

  const handleTurns = () => {
    if (playerTurn === 1){
      playerTurn = 0;
      setPlayerTurn(playerTurn);
    }
    else {
      setPlayerTurn(playerTurn++);
    }
    
  }

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
          {playerBoard.current && isGameStarted ? (
            <Board 
              size={playerBoard.current.length} 
              rows={playerBoard.current} 
              ships={playerShips.current}
              isOpponent={false} 
              isYourTurn={playerTurn === 0}
            />
            ) : null}
          {playerBoard.current && isGameStarted ? (
            <Board 
              size={opponentBoard.current.length} 
              rows={opponentBoard.current} 
              ships={opponentShips.current} 
              isOpponent={true} 
              isYourTurn={playerTurn === 1}
            /> 
            ) : null}
        </div>
        
        
    </div>
  )
}

export default BattleShip