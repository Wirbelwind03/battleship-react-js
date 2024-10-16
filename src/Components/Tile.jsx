import React from 'react'

const TILE_HEADER = "HEADER";
const TILE_WATER = "WATER";
const TILE_SHIP = "SHIP";

const Tile = ({ value, rowIndex, columnIndex, onHover, onRightClick, onClick}) => {
    let content = "";

    // Draw columns header letters
    if (value.tileType === TILE_HEADER && columnIndex !== 0){
        content = String.fromCharCode(65 + columnIndex - 1);
    }
    // Draw rows header numbers
    else if (value.tileType === TILE_HEADER && rowIndex !== 0 && columnIndex === 0) {
        content = rowIndex
    }

  return (
    <div 
      className={`tile ${value.tileType.toLowerCase()} ${value.previewType}` }
      onMouseOver={(e) => onHover(e, {rowIndex: rowIndex, columnIndex: columnIndex})}
      onContextMenu={(e) => onRightClick(e, {rowIndex: rowIndex, columnIndex: columnIndex})}
      onClick={(e) => onClick(e)}
      value={value.tileType}
      >
        {content}
    </div>
  )
}

export default Tile