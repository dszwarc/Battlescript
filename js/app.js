//Declare Variables
const turnChoices = ['setup', 'player', 'computer', 'end-screen'];
let turnStatus = 'start-screen';
let computerDifficulty = 'easy';
let computerRemainingEl;
let remainingComputerShipGrids;
let remainingPlayerShipGrids;
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

let phaseEl;
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

let shipEls;
let gridSpaces = {};
let totalTargets;

createStartScreen();

//---------- Functions ------------//

function runGame(){
    init(size);
    shipEls = document.querySelectorAll('.ship');

    gridSpaces = {
    player: document.querySelectorAll('#player td'),
    computer: document.querySelectorAll('#computer td')
    }
    totalTargets = document.querySelectorAll('#computer .ship').length;

    document.querySelector('body').removeChild(document.querySelector('#start-area'));
    render();
    setupPhase();

  
}

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
//render
function render(){
    updateGridArray();
    remainingComputerShipGrids = document.querySelectorAll('#computer .ship').length;
    remainingPlayerShipGrids = document.querySelectorAll('#player .ship').length;
    const turnStatusEl = document.getElementById('phase');
    const turnDescriptionEl = document.getElementById('turn-description')
    if (turnStatus === 'setup'){
        turnStatusEl.innerText = "SETUP PHASE"
        turnDescriptionEl.innerText = "PLACE YOUR SHIPS. PRESS 'F' TO ROTATE"
    } else if (turnStatus === 'player'){
        turnDescriptionEl.innerText = 'CLICK ON THE ENEMY BOARD TO DESTROY THEIR SHIPS';
        if (remainingPlayerShipGrids === 0){
            winner = 'computer';
            turnStatus = 'end-screen';
        } else {
            turnStatusEl.innerText = "PLAYER'S TURN"
            addBattlePhaseEventListeners();
        }
    } else if (turnStatus === 'computer'){
        turnDescriptionEl.innerText = 'TAKE COVER!';
        if (remainingComputerShipGrids === 0){
            winner = 'player';
            turnStatus = 'end-screen';
        } else {
            turnStatusEl.innerText = "COMPUTER IS THINKING..."
        }
    } else if (turnStatus === 'end-screen'){
        turnDescriptionEl.innerText = '';
        generateResetButton();
        turnStatusEl.innerText = `${winner.toUpperCase()} WINS!`
    }
}
//Enter setup phase
function setupPhase(){
    createSetupControls();
    setupRandomComputer();

    document.addEventListener('keydown', rotateShip);

    gridSpaces.player.forEach(e =>{
        e.addEventListener('mouseenter',highlightShipPlacement);
        e.addEventListener('mouseout', removeHighlightShipPlacement);
    })
    createBattleInfo();
    render();
}
//Function to control what happens when the player clicks on their board, during their turn
function playerAttack(evt){
    if (!winner){
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
    updateBattleInfo();
    render();
    }
    render();
}
//Controls computer AI and defines what happens on their turn
function computerTurn(){
    if (!winner){
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
        render();
        updateBattleInfo();
    }
}
//Chooses a random grid location
function randomGrid(){
    let row = Math.floor(Math.random()*size);
    let column = Math.floor(Math.random()*size);
    return [row,column];
}
//Used for finding a ship (part of impossible mode AI)
function findShip(playerString){
    let array;
    do {
        array = randomGrid();
    } while (gridArray[playerString][array[0]][array[1]] !== 1)
    return array;
}
//Finds a cell that is not a hit or miss (a valid option to fire for CPU)
function emptyOrShip(array, player){
    return gridArray[player][array[0]][array[1]] === 0 || gridArray[player][array[0]][array[1]] === 1 ? true:false;
}
//Finds a grid that is empty
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
//Randomizes true false for help with random layout vertical/horizontal
function trueFalse(){
    let test = Math.random();
    return test < .5 ? true : false;
}
//Rnadomly places ships for both player and user
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
//Updates the DOM based on grid array values
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
//Adds listeners when leaving the setup phase
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
//Checks to see if the desired placement location is outside the board or covering another ship
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
//Flips current ship's horizontal status
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
//Highlights the cells of the ship you're placing by adding hover class to the cells
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
//Removes highlights the cells of the ship you're placing by adding hover class to the cells
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
//Adds HTML elements for buttons during setup
function createSetupControls(){
    const shipyardEl = document.createElement('div');
    shipyardEl.id = 'shipyard';
    document.querySelector('body').appendChild(shipyardEl);

    const randomButtonEl = document.createElement('button');
    randomButtonEl.id = 'randomize-player';
    randomButtonEl.textContent = "RANDOM LAYOUT";
    randomButtonEl.addEventListener('click', setupPlayerPhase);

    const submitButtonEl = document.createElement('button');
    submitButtonEl.id = 'submit-player';
    submitButtonEl.textContent = "START GAME";
    submitButtonEl.addEventListener('click', moveToBattle);

    const resetButton = document.createElement('button');
    resetButton.addEventListener('click', clearUserShips);
    resetButton.textContent = 'RESET';

    shipyardEl.appendChild(randomButtonEl);
    shipyardEl.appendChild(submitButtonEl);
    shipyardEl.appendChild(resetButton);

    document.querySelector('#player').addEventListener('click', placeShipManual);
}
//Randomly generates board layout for CPU
function setupRandomComputer(){ 
    if (turnStatus = 'setup'){
        ships.forEach(ship =>{
            placeRandomShip(ship,'computer');
        })
    }
    render();
}
//Logic for player setup. Allows manual placement, random placement, or reset
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
//Clears player's ships and resets setup phase
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
//Creates tooltips for how many grids remaining
function createBattleInfo(){
        computerRemainingEl = document.createElement('div');
        computerRemainingEl.id = 'computer-remaining';
        computerRemainingEl.classList.add('ship-info');
        computerRemainingEl.innerHTML = `GRIDS STILL CONTAINING ENEMY SHIPS: <br> ${remainingComputerShipGrids}`
        document.querySelector('body').appendChild(computerRemainingEl);

        playerRemainingShipEl = document.createElement('div');
        playerRemainingShipEl.classList.add('ship-info');
        playerRemainingShipEl.id = 'player-remaining';
        playerRemainingShipEl.innerHTML = `GRIDS STILL CONTAINING FRIENDLY SHIPS: <br> ${remainingPlayerShipGrids}`
        document.querySelector('body').appendChild(playerRemainingShipEl);


        phaseEl = document.createElement('h1');
}
//Updates the battle info tooltips
function updateBattleInfo(){
    remainingComputerShipGrids = document.querySelectorAll('#computer .ship').length;
    remainingPlayerShipGrids = document.querySelectorAll('#player .ship').length;
    computerRemainingEl.innerHTML = `GRIDS STILL CONTAINING ENEMY SHIPS: <br> ${remainingComputerShipGrids}`
    playerRemainingShipEl.innerHTML = `GRIDS STILL CONTAINING FRIENDLY SHIPS: <br> ${remainingPlayerShipGrids}`
}
//Updates the DOM from setup to battle
function moveToBattle(){
    if (!(setupPhaseStatus < ships.length)){
        turnStatus = 'player';
        document.querySelector('body').removeChild(document.querySelector('#shipyard'));
        updateBattleInfo();
        render();
    }
}
//Allows manual placement of ships
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
//Creates DOM elements for start screen
function createStartScreen(){
    const startScreen = document.createElement('div');
    startScreen.id='start-area';

    const titleEl = document.createElement('h1');
    titleEl.id = 'title';
    titleEl.textContent = 'BATTLESCRIPT';   
    
    const startButtonEl = document.createElement('button');
    startButtonEl.id = "start-button";
    startButtonEl.addEventListener('click',runGame);
    startButtonEl.textContent = 'START GAME'

    startScreen.appendChild(titleEl);
    startScreen.appendChild(startButtonEl);
    document.querySelector('body').appendChild(startScreen);
    
}
//Creates new game button upon game win
function generateResetButton(){
    resetEl = document.createElement('button');
    resetEl.innerText = 'START NEW GAME';
    resetEl.id = 'reset-button';
    resetEl.addEventListener('click',resetGame);
    document.querySelector('body').appendChild(resetEl);

}
//Resets the game
function resetGame(){
    window.location.reload();
}