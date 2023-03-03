//Declare Variables

const gridLocs = ['A','B','C','D','E','F','G'];
const gridRows = [1, 2, 3, 4, 5, 6 ,7];

const board = {
    player: document.querySelector('p-board'),
    computer: document.querySelector('c-board')
} 

addEventListener('click', fire)

//---------- Functions ------------//

function fire(){
    //check to make sure it's player's turn, else skip to "AI" section

    //check location clicked on grid
    //if cell is !clicked,
    //check if there is a boat present
    //if boat is present, report hit and mark boat as damaged
    //else, report miss and end turn
    //render

    //AI
    //choose random cell and fire like above?
}

