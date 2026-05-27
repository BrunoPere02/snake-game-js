const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const gameOverMessageElement = document.getElementById('gameOverMessage');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 15, y: 15}];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = 0;
let gameRunning = true;

highScoreElement.textContent = highScore;

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

function drawGame() {
    ctx.fillStyle = '#0a1a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(192, 192, 192, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    ctx.fillStyle = '#C0C0C0';
    ctx.shadowColor = 'rgba(192, 192, 192, 0.8)';
    ctx.shadowBlur = 10;
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    ctx.shadowBlur = 0;

    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#2d5016';
            ctx.shadowColor = 'rgba(26, 71, 42, 0.8)';
            ctx.shadowBlur = 8;
        } else {
            ctx.fillStyle = '#1a472a';
            ctx.shadowColor = 'rgba(13, 40, 24, 0.6)';
            ctx.shadowBlur = 5;
        }
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
    ctx.shadowBlur = 0;
}

function moveSnake() {
    if (!gameRunning) return;

    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver('limite');
        return;
    }

    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver('corpo');
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function gameOver(reason) {
    gameRunning = false;
    finalScoreElement.textContent = score;

    if (reason === 'limite') {
        gameOverMessageElement.textContent = 'Você colidiu com os limites!';
    } else if (reason === 'corpo') {
        gameOverMessageElement.textContent = 'Você colidiu com você mesmo!';
    } else {
        gameOverMessageElement.textContent = 'O jogo terminou!';
    }

    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
    }

    gameOverElement.classList.add('show');
}

function restartGame() {
    snake = [{x: 15, y: 15}];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    gameOverElement.classList.remove('show');
    generateFood();
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning && e.key !== ' ') return;

    switch(e.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

function gameLoop() {
    moveSnake();
    drawGame();
}

generateFood();
setInterval(gameLoop, 150);
