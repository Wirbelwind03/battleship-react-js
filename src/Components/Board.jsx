import React, { act, useEffect, useRef, useState } from 'react';
import Row from './Row';

const Board = ({size, selectedShip, updateShipCount, setIsGameReady}) => {

    const boardSize = size + 1

    const initialRows = Array(boardSize).fill(null).map((_, rowIndex) => {
        // Set first row with nulls
        if (rowIndex === 0) {
            return Array(boardSize).fill({tileType : "HEADER", shipId: null, previewType: ""});
        }
        // For other rows, set the first column to null and others to a board type
        return Array(boardSize).fill(null).map((_, colIndex) => (colIndex === 0 ? {tileType : "HEADER", shipId: null, previewType: ""} : {tileType : "WATER", shipId: null, previewType: ""}));
    });

    const [rows, setRows] = useState(initialRows);
    const [pieceDirection, setPieceDirection] = useState("vertical");
    const [previewCoordinates, setPreviewCoordinates] = useState(null); // Hold the coordinates for the preview
    const canPlaceShip = useRef(true); // If the user can place ships
    const [boardShips, setShips] = useState([]);

    function erasePreviews(newRows){
        // Remove the previews
        for (let row = 1; row < boardSize; row++){
            for(let column = 1; column < boardSize; column++){
                const tile = newRows[row][column];
                newRows[row][column] = {...tile, previewType: ""};
            }
        }
    }

    function placeShip(coordinates, actionType){
        if (selectedShip.count <= 0){
            return;
        }

        const newRows = [...rows];

        erasePreviews(newRows);

        let previewType = "preview";
        
        // Reset if the user can place ship to true
        canPlaceShip.current = true;

        const drawShip = (rowIndex, columnIndex) => {
            const tile = newRows[rowIndex][columnIndex];

            switch (actionType){
                // Draw preview of the ship
                case "preview":
                    if (tile.tileType === "SHIP" && previewType !== "preview-error") {
                        previewType = "preview-error";
                        canPlaceShip.current = false;
                        return false; // Indicate that we should restart the loop
                    }
                    newRows[rowIndex][columnIndex] = { ...tile, previewType: previewType };
                    break;

                // Draw the ship
                case "place":
                    newRows[rowIndex][columnIndex] = { ...tile, shipId: boardShips.length, tileType: "SHIP" };
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
    
            if (!drawShip(rowIndex, columnIndex) && actionType === "preview") {
                index = -1; // Restart the loop if overlap between two ships is found
            }
        }

        setRows(newRows);
    }

    // Redraw the preview when direction or coordinates change
    useEffect(() => {
        if (previewCoordinates && selectedShip !== null) {
            placeShip(previewCoordinates, "preview");
        }
    }, [pieceDirection, previewCoordinates]); // Depend on direction or coordinates

    // Redraw the board when the selected ship change
    useEffect(() => {
        if (selectedShip){
            const newRows = [...rows];
            erasePreviews(newRows);
            setRows(newRows);
        }
    }, [selectedShip]);

    // useEffect (() => {
    //     if (selectedShip){
    //         updateShipCount(selectedShip.name);
    //     }
    // }, [boardShips]);

    // Draw the ship preview
    const handleTileHover = (e, coordinates) => {
        const tileValue = e.target.getAttribute('value');
        if (tileValue !== "HEADER" && selectedShip !== null){
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
        const tileValue = e.target.getAttribute('value');
        if (tileValue !== "HEADER" && selectedShip !== null){
            e.preventDefault();
            
            // Check if there isn't a overlap out of bounds with the piece and the board
            if (pieceDirection === "vertical" && coordinates.columnIndex + selectedShip.size > boardSize ){
                setPreviewCoordinates({rowIndex: coordinates.rowIndex, columnIndex: boardSize - selectedShip.size})
            }
            else if (pieceDirection === "horizontal" && coordinates.rowIndex + selectedShip.size > boardSize){
                setPreviewCoordinates({rowIndex: boardSize - selectedShip.size, columnIndex: coordinates.columnIndex})
            }
                
            let newPieceDirection = pieceDirection === "vertical" ? "horizontal" : "vertical";
    
            setPieceDirection(newPieceDirection);
        }

    }

    const handleTileClick = (e) => {
        if (canPlaceShip.current === true && selectedShip && selectedShip.count > 0){
            placeShip(previewCoordinates, "place");
            
            // Add ship to boardShips
            const newShips = [...boardShips];
            const newShip = {...selectedShip, id: boardShips.length};
            delete newShip.count;
            newShips.push(newShip);
            setShips(newShips);

            // Disable so the user can't place multiple times in the same place
            canPlaceShip.current = false;

            updateShipCount(selectedShip.name);

            setIsGameReady(false);
        }
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
    );
}

export default Board;
