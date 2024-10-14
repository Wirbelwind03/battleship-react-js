import React, { useEffect, useState } from 'react';
import Row from './Row';

const Board = ({size}) => {

    const initialRows = Array(size + 1).fill(null).map((_, rowIndex) => {
        // Set first row with nulls
        if (rowIndex === 0) {
            return Array(size + 1).fill({tileType : "HEADER", shipId: null, preview: ""});
        }
        // For other rows, set the first column to null and others to a board type
        return Array(size + 1).fill(null).map((_, colIndex) => (colIndex === 0 ? {tileType : "HEADER", shipId: null, preview: ""} : {tileType : "WATER", shipId: null, preview: ""}));
    });

    const ships = [    
        { id: 0, length: 2, hit: 0, coordinates: [] },
        { id: 1, length: 3, hit: 0, coordinates: [] },
        { id: 2, length: 3, hit: 0, coordinates: [] },
        { id: 3, length: 4, hit: 0, coordinates: [] },
        { id: 4, length: 5, hit: 0, coordinates: [] }
    ];

    const [rows, setRows] = useState(initialRows);
    const [pieceDirection, setPieceDirection] = useState("vertical");
    const [previewCoordinates, setPreviewCoordinates] = useState(null);
    const [playerShips, setShips] = useState(ships);

    function resetBoard(newRows){
        for (let row = 1; row < size + 1; row++){
            for(let column = 1; column < size + 1; column++){
                const tile = newRows[row][column];
                newRows[row][column] = {...tile, preview:""};
            }
        }
    }

    function drawPreviewShip(coordinates){
        const newRows = [...rows];

        resetBoard(newRows);

        let preview = "preview";
        
        if (pieceDirection === "vertical"){
            for (let index = 0; index < 5; index++){
                const tile = newRows[coordinates.rowIndex + index][coordinates.columnIndex];
                if (tile.tileType === "SHIP" && preview !== "preview-error"){
                    preview="preview-error";
                    index = -1; // Reset the loop
                    continue;
                }
                newRows[coordinates.rowIndex + index][coordinates.columnIndex] = {...tile, preview:preview}
            }
        }
        else if (pieceDirection === "horizontal"){
            for (let index = 0; index < 5; index++){
                const tile = newRows[coordinates.rowIndex][coordinates.columnIndex + index];
                if (tile.tileType === "SHIP" && preview !== "preview-error"){
                    preview="preview-error";
                    index = -1; // Reset the loop
                    continue;
                }
                newRows[coordinates.rowIndex][coordinates.columnIndex + index] = {...tile, preview:preview}
            }
        }

        setRows(newRows);
    }

    function placeShip(coordinates){
        const newRows = [...rows];

        resetBoard(newRows);

        if (pieceDirection === "vertical"){
            for (let index = 0; index < 5; index++){
                const tile = newRows[coordinates.rowIndex + index][coordinates.columnIndex];
                newRows[previewCoordinates.rowIndex + index][previewCoordinates.columnIndex] = {...tile, tileType:"SHIP"}
            }
        }
        else if (pieceDirection === "horizontal"){
            for (let index = 0; index < 5; index++){
                const tile = newRows[coordinates.rowIndex][coordinates.columnIndex + index];
                newRows[coordinates.rowIndex][coordinates.columnIndex + index] = {...tile, tileType:"SHIP"}
            }
        }

        setRows(newRows);
    }

    useEffect(() => {
        // Redraw the preview when direction or coordinates change
        if (previewCoordinates) {
            drawPreviewShip(previewCoordinates);
        }
    }, [pieceDirection, previewCoordinates]); // Depend on both direction and coordinates

    const handleTileHover = (e, coordinates) => {
        const tileValue = e.target.getAttribute('value');
        if (tileValue !== "HEADER"){
            if (pieceDirection === "vertical" && coordinates.rowIndex + 5 > size + 1){
                setPreviewCoordinates({rowIndex: size + 1 - 5, columnIndex: coordinates.columnIndex});
            }
            else if (pieceDirection === "horizontal" && coordinates.columnIndex + 5 > size + 1){
                setPreviewCoordinates({rowIndex: coordinates.rowIndex, columnIndex:size + 1 - 5});
            }
            else{
                setPreviewCoordinates(coordinates);
            }
        }
    }

    const handleTileRightClick = (e, coordinates) => {
        const tileValue = e.target.getAttribute('value');
        if (tileValue !== "HEADER"){
            e.preventDefault();
        
            if (coordinates.columnIndex > size + 1 - 5){
                setPreviewCoordinates({rowIndex: coordinates.rowIndex, columnIndex: size + 1 - 5})
            }
            else if (coordinates.rowIndex > size + 1 - 5){
                setPreviewCoordinates({rowIndex: size + 1 - 5, columnIndex: coordinates.columnIndex})
            }
                
            let newPieceDirection = pieceDirection === "vertical" ? "horizontal" : "vertical";
    
            setPieceDirection(newPieceDirection);
        }

    }

    const handleTileClick = (e) => {
        placeShip(previewCoordinates);
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
