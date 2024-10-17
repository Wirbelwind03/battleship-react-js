import React, { useEffect, useRef, useState } from 'react'
import Row from './Row'
import { erasePreviews } from '../utils/BoardUtils';

const Board = ({size, rows, ships, isOpponent, isYourTurn}) => {
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

    useEffect(() => {
        if (playerLives.current === 0){
            
        }
    }, [playerLives])


    const handleTileHover = (e, coordinates) => {
        if (!isYourTurn || isOpponent) return;

        const tile = board[coordinates.rowIndex][coordinates.columnIndex]; 
        if (tile.tileType !== "HEADER"){
            setPreviewCoordinates(coordinates);
        }

    }

    const handleTileRightClick = (e, coordinates) => {
        if (!isYourTurn || isOpponent) return;

        const tile = board[coordinates.rowIndex][coordinates.columnIndex]; 
        if (tile.tileType !== "HEADER"){
            e.preventDefault();
        }
    }

    const handleTileClick = (e, coordinates) => {
        if (!isYourTurn || isOpponent) return;

        const tile = board[coordinates.rowIndex][coordinates.columnIndex]; 
        if (tile.tileType !== "HEADER" && !tile.isShot){
            updateTile(coordinates, "shoot");
            // If the tile hit is a ship
            if (tile.tileType === "SHIP"){
                const shipHit = boardShips[tile.shipId]; // Get the ship that was been hit
                shipHit.hits++; // 
                // Check if the ship is out of health
                if (shipHit.hits === shipHit.size){
                    playerLives.current--; // Remove lives from the player
                }
            }
        }
    }

  return (
    <div 
        className={`board ${isOpponent ? "opponent" : ""}`}
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