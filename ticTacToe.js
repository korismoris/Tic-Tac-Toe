
const gameBoard = (function () {
    const gameArray = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    let gameProgress = true;  
    let fullBoard = false;
    function createDivGrid(x = 3, y = 3) {
        currentPlayer = player1; 
        gameProgress = true;
        // Clear button
        const clearButton = document.querySelector('#clearButton');
        clearButton.addEventListener('click', nextGame);
        const containerDiv = document.querySelector('.container');
        for (let i = 0; i < x; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            for (let j = 0; j < y; j++) {
                //Create divs that will represent game grid
                 const newDiv = document.createElement('div');
                 const divWidth = '100%';
                 const divHeight = '100%';
                 newDiv.style.height = divHeight;
                 newDiv.style.width = divWidth;
                 newDiv.id = `${j}${i}div`; 
                 newDiv.classList.add('box'); 
    
                 //Click function
                 newDiv.addEventListener('click', function(e) {
                    if (gameProgress) {
                        let spot = freeSpot(e.target.id);
                        if (spot) {
                            let firstNum = e.target.id[0];
                            let secondNum = e.target.id[1];
                            gameArray[firstNum][secondNum] = currentPlayer.playerNumber;
                            render();
                            let result = checkWinner();
                            if (currentPlayer === player1) {
                                currentPlayer = player2;
                            } else {
                                currentPlayer = player1;
                            }
                            console.log(result);
                        }
                    } 
                });
    
                 row.appendChild(newDiv);
            }
            containerDiv.appendChild(row);
        }
    }
    const checkWinner= function () {
        let pastorCount = 0;
        let bistecCount = 0;
        // Vertical Check
        for(let i = 0; i < gameArray.length; i++) {
            for(let j = 0; j < gameArray.length; j++) {
                if(gameArray[i][j] === player1.playerNumber) {
                    pastorCount++;
                }
                if(gameArray[i][j] === player2.playerNumber) {
                    bistecCount++;
                }
            }
            if(pastorCount === gameArray.length) {
                gameProgress = false; 
                return gameWinner();
                
            }
            if(bistecCount === gameArray.length) {
                 gameProgress = false; 
                 return gameWinner();
               
            }
            pastorCount = 0;
            bistecCount = 0; 
        }
       
        // Horizontal Check
        for (let j = 0; j < gameArray.length; j++) {
            for(let i = 0; i <gameArray.length; i++) {
                if(gameArray[i][j] === player1.playerNumber) {
                    pastorCount++;
                }
                if(gameArray[i][j] ===  player2.playerNumber) {
                    bistecCount++;
                } 
            }
            if(pastorCount === gameArray.length) {
                gameProgress = false;
                return gameWinner();
            }
            if(bistecCount === gameArray.length) {
                gameProgress = false;
                return gameWinner();
            }
            pastorCount = 0;
            bistecCount = 0; 
        }
    
            //* Diagonal Check one way
        let i = 0;
        let j = 0;
        while(i < gameArray.length) {
            if(gameArray[i][j] === player1.playerNumber) {
                pastorCount++;
            }
            if(gameArray[i][j] === player2.playerNumber) {
                bistecCount++;
            }
            i++;
            j++;
        }
        
        if(pastorCount === gameArray.length) {
            gameProgress = false;
            return gameWinner();
        }
        if(bistecCount === gameArray.length) {
            gameProgress = false;
            return gameWinner();
        }
        //* Diagonal Check other side
        pastorCount = 0;
        bistecCount = 0;

        i = 0;
        j = gameArray.length - 1;
        while(i < gameArray.length) {
            if(gameArray[i][j] === player1.playerNumber) {
                pastorCount++;
            }
            if(gameArray[i][j] === player2.playerNumber) {
                bistecCount++;
            }
            i++;
            j--;
        }
        if(pastorCount === gameArray.length) {
            gameProgress = false;
            return gameWinner();
        }
        if(bistecCount === gameArray.length) {
            gameProgress = false;
            return gameWinner();
        }
        if(checkTie()){
            return "Tie";
        }
        
        return "game in progress...";
    }
    let gameWinner = function() {
        currentPlayer.addScore();
        let currentPastorScore = document.querySelector('#pastorScore');
        currentPastorScore.textContent = player1.getScore();
        let currentBistecScore = document.querySelector('#bistecScore');
        currentBistecScore.textContent = player2.getScore();
        return;
    }
    let nextGame = function() {
        for(let i = 0; i < gameArray.length; i++) {
            for(let j =0; j < gameArray.length; j++){
                gameArray[i][j]=0;
            }
        }
        let clearingDom = document.querySelector('.container');
        clearingDom.textContent = "";
        createDivGrid();
    }

    function freeSpot (id) {
        let firstNum = id[0];
        let secondNum = id[1];
        console.log({firstNum, secondNum});
        if (gameArray[firstNum][secondNum] === 0) {
            return true;
        }
        return false;
    }

    function checkTie () {
        let fullBoard = !gameArray.some(row => row.includes(0));
        return fullBoard;
        
    }

    function render () {
        for (let i = 0; i < gameArray.length; i++) {
            for (let j = 0; j < gameArray[i].length; j++) {
                let currentDiv = document.getElementById(`${i}${j}div`);
                if(gameArray[i][j] ===  1 && !currentDiv.hasChildNodes()) {
                    let currentTaco = tacoFactory(gameArray[i][j]); 
                    currentTaco.type.id = `${i}${j}img`;
                    currentDiv.appendChild(currentTaco.type);
                }
                if(gameArray[i][j] === 2 && !currentDiv.hasChildNodes()) {
                    let currentTaco = tacoFactory(gameArray[i][j]);
                    currentTaco.type.id = `${i}${j}img`;
                    currentDiv.appendChild(currentTaco.type);
                 }
                 if(gameArray[i][j] === 0) {
                     continue;
                 }
             }
         }
     }
     
     //Create a taco based on the type desired
    function tacoFactory () {
        let type = document.createElement("img");
        type.src = `Images/${currentPlayer.playerTaco}.jpg`;
        type.setAttribute("style", "height: 100%");
        type.setAttribute("style", "width: 100%");
        return {type};
     }

    return {
        createDivGrid,
        checkWinner,
        gameWinner
    }

    
    })();

const player = (playerNum, taco) => {
    const playerNumber = playerNum;
    let playerTaco = taco;
    let playerScore = 0;
    function addScore () {
        playerScore++;
    }

    function getScore () {
        return playerScore;
    }

    return {
        playerNumber,
        playerTaco,
        addScore,
        getScore
    }
}
function taqueroNameAssigner () {
    let player1 = prompt("Please enter your name:");
    document.getElementById("player1").innerHTML = `Taquero ${player1}`;
    let player2 = prompt("Please enter your name:");
    document.getElementById("player2").innerHTML = `Taquero ${player2}`;
}

let player1 = player(1, "pastor");
let player2 = player(2, "bistec");
let currentPlayer = player1;
gameBoard.createDivGrid();
taqueroNameAssigner();