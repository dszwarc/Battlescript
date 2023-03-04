//Declare Variables


//Dragging functionality
const ships = document.querySelectorAll('.ship');
const gridSpaces = document.querySelectorAll('#c-board td')

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

gridSpaces.forEach(grid =>{
    grid.addEventListener('dragover', e =>{
        //add prevent default to stop "unable" sign
        e.preventDefault;
        //store our element that is being dragged in a variable called ship
        const ship = document.querySelector('.dragging');
        //append our dragged element to the element we are currently dragging over
        grid.appendChild(ship)
    })
})

const grid ={
    player:{columns: ['A','B','C','D','E','F','G'],
            rows:    [1, 2, 3, 4, 5, 6 ,7]
        },
    computer:{columns: ['A','B','C','D','E','F','G'],
    rows:    [1, 2, 3, 4, 5, 6 ,7]
    }
}
const board = {
    player: document.querySelector('p-board'),
    computer: document.querySelector('c-board')
} 

const click = document.querySelector('tbody').addEventListener('click', testclick)

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
