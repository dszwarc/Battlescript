//Declare Variables
const turnChoices = ['setup', 'player', 'computer', 'end-screen', 'start-screen'];
let turnStatus;
let computerDifficulty = 'hard';
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

const destroyer = new Ship('destroyer', 1);
const cruiser = new Ship('cruiser', 2)
const submarine = new Ship('submarine', 2);
const battleship = new Ship('battleship',3);
const carrier = new Ship('carrier',4);
const ships = [];
ships.push(destroyer, cruiser, submarine, battleship, carrier);

//Declaring variable that will hold the status of what ship is being put down
let setupPhaseStatus = 0;
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

//---------- Functions ------------//

//initialize function
function init(){
    //set each cell to 0 initially (empty class)
    for (y in gridArray) {
        for (let i = 0; i < size; i++){
        gridArray[y][i] = [0];
            for (let u = 0; u < size; u++){
                gridArray[y][i][u]= 0;
            }
    }}
    turnStatus = 'setup';
    setupPhaseStatus = 0;
    generateTable('computer');
    generateTable('player');
}
setupPhase();

//render
function render(){
    updateGridArray();
    remainingComputerShipGrids = document.querySelectorAll('#computer .ship').length;
    remainingPlayerShipGrids = document.querySelectorAll('#player .ship').length;
    const turnStatusEl = document.getElementById('phase');
    const turnDescriptionEl = document.getElementById('turn-description')
    if (turnStatus === 'setup'){
        turnStatusEl.innerText = "SETUP PHASE"
    } else if (turnStatus === 'player'){
        if (remainingPlayerShipGrids === 0){
            winner = 'computer';
            turnStatus = 'end-screen';
        } else {
            turnStatusEl.innerText = "PLAYER'S TURN"
            addBattlePhaseEventListeners();
        }
    } else if (turnStatus === 'computer'){
        if (remainingComputerShipGrids === 0){
            winner = 'player';
            turnStatus = 'end-screen';
        } else {
            turnStatusEl.innerText = "COMPUTER IS THINKING..."
        }
    } else if (turnStatus === 'end-screen'){
        turnStatusEl.innerText = `${winner.toUpperCase()} WINS!`
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
        let gridCompare = gridArray.computer[gridIdArray[0]][gridIdArray[1]];
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
    if (turnStatus === 'computer' && computerDifficulty === 'easy'){
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
        turnStatus = 'player';
        render();
    } else if (turnStatus === 'computer' && computerDifficulty === 'hard'){
        //write auto firing code
        let computerFire;
        computerFire = findShip('player');

        if (gridArray.player[computerFire[0]][computerFire[1]] === 0){
            gridArray.player[computerFire[0]][computerFire[1]] = 3;
        } else {
            gridArray.player[computerFire[0]][computerFire[1]] = 2;
        }
        turnStatus = 'player';
        render();
    } else {
        render();
        setTimeout(computerTurn, 750);
    }
}

function randomGrid(){
    let row = Math.floor(Math.random()*size);
    let column = Math.floor(Math.random()*size);
    return [row,column];
}

function findShip(playerString){
    let array;
    do {
        array = randomGrid();
    } while (gridArray[playerString][array[0]][array[1]] !== 1)
    return array;
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
    if (checkIfValidLocation(playerPlacement, playerString, shipConst)){
        if (shipConst.isHorizontal && (playerPlacement[1]+ shipConst.size < 9)){
            gridArray[playerString][playerPlacement[0]][playerPlacement[1]] = 1;
            for(let i = 1; i <= shipConst.size; i++){
                gridArray[playerString][playerPlacement[0]][playerPlacement[1]+i] = 1;
            }
        } else if (!shipConst.isHorizontal && (playerPlacement[0]+ shipConst.size < 9)){
            gridArray[playerString][playerPlacement[0]][playerPlacement[1]] = 1;
            for(let i = 1; i <= shipConst.size; i++){
                gridArray[playerString][playerPlacement[0]+i][playerPlacement[1]] = 1;
            }
        } else {
            placeRandomShip(shipConst, playerString)
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

function checkIfValidLocation(array, playerString, ship){
    let allEmpty = true;
    if (ship.isHorizontal && (array[1]+ ship.size < 9)){
        for (let i = 0; i <= ship.size; i++){
            if ((gridArray[playerString][array[0]][(array[1]+i)]) !== 0){
                allEmpty = false;
            } 
        }
    } else if (!ship.isHorizontal && (array[0] + ship.size < 9)){
        for (let i = 0; i <= ship.size; i++){
            if ((gridArray[playerString][(array[0]+i)][array[1]]) !== 0){
                allEmpty = false;
            } 
        }
    }
    return allEmpty;
}

function rotateShip(event){
    let key = event.key;
    if (key == 'f'){
        ships[setupPhaseStatus].isHorizontal = !ships[setupPhaseStatus].isHorizontal;
    }

    let allGrids = document.querySelectorAll('#player td')
    for (let i = 0; i < 100; i++){
        if (allGrids[i].classList.contains('hover')){
            allGrids[i].classList.remove('hover');
        }
    }
}

function highlightShipPlacement(evt){
    if (setupPhaseStatus < 5){
        let startGrid = evt.target.id;
        startGrid = startGrid.slice(1);
        let startTest = [Number(startGrid)];
        startGrid = startGrid.split('');
        if (startTest < 10){
            startGrid.unshift('0');
        }
        let row = Number(startGrid[0]);
        let column = Number(startGrid[1]);
        let ship = ships[setupPhaseStatus];

        if(turnStatus = 'setup' && checkIfValidLocation([row,column],'player', ship)){
            evt.target.classList.add('hover');
            if (ship.isHorizontal && row === 0){
                for (let i = 1; i <= ship.size; i++){
                    let id = 'p'+(column+i);
                    if (column+i <10){
                        document.getElementById(id).classList.add('hover');
                    }
                }
            } else if (ship.isHorizontal && row !== 0){
                for (let i = 1; i <= ship.size; i++){
                    let id = 'p'+ row + (column+i);
                    if (row < 10 && column+i <10){
                        document.getElementById(id).classList.add('hover');
                    }
                }
            } else {
                for (let i = 1; i <= ship.size; i++){
                    let id = 'p'+ (row+i) + column;
                    if (row+i < 10 && column <10){
                        document.getElementById(id).classList.add('hover');
                    }
                }    
            }
        }
    }
}


function removeHighlightShipPlacement(evt){
    if (setupPhaseStatus < 5){
        let startGrid = evt.target.id;
        startGrid = startGrid.slice(1);
        let startTest = [Number(startGrid)];
        startGrid = startGrid.split('');
        if (startTest < 10){
            startGrid.unshift('0');
        }
        let row = Number(startGrid[0]);
        let column = Number(startGrid[1]);
        let ship = ships[setupPhaseStatus];

        if(turnStatus = 'setup' && checkIfValidLocation([row,column],'player',ship)){
            evt.target.classList.remove('hover');
            if (ship.isHorizontal && row === 0){
                for (let i = 1; i <= ship.size; i++){
                    let id = 'p'+(column+i);
                    if (column+i <10){
                        document.getElementById(id).classList.remove('hover');
                    }
                }
            } else if (ship.isHorizontal && row !== 0){
                for (let i = 1; i <= ship.size; i++){
                    let id = 'p'+ row + (column+i);
                    if (row < 10 && column+i <10){
                        document.getElementById(id).classList.remove('hover');
                    }
                }
            } else {
                for (let i = 1; i <= ship.size; i++){
                    let id = 'p'+ (row+i) + column;
                    if (row+i < 10 && column <10){
                        document.getElementById(id).classList.remove('hover');
                    }
                }    
            }
        }
    }
}




function setupPhase(){
    createSetupControls();
    setupRandomComputer();

    document.addEventListener('keydown', rotateShip);

    gridSpaces.player.forEach(e =>{
        e.addEventListener('mouseenter',highlightShipPlacement);
        e.addEventListener('mouseout', removeHighlightShipPlacement);
    })
    
    render();
}

function createSetupControls(){
    const shipyardEl = document.createElement('div');
    shipyardEl.id = 'shipyard';
    document.querySelector('body').appendChild(shipyardEl);

    const randomButtonEl = document.createElement('button');
    randomButtonEl.id = 'randomize-player';
    randomButtonEl.textContent = "RANDOMIZE YOUR FLEET'S LOCATION";
    randomButtonEl.addEventListener('click', setupPlayerPhase);

    const submitButtonEl = document.createElement('button');
    submitButtonEl.id = 'submit-player';
    submitButtonEl.textContent = "SUBMIT YOUR FLEET'S CURRENT LOCATIONS";
    submitButtonEl.addEventListener('click', moveToBattle);

    const resetButton = document.createElement('button');
    resetButton.addEventListener('click', clearUserShips);
    resetButton.textContent = 'RESET YOUR FIELD';

    shipyardEl.appendChild(randomButtonEl);
    shipyardEl.appendChild(submitButtonEl);
    shipyardEl.appendChild(resetButton);

    document.querySelector('#player').addEventListener('click', placeShipManual);
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
        clearUserShips();
        ships.forEach(ship =>{
            placeRandomShip(ship,'player');
            setupPhaseStatus = 6;
        })
    }
    render();
}

function clearUserShips(){
    for (let i = 0; i < size; i++){
        gridArray.player[i] = [0];
            for (let u = 0; u < size; u++){
                gridArray.player[i][u]= 0;
            }
        }
        setupPhaseStatus = 0;
        render();
}

function createBattleInfo(){
        const computerRemainingEl = document.createElement('div');
        const shotsTakenEl = document.createElement('div');
        computerRemainingEl.id = 'computer-remaining';
        computerRemainingEl.textContent = `GRIDS STILL CONTAINING ENEMY SHIPS: ${remainingComputerShipGrids}`

}

function updateBattleInfo(){
    computerRemainingEl.textContent = `GRIDS STILL CONTAINING ENEMY SHIPS: ${remainingComputerShipGrids}`
}

function moveToBattle(){
    turnStatus = 'player';
    document.querySelector('body').removeChild(document.querySelector('#shipyard'));
    render();
}

function placeShipManual(evt){
    if (setupPhaseStatus <5){
        const playerPlacement = evt.target.id.split('').slice(1);
        if (playerPlacement < 10){
            playerPlacement.unshift(0);
        }
        let row = Number(playerPlacement[0]);
        let column = Number(playerPlacement[1]);
        let currentShip = ships[setupPhaseStatus];
        if (checkIfValidLocation([row, column], 'player', currentShip)){
                        if (currentShip.isHorizontal && column + currentShip.size < 10){
                            gridArray.player[row][column] = 1;
                            setupPhaseStatus += 1;
                            for(let i = 1; i <= currentShip.size; i++){
                                gridArray.player[row][column+i] = 1;
                            }
                        } else if (!currentShip.isHorizontal && row + currentShip.size < 10){
                            gridArray.player[row][column] = 1;
                            setupPhaseStatus += 1;
                            for(let i = 1; i <= currentShip.size; i++){
                                gridArray.player[row+i][column] = 1;
                            }
                        } 
        }
    }
    render();
}