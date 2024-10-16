import React from 'react'
import ShipDetail from './ShipDetail'

const ShipSelector = ({ships, setSelectedShip}) => {

  // Change the selected ship
    const handleShipDetailClick = (ship) => {
        setSelectedShip(ship);
    }

  return (
    <div className="ship-selector">
        <h3>Ship selection</h3>
        {ships.map((ship, index) => (
          <ShipDetail
            key={index}
            name={ship.name}
            size={ship.size}
            count={ship.count}
            onClick={() => handleShipDetailClick(ship)}
          />
        ))}
    </div>
  )
}

export default ShipSelector