//Declare Variables



//Dragging functionality
const ships = document.querySelectorAll('.ship');
//const gridSpaces = document.querySelectorAll('#c-board td')

ships.forEach(ship =>{
    ship.addEventListener('dragstart', () => {
        ship.classList.add('dragging')
    })
})

ships.forEach(ship =>{
    ship.addEventListener('dragend',()=>{
        ship.classList.remove('dragging')
    })
})

// gridSpaces.forEach(grid =>{
//     grid.addEventListener('dragover', e =>{
//         //add prevent default to stop "unable" sign
//         e.preventDefault;
//         //store our element that is being dragged in a variable called ship
//         const ship = document.querySelector('.dragging');
//         //append our dragged element to the element we are currently dragging over
//         grid.appendChild(ship)
//     })
// })

//const click = document.querySelector('table').addEventListener('click', testclick)

function testclick(evt){
    console.log(evt.target.id);
    evt.target.colorBackground = evt.target.colorBackground === 'rgb(75, 138, 201)' ? 'white' : 'rgb(75, 138, 201)';
}



//---------- Functions ------------//

//initialize function
//reappear dock, clear boards of hit/miss icons, replace turn indicator with "SET-UP PHASE"
//

//make all boats appear in dock
//



function fire(column , row){
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
      const space = Math.floor(Math.random()*100);
      const isEmpty = document.querySelector(`#${space}`).classList;
    } while (isEmpty != 'empty');
    console.log(space);
    return space;
}

generateTable('c-board', 5);
generateTable('p-board', 5);


function generateTable(tablename, size){
    //list all possible column titles
    const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    //create an HTML table elemend with the input name as an id
    const table = document.createElement('table');
    const tBody = document.createElement('tbody');
    table.id = tablename;
    table.appendChild(tBody)
    //table.classList.add('board');
    
    //create first row with letters for looks
    const letterRow = document.createElement('tr')
    const blankSpace = document.createElement('th')
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
            grid.classList.add('empty');
            grid.id = u;
            row.appendChild(grid);
        }
        tBody.appendChild(row)
    }
    
    document.querySelector('body').appendChild(table)
}