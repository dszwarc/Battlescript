//Declare Variables
const turnChoices = ['setup', 'player', 'computer', 'end-screen'];
let turnStatus;

//size of the board (size x size)
const size = 10;

//2D array holder for player and computer. initialized in init function
//0 is empty cell, 1 is ship present, 2 is hit, 3 is miss
let gridArray = {player: [[]],
    computer: [[]]
}

//Ship class to designate length and name of each ship
class Ship {
    constructor(name, size){
        this.name = name;
        this.size = size;
        this.isHorizontal = true;
    }
}

const destroyer = new Ship('destroyer', 2);
const cruiser = new Ship('cruiser', 3)
const submarine = new Ship('submarine', 3);
const battleship = new Ship('battleship',4);
const carrier = new Ship('carrier',5);
const ships = [];
ships.push(destroyer, cruiser, submarine, battleship, carrier);

//Declaring variable that will hold the status of what ship is being put down
let setupPhaseStatus;
const setupPhaseChoices = ['destroyer', 'cruiser', 'submarine', 'battleship', 'carrier'];
let winner = null;
init(size);

const shipEls = document.querySelectorAll('.ship');
const gridSpaces = {
    player: document.querySelectorAll('#player td'),
    computer: document.querySelectorAll('#computer td')
}
const totalTargets = document.querySelectorAll('#computer .ship').length;
let remainingComputerShipGrids = document.querySelectorAll('#computer .ship').length;
let remainingPlayerShipGrids = document.querySelectorAll('#player .ship').length;
render();
// //Event listener to highlight grid cells as you hover over them.
// if (turnStatus === 'setup'){
//     for (y in gridSpaces){
//         for (let i = 0; i < gridSpaces[y].length; i++){
//             gridSpaces[y][i].addEventListener('mouseenter', function(e){
//                 e.target.classList.add('hover');
//                 // let tempTest = e.target.id
//                 // console.log(tempTest, "this is the cell you're on")
//                 // tempTest = tempTest.slice(1);
//                 // tempTest = Number(tempTest)+1;
//                 // tempTest = tempTest.toString();
//                 // tempTest = 'c'+tempTest;
//                 // document.getElementById(tempTest).classList.add('hover');
//             },100);
//             gridSpaces[y][i].addEventListener('mouseout', function(e){
//                 e.target.classList.remove('hover');
//                 // let tempTest = e.target.id
//                 // console.log(tempTest, "this is the cell you're on")
//                 // tempTest = tempTest.slice(1);
//                 // tempTest = Number(tempTest)+1;
//                 // tempTest = tempTest.toString();
//                 // tempTest = 'c'+tempTest;
//                 // document.getElementById(tempTest).classList.remove('hover');
//             },100);
//             gridSpaces[y][i].addEventListener('click', testclick)
//         }
//     }
// } else if (turnStatus === 'player'){
//     for (y in gridSpaces){
//         for (let i = 0; i < gridSpaces[y].length; i++){
//             gridSpaces[y][i].addEventListener('mouseenter', function(e){
//                 e.target.classList.add('hover');
//             },100);
//             gridSpaces[y][i].addEventListener('mouseout', function(e){
//                 e.target.classList.remove('hover');
//             },100);
//             gridSpaces[y][i].addEventListener('click', clickBoard)
//         }
//     }
// } else if (turnStatus = 'computer'){
//     computerTurn();
// }

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
    turnStatus = turnChoices[0];
    generateTable('computer');
    generateTable('player');
    generateShips();
}
setupPhase();

//render
function render(){
    const turnStatusEl = document.getElementById('phase');
    const turnDescriptionEl = document.getElementById('turn-description')
    if (turnStatus === 'setup'){
        turnStatusEl.innerText = "SETUP PHASE"
        if (setupPhaseStatus = 'destroyer'){

        }
    } else if (turnStatus === 'player'){
        turnStatusEl.innerText = "PLAYER'S TURN"
        addBattlePhaseEventListeners();
    } else if (turnStatus === 'computer'){
        turnStatusEl.innerText = "COMPUTER IS THINKING..."
    } else if (turnStatus === 'end-screen'){
        turnStatusEl.innerText = `${winner.toUpperCase()} WINS!`
    }
   
    updateGridArray();
    remainingComputerShipGrids = document.querySelectorAll('#computer .ship').length;
    remainingPlayerShipGrids = document.querySelectorAll('#player .ship').length;

    if (remainingComputerShipGrids === 0){
        winner = 'player';
        turnStatus = 'end-screen';
    } else if (remainingPlayerShipGrids === 0){
        winner = 'computer';
        turnStatus = 'end-screen';
    }
}

function playerAttack(evt){
        let gridId = evt.target.id;
        gridId = gridId.slice(1);
        let gridIdArray;
        if(gridId < 10){
            gridIdArray = gridId.split('');
            gridIdArray.unshift('0');
        } else {
            gridIdArray = gridId.split('');
        }
        console.log(gridIdArray);
        console.log(gridIdArray[0],gridIdArray[1]);
        let gridCompare = gridArray.computer[gridIdArray[0]][gridIdArray[1]];
        console.log(gridCompare);
        if (gridCompare === 0){
            gridArray.computer[gridIdArray[0]][gridIdArray[1]] = 3;
            computerTurn();
            turnStatus = turnChoices[2];
        } else if (gridCompare === 1){
            gridArray.computer[gridIdArray[0]][gridIdArray[1]] = 2;
            computerTurn();
            turnStatus = turnChoices[2];
        } else {

        }
    
    render();
}

function computerTurn(){
    if (turnStatus === 'computer'){
        //write auto firing code
        let computerFire;

        do {
            computerFire = randomGrid();
        } while (!emptyOrShip(computerFire,'player'))

        if (gridArray.player[computerFire[0]][computerFire[1]] === 0){
            gridArray.player[computerFire[0]][computerFire[1]] = 3;
        } else {
            gridArray.player[computerFire[0]][computerFire[1]] = 2;
        }
        turnStatus = turnChoices[1];
        render();
    } else {
        render();
        setTimeout(computerTurn, 500);
    }
}

function randomGrid(){
    let row = Math.floor(Math.random()*size);
    let column = Math.floor(Math.random()*size);
    console.log(row);
    console.log(column);
    return [row,column];
}

function emptyOrShip(array, player){
    return gridArray[player][array[0]][array[1]] === 0 || gridArray[player][array[0]][array[1]] === 1 ? true:false;
}

function emptyGrid(playerString){
    let array;
    do {
        array = randomGrid();
    } while (gridArray[playerString][array[0]][array[1]] !== 0)
    return array;
}

function generateShips(){
    ships.forEach(ship =>{
        const shipEl = document.createElement('div');
        shipEl.draggable = true;
        shipEl.classList.add('ship');
        shipEl.id = ship.name;
        document.querySelector('#shipyard').appendChild(shipEl);
    })
}

//This function is good to go
function generateTable(tablename){
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
            //grid.classList.add('empty');
            grid.id = tablename.slice(0,1) + (u + (i*size));
                
            row.appendChild(grid);
        }
        tBody.appendChild(row)
    }
    
    document.querySelector('body').appendChild(table)

}

function trueFalse(){
    let test = Math.random();
    return test < .5 ? true : false;
}

function placeRandomShip(shipConst, playerString){
    const playerPlacement = emptyGrid(playerString)
    shipConst.isHorizontal = trueFalse();
    
    if (shipConst.isHorizontal && (playerPlacement[1]+ shipConst.size) < 9){
        gridArray[playerString][playerPlacement[0]][playerPlacement[1]] = 1;
        for(let i = 1; i <= shipConst.size; i++){
            gridArray[playerString][playerPlacement[0]][playerPlacement[1]+i] = 1;
        }
    } else if (!shipConst.isHorizontal && (playerPlacement[0]+ shipConst.size) < 9){
        gridArray[playerString][playerPlacement[0]][playerPlacement[1]] = 1;
        for(let i = 1; i <= shipConst.size; i++){
            gridArray[playerString][playerPlacement[0]+i][playerPlacement[1]] = 1;
        }
    } else {
        placeRandomShip(shipConst, playerString)
    }
}

function updateGridArray(){
    //Update table values
    for (k in gridArray){
        for (let i = 0 ; i<size ; i++){
            for (let u = 0; u<size; u++){
                let eleId;
                if (i === 0){
                    eleId = u;
                } else {
                    eleId = [i,u];
                    eleId = eleId.join('');
                }
                if (gridArray[k][i][u]=== 0){
                    document.getElementById(k.slice(0,1)+eleId).className = 'empty'
                } else if (gridArray[k][i][u]=== 1){
                    document.getElementById(k.slice(0,1)+eleId).className = 'ship'
                } else if (gridArray[k][i][u]=== 2){
                    document.getElementById(k.slice(0,1)+eleId).className = 'hit'
                } else if (gridArray[k][i][u]=== 3){
                document.getElementById(k.slice(0,1)+eleId).className = 'miss'
                }
            }
        }
    }
}

function addBattlePhaseEventListeners(){
        for (let i = 0; i < gridSpaces.computer.length; i++){
            gridSpaces.computer[i].addEventListener('mouseenter', function(e){
                e.target.classList.add('hover');
            },100);
            gridSpaces.computer[i].addEventListener('mouseout', function(e){
                e.target.classList.remove('hover');
            },100);
            gridSpaces.computer[i].addEventListener('click', playerAttack)
        }
}

function checkIfEmpty(array, playerString){

}

// //Event listener to highlight grid cells as you hover over them.
// if (turnStatus === 'setup'){
//     for (y in gridSpaces){
//         for (let i = 0; i < gridSpaces[y].length; i++){
//             gridSpaces[y][i].addEventListener('mouseenter', function(e){
//                 e.target.classList.add('hover');
//                 // let tempTest = e.target.id
//                 // console.log(tempTest, "this is the cell you're on")
//                 // tempTest = tempTest.slice(1);
//                 // tempTest = Number(tempTest)+1;
//                 // tempTest = tempTest.toString();
//                 // tempTest = 'c'+tempTest;
//                 // document.getElementById(tempTest).classList.add('hover');
//             },100);
//             gridSpaces[y][i].addEventListener('mouseout', function(e){
//                 e.target.classList.remove('hover');
//                 // let tempTest = e.target.id
//                 // console.log(tempTest, "this is the cell you're on")
//                 // tempTest = tempTest.slice(1);
//                 // tempTest = Number(tempTest)+1;
//                 // tempTest = tempTest.toString();
//                 // tempTest = 'c'+tempTest;
//                 // document.getElementById(tempTest).classList.remove('hover');
//             },100);
//             gridSpaces[y][i].addEventListener('click', testclick)
//         }
//     }
// } else if (turnStatus === 'player'){
//     for (y in gridSpaces){
//         for (let i = 0; i < gridSpaces[y].length; i++){
//             gridSpaces[y][i].addEventListener('mouseenter', function(e){
//                 e.target.classList.add('hover');
//             },100);
//             gridSpaces[y][i].addEventListener('mouseout', function(e){
//                 e.target.classList.remove('hover');
//             },100);
//             gridSpaces[y][i].addEventListener('click', clickBoard)
//         }
//     }
// } else if (turnStatus = 'computer'){
//     computerTurn();
// }

function setupPhase(){
    setupRandomComputer();
    setupPlayerPhase();
    render();
}

function setupRandomComputer(){ 
    if (turnStatus = 'setup'){
        ships.forEach(ship =>{
            placeRandomShip(ship,'computer');
        })
    }
    render();
}

function setupPlayerPhase(){
    if (turnStatus = 'setup'){
        ships.forEach(ship =>{
            placeRandomShip(ship,'player');
        })
    }
    render();
}

function acceptLayout(){
    turnStatus = 'player';
}