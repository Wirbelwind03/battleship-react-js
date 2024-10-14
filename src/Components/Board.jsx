import React, { act, useEffect, useRef, useState } from 'react';
import Row from './Row';

const Board = ({size}) => {

    const boardSize = size + 1

    const initialRows = Array(boardSize).fill(null).map((_, rowIndex) => {
        // Set first row with nulls
        if (rowIndex === 0) {
            return Array(boardSize).fill({tileType : "HEADER", shipId: null, previewType: ""});
        }
        // For other rows, set the first column to null and others to a board type
        return Array(boardSize).fill(null).map((_, colIndex) => (colIndex === 0 ? {tileType : "HEADER", shipId: null, previewType: ""} : {tileType : "WATER", shipId: null, previewType: ""}));
    });

    const ships = [    
        { id: 0, length: 2, hit: 0, coordinates: null },
        { id: 1, length: 3, hit: 0, coordinates: null },
        { id: 2, length: 3, hit: 0, coordinates: null },
        { id: 3, length: 4, hit: 0, coordinates: null },
        { id: 4, length: 5, hit: 0, coordinates: null }
    ];

    const [rows, setRows] = useState(initialRows);
    const [pieceDirection, setPieceDirection] = useState("vertical");
    const [previewCoordinates, setPreviewCoordinates] = useState(null); // Hold the coordinates for the preview
    const canPlaceShip = useRef(true); // If the user can place ships
    const [playerShips, setShips] = useState(ships);

    function resetBoard(newRows){
        // Remove the previews
        for (let row = 1; row <boardSize; row++){
            for(let column = 1; column < boardSize; column++){
                const tile = newRows[row][column];
                newRows[row][column] = {...tile, previewType: ""};
            }
        }
    }

    function placeShip(coordinates, actionType){
        const newRows = [...rows];

        resetBoard(newRows);

        let previewType = "preview";
        
        // Reset if the user can place ship to true
        canPlaceShip.current = true;

        const drawPreviewShip = (rowIndex, columnIndex) => {
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
                    newRows[rowIndex][columnIndex] = { ...tile, tileType: "SHIP" };
                    break;

                default:
                    break;
            }

            return true; // Continue normal execution
        }
        
        for (let index = 0; index < 5; index++) {
            const rowIndex = pieceDirection === "vertical" ? coordinates.rowIndex + index : coordinates.rowIndex;
            const columnIndex = pieceDirection === "horizontal" ? coordinates.columnIndex + index : coordinates.columnIndex;
    
            if (!drawPreviewShip(rowIndex, columnIndex) && actionType === "preview") {
                index = -1; // Restart the loop if overlap between two ships is found
            }
        }

        setRows(newRows);
    }

    // Redraw the preview when direction or coordinates change
    useEffect(() => {
        if (previewCoordinates) {
            placeShip(previewCoordinates, "preview");
        }
    }, [pieceDirection, previewCoordinates]); // Depend on both direction and coordinates

    // Draw the ship preview
    const handleTileHover = (e, coordinates) => {
        const tileValue = e.target.getAttribute('value');
        if (tileValue !== "HEADER"){
            // Check if the vertical ship get out of bounds
            if (pieceDirection === "vertical" && coordinates.rowIndex + 5 > boardSize){
                setPreviewCoordinates({rowIndex: boardSize - 5, columnIndex: coordinates.columnIndex});
            }
            // Check if the horionztal ship get out of bounds
            else if (pieceDirection === "horizontal" && coordinates.columnIndex + 5 > boardSize){
                setPreviewCoordinates({rowIndex: coordinates.rowIndex, columnIndex: boardSize - 5});
            }
            else{
                setPreviewCoordinates(coordinates);
            }
        }
    }

    // Change direction of the ship
    const handleTileRightClick = (e, coordinates) => {
        const tileValue = e.target.getAttribute('value');
        if (tileValue !== "HEADER"){
            e.preventDefault();
        
            if (pieceDirection === "vertical" && coordinates.columnIndex + 5 > boardSize ){
                setPreviewCoordinates({rowIndex: coordinates.rowIndex, columnIndex: boardSize - 5})
            }
            else if (pieceDirection === "horizontal" && coordinates.rowIndex + 5 > boardSize){
                setPreviewCoordinates({rowIndex: boardSize - 5, columnIndex: coordinates.columnIndex})
            }
                
            let newPieceDirection = pieceDirection === "vertical" ? "horizontal" : "vertical";
    
            setPieceDirection(newPieceDirection);
        }

    }

    const handleTileClick = (e) => {
        if (canPlaceShip.current === true){
            placeShip(previewCoordinates, "place");
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
