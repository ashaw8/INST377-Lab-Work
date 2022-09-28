document.addEventListener('DOMContentLoaded', () => 
{
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const ScoreDisplay = document.querySelector('#Score')
    const StartBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0 
    let timerId
    let score = 0

    // Tetrominoes @ 102:15 in video
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]   
    ]

    const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
    ]

    const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
    ]

    const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
    ]

    const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
    ]

    const allTetrominos = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino]
        
    let currentPosition = 4
    let currentRotation = 0
    // Select random tetromino
    let random = Math.floor(Math.random()*allTetrominos.length)

    let current = allTetrominos[random][currentRotation]


    // Drawing first rotation tet.
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino') 
        })
        }

    draw()

    //Undraw tetrimino 
    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }

    // makes tetromino move down, Adjust setInterval(moveDown, int) 'int' to increase
    // or decrease difficulty

    //timerId = setInterval(moveDown, 1000)

    //assign functions to key codes
    function control(e){
        if(e.keyCode === 37) {
            moveLeft() 
        }  else if (e.keyCode === 38){
            rotate()
        }  else if(e.keyCode === 39) {
            moveRight()
        }  else if(e.keyCode === 40) {
            moveDown()
        }
    }
    // listens to any time we press an arrow key and passes to control func.
    document.addEventListener('keyup', control)

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }
    //freeze function
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index=> squares[currentPosition + index].classList.add('taken'))
            // Start a new tetromino
            random = nextRandom
            nextRandom = Math.floor(Math.random() *  allTetrominos.length)
            current = allTetrominos[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    // move the tetromino left with edge in mind
    function moveLeft(){
        undraw()
        const isALeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isALeftEdge) currentPosition -= 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition =+ 1
            }
        draw()
    }

    //move the tetromino right unless it's blocked
    function moveRight(){
        undraw()
        const isARightEdge = current.some(index => (currentPosition +index) % width === width-1)

        if(!isARightEdge) currentPosition += 1

        if(current.some(index=> squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }

        draw() 
    }

    // rotate tetromino
    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length){ // when current rotation reachs 4, reset to 0
            currentRotation = 0 
        }
        current = allTetrominos[random][currentRotation]
        draw()
    }


    //Display squares
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0

    //the tetrominos without rotation
    const upNextTetr = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0, displayWidth, displayWidth+1, displayWidth*2+1],
        [1, displayWidth, displayWidth+1, displayWidth+2],
        [0,1,displayWidth,displayWidth+1],
        [1,displayWidth+1, displayWidth*2+1, displayWidth*3+1]
    ]
    //display the shapes

    function displayShape() {
        //remove tetromino
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
        })
        upNextTetr[nextRandom].forEach( index =>{
            displaySquares[displayIndex + index].classList.add('tetromino')
            })
    }

    // add function to the button

    StartBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        }   else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * allTetrominos.length)
            displayShape()
        }
    })

// add score fuction
    function addScore() {
        for (let i = 0; i < 199; i+= width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5,i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                ScoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell =>  grid.appendChild(cell))
            }
            
        }
    }

    // game over function
    function gameOver () {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            ScoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }



})
