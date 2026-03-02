const board = document.querySelector('.board');
const blockHeight = 25;
const blockWidth = 25;
const modal = document.querySelector(".modal");
const startGame = document.querySelector(".start-game");
const reStartGame = document.querySelector(".game-over");
const startBtn = document.querySelector(".btn-start");
const reStartBtn = document.querySelector(".btn-restart");

let highScore = document.getElementById("high-score");
let score = document.getElementById("score");
let time = document.getElementById("time");

const rows = Math.floor(board.clientHeight / blockHeight);
const cols = Math.floor(board.clientWidth / blockWidth);
let interval = null;
let timeerInterval = null;

let hs = localStorage.getItem("highscore") || 0;
highScore.innerText = hs; 

let sc = 0;
let tm = `00-00`;



let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };

const blocks = {}; 
let snake = [
    { x: 1, y: 10 },
    { x: 1, y: 11 },
    { x: 1, y: 12 }
];

let direction = "right";

// Create Grid
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        blocks[`${i}-${j}`] = block;
    }
}

function render() {
    snake.forEach(blk => {
        if (blocks[`${blk.x}-${blk.y}`]) {
            blocks[`${blk.x}-${blk.y}`].classList.remove("fill");
        }
    });

    let head = { ...snake[0] }; 

    if (direction === "left") head.y -= 1;
    else if (direction === "right") head.y += 1;
    else if (direction === "up") head.x -= 1;
    else if (direction === "down") head.x += 1;

    // Game Over Logic
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(interval);
        modal.style.display = "flex"
        startGame.style.display = "none";
        reStartGame.style.display = "flex";
        return; 
    }

    // Eating Food
    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = { 
            x: Math.floor(Math.random() * rows), 
            y: Math.floor(Math.random() * cols) 
        };
        snake.unshift(head); 
        sc += 10;
        score.innerText = sc;

        if(sc > hs) {
            hs = sc;
            localStorage.setItem("highscore", hs.toString());
        }
    } else {
        snake.unshift(head); 
        snake.pop(); 
    }

    // Render Food
    if (blocks[`${food.x}-${food.y}`]) {
        blocks[`${food.x}-${food.y}`].classList.add("food");
    }

    // Render Snake
    snake.forEach(blk => {
        if (blocks[`${blk.x}-${blk.y}`]) {
            blocks[`${blk.x}-${blk.y}`].classList.add("fill");
        }
    });
}

// interval = setInterval(render, 200);

function direc(key) {
    if (key === "ArrowUp" && direction !== "down") direction = "up";
    else if (key === "ArrowDown" && direction !== "up") direction = "down";
    else if (key === "ArrowLeft" && direction !== "right") direction = "left";
    else if (key === "ArrowRight" && direction !== "left") direction = "right";
}

startBtn.addEventListener("click", function(){
    modal.style.display = "none";
    interval = setInterval(() => { render() }, 200);
    timeerInterval = setInterval(() => {
        let [min, sec] = tm.split("-").map(Number);

        if(sec == 59) {
            min += 1;
            sec = 0;
        } else {
            sec += 1;
        }

        tm = `${min}-${sec}`;
        time.innerText = tm;
    }, 1000);
});


reStartBtn.addEventListener("click", restartGame);

function restartGame() {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(blk => {
        blocks[`${blk.x}-${blk.y}`].classList.remove("fill");
    });    

    sc = 0;
    time = `00-00`

    score.innerText = sc;
    highScore.innerText = hs;
    time.innerText = tm;

    modal.style.display = "none";
    direction = "down";
    snake = [
    { x: 1, y: 10 },
    { x: 1, y: 11 },
    { x: 1, y: 12 }
    ];

    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
    interval = setInterval(() => { render() }, 200);
}

window.addEventListener('keydown', (e) => direc(e.key));
