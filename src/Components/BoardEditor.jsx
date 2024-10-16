import React, { useEffect, useRef, useState } from 'react';
import Row from './Row';
import { erasePreviews } from '../utils/BoardUtils';

const BoardEditor = ({size, selectedShip, updateShipCount, disableStartGameButton, playerBoard, playerShips}) => {

    const boardSize = size + 1

    const initialRows = Array(boardSize).fill(null).map((_, rowIndex) => {
        // Set first row with nulls
        if (rowIndex === 0) {
            return Array(boardSize).fill({tileType : "HEADER", shipId: null, previewType: "", isShot: false});
        }
        // For other rows, set the first column to null and others to a board type
        return Array(boardSize).fill(null).map((_, colIndex) => (colIndex === 0 ? {tileType : "HEADER", shipId: null, previewType: "", isShot: false} : {tileType : "WATER", shipId: null, previewType: "", isShot: false}));
    });

    const [rows, setRows] = useState(initialRows); // The board
    const [pieceDirection, setPieceDirection] = useState("vertical"); // The direction of the ship
    const [previewCoordinates, setPreviewCoordinates] = useState(null); // Hold the coordinates for the preview
    const canPlaceShip = useRef(true); // If the user can place ships

    // Place a ship on the board
    // coordinates : Where the ship is going to be place
    // actionType : What the user doing while hovering/clicking the tile
    function updateTiles(coordinates, actionType){
        // Stop the function if the count of the selected ship is 0
        if (selectedShip.count <= 0){
            return;
        }

        const newRows = [...rows];

        // Erase the previous preview
        erasePreviews(newRows, boardSize);
        
        if (coordinates){
            let previewType = "preview";
        
            // Reset if the user can place ship to true
            canPlaceShip.current = true;
    
            // Function to draw the ship
            const drawShip = (rowIndex, columnIndex) => {
                const tile = newRows[rowIndex][columnIndex];
    
                switch (actionType){
                    // Draw preview of the ship
                    case "preview":
                        // Check if there's a overlap with another ship
                        if (tile.tileType === "SHIP" && previewType !== "preview-error") {
                            // If there's one, change the previewType to a error, and paint the whole ship preview to a error
                            previewType = "preview-error";
                            canPlaceShip.current = false; // Remove the ability for the user to place ship
                            return false; // Indicate that we should restart the loop
                        }
                        newRows[rowIndex][columnIndex] = { ...tile, previewType: previewType };
                        break;
    
                    // Draw the ship
                    case "place":
                        newRows[rowIndex][columnIndex] = { ...tile, shipId: playerShips.current.length, tileType: "SHIP" };
                        break;
    
                    default:
                        break;
                }
    
                return true; // Continue normal execution
            }
            
            // Draw the ship by looping it's size
            for (let index = 0; index < selectedShip.size; index++) {
                // Check if the ship is vertical or horizontal
                const rowIndex = pieceDirection === "vertical" ? coordinates.rowIndex + index : coordinates.rowIndex;
                const columnIndex = pieceDirection === "horizontal" ? coordinates.columnIndex + index : coordinates.columnIndex;
                
                // Restart the loop if overlap between two ships is found
                if (!drawShip(rowIndex, columnIndex) && actionType === "preview") {
                    index = -1; 
                }
            }
        }

        setRows(newRows);
    }

    // Redraw the preview when direction or coordinates change
    useEffect(() => {
        // Draw the preview tiles
        if (previewCoordinates && selectedShip ) {
            updateTiles(previewCoordinates, "preview");
        }
        // Erase preview tiles if the cursor go out of the board
        else if (!previewCoordinates && selectedShip){
            updateTiles(previewCoordinates, "none");
        }
    }, [pieceDirection, previewCoordinates]); // Depend on direction or coordinates

    // Redraw the board when the selected ship change
    useEffect(() => {
        if (selectedShip){
            const newRows = [...rows];
            erasePreviews(newRows, boardSize);
            setRows(newRows);
        }
    }, [selectedShip]);

    // Draw the ship preview
    const handleTileHover = (e, coordinates) => {
        const tile = rows[coordinates.rowIndex][coordinates.columnIndex]; 
        if (tile.tileType !== "HEADER" && selectedShip !== null){
            // Check if the vertical ship get out of bounds
            if (pieceDirection === "vertical" && coordinates.rowIndex + selectedShip.size > boardSize){
                setPreviewCoordinates({rowIndex: boardSize - selectedShip.size, columnIndex: coordinates.columnIndex});
            }
            // Check if the horionztal ship get out of bounds
            else if (pieceDirection === "horizontal" && coordinates.columnIndex + selectedShip.size > boardSize){
                setPreviewCoordinates({rowIndex: coordinates.rowIndex, columnIndex: boardSize - selectedShip.size});
            }
            else{
                setPreviewCoordinates(coordinates);
            }
        }
    }

    // Change direction of the ship
    const handleTileRightClick = (e, coordinates) => {
        const tile = rows[coordinates.rowIndex][coordinates.columnIndex]; 
        if (tile.tileType !== "HEADER" && selectedShip !== null){
            e.preventDefault();
            
            // Move the piece to new coordinates before it's get rotated so it's doesn't get out of bounds
            // If the piece is vertical, put the new coodirnates when it's going to be placed horizontally
            if (pieceDirection === "vertical" && coordinates.columnIndex + selectedShip.size > boardSize ){
                setPreviewCoordinates({rowIndex: coordinates.rowIndex, columnIndex: boardSize - selectedShip.size})
            }
            // If the piece is horizontal, put the new coordinates when it's going to be placed vertically
            else if (pieceDirection === "horizontal" && coordinates.rowIndex + selectedShip.size > boardSize){
                setPreviewCoordinates({rowIndex: boardSize - selectedShip.size, columnIndex: coordinates.columnIndex})
            }
                
            let newPieceDirection = pieceDirection === "vertical" ? "horizontal" : "vertical";
    
            setPieceDirection(newPieceDirection);
        }

    }

    const handleTileClick = (e) => {
        if (canPlaceShip.current === true && selectedShip && selectedShip.count > 0){
            updateTiles(previewCoordinates, "place");
            
            // Add ship to boardShips
            const newShips = [...playerShips.current];
            const newShip = {...selectedShip, id: playerShips.current.length};
            delete newShip.count;
            newShips.push(newShip);
            playerShips.current = newShips;

            // Disable so the user can't place multiple times in the same place
            canPlaceShip.current = false;

            updateShipCount(selectedShip.name);

            // Update the playerBoard to get this board 
            playerBoard.current = rows;

            // Make the game ready to start
            disableStartGameButton(false);
        }
    }

    return (
        <div 
            className='board'
            onMouseLeave={() => {setPreviewCoordinates(null)}}
        >
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
    );
}

export default BoardEditor;
