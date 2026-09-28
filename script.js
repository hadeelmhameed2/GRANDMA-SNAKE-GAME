const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;

let snake = [{ x: 200, y: 200 }];
let dx = gridSize;
let dy = 0;
let score = 0;
let level = 1;

let foods = [];
let poisons = [];
let baseSpeed = 120;

let isRunning = false;
let isPaused = false;
let highScorVal = localStorage.getItem('grandmaSnakeHS') || 0;

document.addEventListener("keydown", changeDirection);

showMainMenu();

function startGame() {
    isRunning = true;
    isPaused = false;
    score = 0;
    level = 1;
    snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
    dx = gridSize;
    dy = 0;

    document.getElementById("score").innerText = score;
    document.getElementById("level").innerText = level;
    document.getElementById("pause-button").innerText = "PAUSE";

    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("game-over-modal").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");

    spawnEntities();
    requestAnimationFrame(mainLoop);
}

function showGameOverModal() {
    isRunning = false;
    document.getElementById("game-screen").classList.add("hidden");

    document.getElementById("final-score").innerText = score;
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

function togglePause() {
    if (!isRunning) return;
    isPaused = !isPaused;
    document.getElementById("pause-button").innerText = isPaused ? "RESUME" : "PAUSE";
}

function mainLoop() {
    if (!isRunning) return;

    if (hasGameEnded()) {
        showGameOverModal();
        return;
    }

    if (isPaused) {
        requestAnimationFrame(mainLoop);
        return;
    }

    let currentSpeed = Math.max(40, baseSpeed - (level * 5));

    setTimeout(function onTick() {
        if (!isPaused && isRunning) {
            clearCanvas();
            drawEntities();
            advanceSnake();
            drawSnake();
        }
        requestAnimationFrame(mainLoop);
    }, currentSpeed);
}

function clearCanvas() {
    ctx.fillStyle = "#ffcce0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    const hitLeft = snake[0].x < 0;
    const hitRight = snake[0].x >= canvas.width;
    const hitTop = snake[0].y < 0;
    const hitBottom = snake[0].y >= canvas.height;
    const hitPoison = poisons.some(p => p.x === snake[0].x && p.y === snake[0].y);

    return hitLeft || hitRight || hitTop || hitBottom || hitPoison;
}

function getRandomPosition() {
    return {
        x: Math.round((Math.random() * (canvas.width - gridSize)) / gridSize) * gridSize,
        y: Math.round((Math.random() * (canvas.height - gridSize)) / gridSize) * gridSize
    };
}

function spawnEntities() {
    foods = [];
    poisons = [];

    let foodCount = 1 + Math.floor(level / 3);
    for (let i = 0; i < foodCount; i++) {
        foods.push(getRandomPosition());
    }

    if (level >= 5) {
        let poisonCount = level - 4;
        for (let i = 0; i < poisonCount; i++) {
            poisons.push(getRandomPosition());
        }
    }
}

function drawEntities() {
    foods.forEach(f => {
        drawCupcake(f.x, f.y);
    });

    poisons.forEach(p => {
        drawPotion(p.x, p.y);
    });
}

function drawCupcake(x, y) {
    const cx = x + gridSize / 2;
    const cy = y + gridSize / 2;

    ctx.fillStyle = "#d2b48c";
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy + 8);
    ctx.lineTo(cx + 6, cy + 8);
    ctx.lineTo(cx + 8, cy);
    ctx.lineTo(cx - 8, cy);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx - 5, cy - 1, 5, 0, Math.PI * 2);
    ctx.arc(cx + 5, cy - 1, 5, 0, Math.PI * 2);
    ctx.arc(cx, cy - 5, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(cx, cy - 9, 3, 0, Math.PI * 2);
    ctx.fill();
}

function drawPotion(x, y) {
    const cx = x + gridSize / 2;
    const cy = y + gridSize / 2;

    ctx.fillStyle = "#9900cc";
    ctx.beginPath();
    ctx.arc(cx, cy + 4, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#4d0066";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillRect(cx - 3, cy - 4, 6, 6);
    ctx.strokeRect(cx - 3, cy - 4, 6, 6);

    ctx.fillStyle = "#8b4513";
    ctx.fillRect(cx - 2, cy - 7, 4, 3);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy + 4, 3, Math.PI, Math.PI * 1.5);
    ctx.stroke();
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    let ateFoodIndex = foods.findIndex(f => f.x === head.x && f.y === head.y);

    if (ateFoodIndex !== -1) {
        score += 10;
        document.getElementById("score").innerText = score;

        if (score % 50 === 0) {
            level++;
            document.getElementById("level").innerText = level;
            spawnEntities();
        } else {
            foods.splice(ateFoodIndex, 1);
            foods.push(getRandomPosition());
        }
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((part, index) => {
        const isHead = index === 0;

        const centerX = part.x + gridSize / 2;
        const centerY = part.y + gridSize / 2;
        const radius = (gridSize / 2) - 1;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = isHead ? "#ff3385" : "#ff66a3";
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#cc0052";
        ctx.stroke();

        if (isHead) {
            drawCartoonFace(centerX, centerY);
        }
    });
}

function drawCartoonFace(headX, headY) {
    let leftEye;
    let rightEye;

    if (dx > 0) {
        leftEye = { x: 3, y: -4 };
        rightEye = { x: 3, y: 4 };
    } else if (dx < 0) {
        leftEye = { x: -3, y: -4 };
        rightEye = { x: -3, y: 4 };
    } else if (dy > 0) {
        leftEye = { x: -4, y: 3 };
        rightEye = { x: 4, y: 3 };
    } else if (dy < 0) {
        leftEye = { x: -4, y: -3 };
        rightEye = { x: 4, y: -3 };
    } else {
        leftEye = { x: 4, y: -4 };
        rightEye = { x: -4, y: -4 };
    }

    ctx.fillStyle = "white";
    ctx.beginPath(); ctx.arc(headX + leftEye.x, headY + leftEye.y, 4, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(headX + rightEye.x, headY + rightEye.y, 4, 0, 2 * Math.PI); ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath(); ctx.arc(headX + leftEye.x + (dx/20), headY + leftEye.y + (dy/20), 2, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(headX + rightEye.x + (dx/20), headY + rightEye.y + (dy/20), 2, 0, 2 * Math.PI); ctx.fill();
}

function changeDirection(event) {
    if (!isRunning || isPaused) return;

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

document.getElementById("settings-button").onclick = function() {
    document.getElementById("settings-modal").classList.remove("hidden");
};

function closeSettings() {
    document.getElementById("settings-modal").classList.add("hidden");
}

document.getElementById("exit-button").onclick = function() {
    if (confirm("Are you sure you want to exit the game?")) {
        window.close();
        window.location.href = "about:blank";
    }
};