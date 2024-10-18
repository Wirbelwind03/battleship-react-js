import { getRandomCoordinates } from "./BoardUtils";



export function handleAIshot(board, coordinates){
    const tile = board[coordinates.rowIndex][coordinates.columnIndex];
    if (tile.isShot){
        handleAIshot(board, getRandomCoordinates(11));
        return;
    }
    else{
        board[coordinates.rowIndex][coordinates.columnIndex] = {...tile, isShot: true};
    }
};
