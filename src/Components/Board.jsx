import React from 'react'
import Row from './Row'

const Board = ({rows}) => {
    
    const handleTileHover = () => {

    }

    const handleTileRightClick = () => {

    }

    const handleTileClick = () => {

    }

  return (
    <div className='board'>
        {rows.map((columns, rowIndex) => (
            <Row 
                key={rowIndex} 
                columns={columns}
                rowIndex={rowIndex}
                onTileHover={handleTileHover}
                onTileRightClick={handleTileRightClick}
                onTileClick={handleTileClick}
            />
        ))}
    </div>
  )
}

export default Board