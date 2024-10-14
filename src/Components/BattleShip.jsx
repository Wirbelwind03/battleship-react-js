import React from 'react'
import Board from './Board'

const BOARD_SIZE = 10

const BattleShip = () => {
  return (
    <div className='battleship'>
        <h1>Battleship</h1>
        <div className='boards-container'>
            <Board size={BOARD_SIZE} />
        </div>
    </div>
  )
}

export default BattleShip