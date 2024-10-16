import React, { act, useEffect, useRef, useState } from 'react'
import Row from './Row'
import { erasePreviews } from '../utils/BoardUtils';

const Board = ({size, rows, ships}) => {
    const boardSize = size;

    const [board, setBoard] = useState(rows);
    const [boardShips, setBoardShips] = useState(ships);
    const [previewCoordinates, setPreviewCoordinates] = useState(null); // Hold the coordinates for the preview
    const playerLives = useRef(boardShips.length);

    const updateTile = (coordinates, actionType) => {
        const newBoard = {...board};
        
        erasePreviews(newBoard, boardSize);
        
        if (coordinates){
            const tile = board[coordinates.rowIndex][coordinates.columnIndex]; 

            switch (actionType){
                case "preview":
                    newBoard[coordinates.rowIndex][coordinates.columnIndex] = {...tile, previewType: "preview-shot"}
                    break;
                case "shoot":
                    newBoard[previewCoordinates.rowIndex][previewCoordinates.columnIndex] = {...tile, previewType: "", isShot: true}
                    break;
                
                default:
                    break;
            }
        }
        setBoard(newBoard);
    };

    useEffect(() => {
        if (previewCoordinates){
            updateTile(previewCoordinates, "preview");
        }
        else if (!previewCoordinates){
            updateTile(previewCoordinates, "none");
        }
    }, [previewCoordinates]);


    const handleTileHover = (e, coordinates) => {
        const tile = board[coordinates.rowIndex][coordinates.columnIndex]; 
        if (tile.tileType !== "HEADER"){
            setPreviewCoordinates(coordinates);
        }

    }

    const handleTileRightClick = (e, coordinates) => {
        const tile = board[coordinates.rowIndex][coordinates.columnIndex]; 
        if (tile.tileType !== "HEADER"){
            e.preventDefault();
        }
    }

    const handleTileClick = (e, coordinates) => {
        const tile = board[coordinates.rowIndex][coordinates.columnIndex]; 
        if (tile.tileType !== "HEADER" && !tile.isShot){
            updateTile(coordinates, "shoot");
            if (tile.tileType === "SHIP"){
                const shipHit = boardShips[tile.shipId];
                shipHit.hits++;
                if (shipHit.hits === shipHit.size){
                    playerLives.current--;
                }
            }
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
  )
}

export default Board