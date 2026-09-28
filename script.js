
const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

const gridSize = 20;


let snake = [
    { x: 200, y: 200 }
];

function drawSnake()
{
    snake.forEach(part =>
    {
        ctx.fillStyle = "#ff66a3";

        ctx.fillRect(part.x, part.y, gridSize, gridSize);

        ctx.strokeStyle = "#ff3385";

        ctx.strokeRect(part.x, part.y, gridSize, gridSize);
    });
}

drawSnake();