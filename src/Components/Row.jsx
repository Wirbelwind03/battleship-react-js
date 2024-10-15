import React from 'react';
import Tile from './Tile';

const Row = ({ columns, rowIndex, onTileHover, onTileRightClick, onTileClick }) => {
  return (
    <div className="board-row" key={rowIndex}>
      {columns.map((tile, columIndex) => (
        <Tile 
          key={columIndex} 
          value={tile}
          rowIndex={rowIndex} 
          columnIndex={columIndex}
          onHover={onTileHover}
          onRightClick={onTileRightClick}
          onClick={onTileClick}
        />
      ))}
    </div>
  );
};

export default Row;