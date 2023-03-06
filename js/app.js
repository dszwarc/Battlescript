//Declare Variables

//size of the board (size x size)
const size = 10;

//2D array holder for player and computer. initialized in init function
let gridArray = {player: [[]],
    computer: [[]]
}

//Ship class to designate length and name of each ship
class Ship {
    constructor(name, size){
        this.name = name;
        this.size = size;
    }
}

const destroyer = new Ship('destroyer', 3);
const submarine = new Ship('submarine', 3);
const battleship = new Ship('battleship',4);
const ships = [];
ships.push(destroyer, submarine, battleship);

init(size)

const shipEls = document.querySelectorAll('.ship');
const gridSpaces = {
    player: document.querySelectorAll('#p-board td'),
    computer: document.querySelectorAll('#c-board td')
}

//Event listener to highlight grid cells as you hover over them.
for (y in gridSpaces){
    for (let i = 0; i < gridSpaces[y].length; i++){
        gridSpaces[y][i].addEventListener('mouseenter', function(e){
            e.target.classList.add('hover');
        },100);
        gridSpaces[y][i].addEventListener('mouseout', function(e){
            e.target.classList.remove('hover');
        },100);
    }
}
// gridSpaces.computer.addEventListener('mouseenter', function(e){
//     e.target.classList.add('hover');
// },100);
// gridSpaces.computer.addEventListener('mouseout', function(e){
//     e.target.classList.remove('hover');
// },100);


function testclick(evt){
    console.log(evt.target.id);
    evt.target.colorBackground = evt.target.colorBackground === 'rgb(75, 138, 201)' ? 'white' : 'rgb(75, 138, 201)';
}


//---------- Functions ------------//

//initialize function
//reappear dock, clear boards of hit/miss icons, replace turn indicator with "SET-UP PHASE"
//

function init(){
    //set each cell to 0 initially (empty class)
    for (y in gridArray) {
        for (let i = 0; i < size; i++){
        gridArray[y][i] = [0];
            for (let u = 0; u < size; u++){
                gridArray[y][i][u]= 0;
            }
    }}
    
    generateTable('c-board', 'computer');
    generateTable('p-board', 'player');
    generateShips();


    
}

//make all boats appear in dock
//



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

//computer turn


function RandomGridLoc(){
    do {
      const space = Math.floor(Math.random()*size*size);
      const isEmpty = document.querySelector(`#${space}`).classList;
    } while (isEmpty != 'empty');
    console.log(space);
    return space;
}



function generateShips(){
    ships.forEach(ship =>{
        const shipEl = document.createElement('div');
        shipEl.draggable = true;
        shipEl.classList.add('ship');
        shipEl.id = ship.name;
        document.querySelector('body').appendChild(shipEl);
    })

}





//This function is good to go
function generateTable(tablename, player){
    //list all possible column titles
    const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    //create an HTML table elemend with the input name as an id
    const table = document.createElement('table');
    const tBody = document.createElement('tbody');
    table.id = tablename;
    table.appendChild(tBody);
    //table.classList.add('board');
    
    //create first row with letters for looks
    const letterRow = document.createElement('tr');
    const blankSpace = document.createElement('th');
    blankSpace.textContent = '';
    letterRow.appendChild(blankSpace);
    for (let y = 0; y <= size-1; y++){
        let legend = document.createElement('th');
        legend.textContent = letters[y];
        letterRow.appendChild(legend);  
    }
    tBody.appendChild(letterRow)
    //create the number of rows requested
    for (let i = 0; i < size; i++){
        const row = document.createElement('tr');
        //append a header for each row that acts as the left side numbers
        const header = document.createElement('th');
        header.textContent = (i+1);
        row.appendChild(header)
        //inside each row, create `size` number of table datas with an id of u + (i*10)
        for (let u = 0; u < size; u++){
            let grid = document.createElement('td');
            if(gridArray[player][u][i] === 0){
                grid.classList.add('empty');
            } else if (gridArray[player][u][i] === 1){
                grid.classList.add('ship');
            } else if (gridArray[player][u][i] === 2){
                grid.classList.add('hit');
            } else {
                grid.classList.add('miss');
            }
            //iterate over an array and based on array value, assign a class
            grid.id = u + (i*size);
            row.appendChild(grid);
        }
        tBody.appendChild(row)
    }
    
    document.querySelector('body').appendChild(table)
}

//locating array index based on id value
//id = row,column
//split id string. then look at gridArrays[id[1]][id[0]]
const testId = document.getElementById('57');
const testIdArray = testId.id.split('');
console.log(gridArray.player[testIdArray[1]][testIdArray[0]]);

function placeShip(ship){

}