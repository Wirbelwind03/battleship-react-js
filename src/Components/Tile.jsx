import React from 'react'

export const TILE_HEADER = "HEADER";
export const TILE_WATER = "WATER";
export const TILE_SHIP = "SHIP";
export const TILE_SHIP_HIT = "SHIP-HIT"

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
    else if (value.isShot === true){
      content = "X"
    }

  return (
    <div 
      className={`tile ${value.tileType.toLowerCase()} ${value.previewType} ${value.isShot ? "shot" : ""}` }
      onMouseOver={(e) => onHover(e, {rowIndex: rowIndex, columnIndex: columnIndex})}
      onContextMenu={(e) => onRightClick(e, {rowIndex: rowIndex, columnIndex: columnIndex})}
      onClick={(e) => onClick(e, {rowIndex: rowIndex, columnIndex: columnIndex})}
      value={value.tileType}
      >
        {content}
    </div>
  )
}

export default Tile