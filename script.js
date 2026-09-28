// [ITE_08] CORE CANVA/GRID CONFIGURATION (unchanged)
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;

// [ITE_09] GAME STATE VARIABLES
let snake = [{ x: 200, y: 200 }];
let dx = gridSize;
let dy = 0;
let foodX;
let foodY;
let score = 0;
let level = 1;

// [ITE_10] STATE CONTROLLER VARIABLES
let isRunning = false;
let highScorVal = localStorage.getItem('grandmaSnakeHS') || 0;

document.addEventListener("keydown", changeDirection);

// [ITE_11] INITIAL STATE (Start on Main Menu)
showMainMenu();

// ----------------------------------------------------
// [ITE_12] STATE MACHINE / UI CONTROLLER FUNCTIONS
// ----------------------------------------------------

function startGame() {
    isRunning = true;
    score = 0;
    level = 1;
    snake = [{ x: canvas.width / 2, y: canvas.height / 2 }]; // [NEW] Start center of large board
    dx = gridSize;
    dy = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("level").innerText = level;

    // Toggle screen visibility
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("game-over-modal").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");

    randomFood();
    requestAnimationFrame(mainLoop); // [NEW] Using native requestAnimationFrame for large board
}

function showGameOverModal() {
    isRunning = false;
    document.getElementById("game-screen").classList.add("hidden");

    document.getElementById("final-score").innerText = score;
    // Handle High Score
    if (score > highScorVal) {
        highScorVal = score;
        localStorage.setItem('grandmaSnakeHS', highScorVal);
    }
    document.getElementById("high-score").innerText = highScorVal;

    document.getElementById("game-over-modal").classList.remove("hidden");
}

function showMainMenu() {
    isRunning = false;
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("game-over-modal").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
}

// ----------------------------------------------------
// [ITE_13] CORE GAME LOGIC (UNCHANGED, modified slightly for mainLoop)
// ----------------------------------------------------

function mainLoop() {
    if (!isRunning) return;

    if (hasGameEnded()) {
        showGameOverModal();
        return;
    }

    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        requestAnimationFrame(mainLoop);
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = "#ffcce0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function randomFood() {
    foodX = Math.round((Math.random() * (canvas.width - gridSize)) / gridSize) * gridSize;
    foodY = Math.round((Math.random() * (canvas.height - gridSize)) / gridSize) * gridSize;
}

function drawFood() {
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ff3385";
    ctx.fillRect(foodX, foodY, gridSize, gridSize);
    ctx.strokeRect(foodX, foodY, gridSize, gridSize);
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const ateFood = snake[0].x === foodX && snake[0].y === foodY;
    if (ateFood) {
        score += 10;
        document.getElementById("score").innerText = score;

        // Dynamic Leveling (Optional added value)
        if (score % 50 === 0) {
            level++;
            document.getElementById("level").innerText = level;
        }

        randomFood();
    } else {
        snake.pop();
    }
}

// [ITE_14] PLACEHOLDER: This function will be replaced entirely in Phase 2
function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = "#ff66a3";
        ctx.strokeStyle = "#ff3385";
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
        ctx.strokeRect(part.x, part.y, gridSize, gridSize);
    });
}

function changeDirection(event) {
    if (!isRunning) return;

    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;

    if (event.key === "ArrowLeft" && !goingRight) {
        dx = -gridSize;
        dy = 0;
    }
    if (event.key === "ArrowUp" && !goingDown) {
        dx = 0;
        dy = -gridSize;
    }
    if (event.key === "ArrowRight" && !goingLeft) {
        dx = gridSize;
        dy = 0;
    }
    if (event.key === "ArrowDown" && !goingUp) {
        dx = 0;
        dy = gridSize;
    }
}