import React from 'react'

const ShipDetail = ({name, size, count, onClick}) => {

    // Used to visualize the ship
    const shipTiles = Array(size).fill(null);

  return (
    <div 
        className="ship-detail"
        onClick={() => onClick({name: name, size: size})}
    >
        <div className="ship-detail-specs">
            <span>{name}</span>
            <span>x{count}</span>
        </div>
        <div className="ship-tiles">
            {shipTiles.map((tile, columIndex) => (
                <div key={columIndex} className="tile"></div>
            ))}
        </div>
    </div>
  )
}

export default ShipDetail