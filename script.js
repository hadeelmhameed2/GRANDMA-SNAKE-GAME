const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;

let snake = [{ x: 200, y: 200 }];
let dx = gridSize;
let dy = 0;
let foodX;
let foodY;

document.addEventListener("keydown", changeDirection);

randomFood();
main();

function main() {
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        main();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = "#ffcce0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
        randomFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = "#ff66a3";
        ctx.strokeStyle = "#ff3385";
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
        ctx.strokeRect(part.x, part.y, gridSize, gridSize);
    });
}

function changeDirection(event) {
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