//boardik
let board;
let boardWidth = 350;
let boardHeight = 640;
let context;

//orik
let orikWidth= 34; //w/h ratio = 408/228 = 17/12
let orikHeight = 24;
let orikX = boardWidth/8;
let orikY = boardHeight/2;
let orikImg;

let cat = {
    x : orikX,
    y : orikY,
    width : orikWidth,
    height : orikHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //w/h = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let botPipeImg;

//physics
let velocityX = -2; //pipes goin left speed
let velocityY = 0; //orik jump speed
let gravity = 0.2;

let gameOver = false;
let score = 0;


window.onload = function() {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //draw orik - colour
    //context.fillStyle = "green";
    //context.fillRect(cat.x, cat.y, cat.width, cat.height);

    //load imag
    orikImg = new Image();
    orikImg.src = "./flappybird.png";
    orikImg.onload = function() {
        context.drawImage(orikImg, cat.x, cat.y, cat.width, cat.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    botPipeImg = new Image();
    botPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //1500 ms = 1.5 sec
    document.addEventListener("keydown", moveOrik);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) 
    {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //orik
    velocityY += gravity;
    //cat.y += velocityY;
    cat.y = Math.max(cat.y + velocityY, 0); //apply gravity to current cat.y, or makes sure kitter doesnt go waaay up to da top of da canvas
    context.drawImage(orikImg, cat.x, cat.y, cat.width, cat.height);

    if (cat.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++)
    {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && cat.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 n not 1 bcs there r 2 pipes, it would do multiple if it were 1
            pipe.passed = true;
        }

        if(detectCollision(cat, pipe))
        {
            gameOver = true
        }
    }
    
    //clear pipes, checks fo all da pipes dat went to da left n removes em
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from da array
    }

    //score
    context.fillStyle = "white";
    context.font="45px dotgothic16";
    context.fillText(score, 157, 45);

    if (gameOver) {
        context.fillText("GAME OVA :(", 30, 90);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    //(0-1) * pipeHeight/2
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight)
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random()*(pipeHeight/2); 
    let openingSpace = board.height/4;
    
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : botPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe);
}

function moveOrik(e) {

    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" || e.code == "click")
    {
        //jump
        velocityY = -6;

        //reset game
        if (gameOver) {
            cat.y = orikY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y; 
}


