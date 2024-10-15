import React, { useState } from 'react'

const ShipDetail = ({name, size, count, onClick}) => {

    const [shipCount, setCount] = useState(count);
    const shipTiles = Array(size).fill(null);

  return (
    <div 
        className="ship-detail"
        onClick={() => onClick({name: name, size: size})}
        >
        <div className="ship-detail-specs">
            <p>{name}</p>
            <p></p>
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