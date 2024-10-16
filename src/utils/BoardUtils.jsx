export function erasePreviews(newRows, boardSize){
    // Remove the previews;
    for (let row = 1; row < boardSize; row++){
        for(let column = 1; column < boardSize; column++){
            const tile = newRows[row][column];
            newRows[row][column] = {...tile, previewType: ""};
            
        }
    }
};