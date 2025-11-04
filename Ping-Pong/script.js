const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let gameState = 'menu';
let winner = '';
let difficulty = 'medium';
let gameStartTime = 0;
let currentTime = 0;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 15,
    height: 15,
    velocityX: 5,
    velocityY: 3,
    speed: 5
};

const player = {
    x: 20,
    y: canvas.height / 2 - 50,
    width: 15,
    height: 100,
    velocityY: 0,
    speed: 8,
    score: 0
};

const computer = {
    x: canvas.width - 35,
    y: canvas.height / 2 - 50,
    width: 15,
    height: 100,
    velocityY: 0,
    speed: 6,
    score: 0
};

const difficulties = {
    easy: { speed: 3, accuracy: 30 },
    medium: { speed: 6, accuracy: 10 },
    hard: { speed: 9, accuracy: 5 }
};

const keys = {
    w: false,
    s: false
};

document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w':
            keys.w = true;
            break;
        case 's':
            keys.s = true;
            break;
        case 'r':
            if (gameState === 'gameOver') {
                resetGame();
            }
            break;
        case '1':
            if (gameState === 'menu') {
                difficulty = 'easy';
                startGame();
            }
            break;
        case '2':
            if (gameState === 'menu') {
                difficulty = 'medium';
                startGame();
            }
            break;
        case '3':
            if (gameState === 'menu') {
                difficulty = 'hard';
                startGame();
            }
            break;
        case 'm':
            if (gameState === 'gameOver') {
                gameState = 'menu';
            }
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w':
            keys.w = false;
            break;
        case 's':
            keys.s = false;
            break;
    }
});

function startGame() {
    player.score = 0;
    computer.score = 0;
    gameState = 'playing';
    computer.speed = difficulties[difficulty].speed;
    gameStartTime = Date.now();
}
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updatePlayer() {
    if (keys.w && player.y > 0) {
        player.velocityY = -player.speed;
        player.y += player.velocityY;
    } else if (keys.s && player.y + player.height < canvas.height) {
        player.velocityY = player.speed;
        player.y += player.velocityY;
    } else {
        player.velocityY = 0;
    }

    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function updateComputer() {
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y + ball.height / 2;
    const accuracyOffset = difficulties[difficulty].accuracy;
    
    const targetY = ballCenter + (Math.random() - 0.5) * accuracyOffset;
    
    if (targetY < computerCenter - 10) {
        computer.velocityY = -computer.speed;
        computer.y += computer.velocityY;
    } else if (targetY > computerCenter + 10) {
        computer.velocityY = computer.speed;
        computer.y += computer.velocityY;
    } else {
        computer.velocityY = 0;
    }

    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > canvas.height) computer.y = canvas.height - computer.height;
}

function updateBall() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y <= 0 || ball.y + ball.height >= canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    if (ball.x <= player.x + player.width &&
        ball.x + ball.width >= player.x &&
        ball.y <= player.y + player.height &&
        ball.y + ball.height >= player.y) {
        
        ball.velocityX = -ball.velocityX;
        
        if (player.velocityY !== 0) {
            ball.velocityY += player.velocityY * 0.3;
        }
        
        ball.velocityX *= 1.05;
        ball.velocityY *= 1.05;
        
        const maxSpeed = 12;
        if (Math.abs(ball.velocityX) > maxSpeed) {
            ball.velocityX = ball.velocityX > 0 ? maxSpeed : -maxSpeed;
        }
        if (Math.abs(ball.velocityY) > maxSpeed) {
            ball.velocityY = ball.velocityY > 0 ? maxSpeed : -maxSpeed;
        }

        ball.x = player.x + player.width + 1;
    }

    if (ball.x + ball.width >= computer.x &&
        ball.x <= computer.x + computer.width &&
        ball.y <= computer.y + computer.height &&
        ball.y + ball.height >= computer.y) {
        
        ball.velocityX = -ball.velocityX;
        
        if (computer.velocityY !== 0) {
            ball.velocityY += computer.velocityY * 0.3;
        }
        
        ball.velocityX *= 1.05;
        ball.velocityY *= 1.05;
        
        const maxSpeed = 12;
        if (Math.abs(ball.velocityX) > maxSpeed) {
            ball.velocityX = ball.velocityX > 0 ? maxSpeed : -maxSpeed;
        }
        if (Math.abs(ball.velocityY) > maxSpeed) {
            ball.velocityY = ball.velocityY > 0 ? maxSpeed : -maxSpeed;
        }

        ball.x = computer.x - ball.width - 1;
    }

    if (ball.x < 0) {
        computer.score++;
        checkWin();
        resetBall();
    } else if (ball.x > canvas.width) {
        player.score++;
        checkWin();
        resetBall();
    }
}

function checkWin() {
    if (player.score >= 5) {
        winner = 'Player';
        gameState = 'gameOver';
    } else if (computer.score >= 5) {
        winner = 'Computer';
        gameState = 'gameOver';
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.velocityY = (Math.random() - 0.5) * 6;
}

function resetGame() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = 5;
    ball.velocityY = 3;
    
    player.y = canvas.height / 2 - 50;
    player.score = 0;
    
    computer.y = canvas.height / 2 - 50;
    computer.score = 0;
    
    gameState = 'playing';
    winner = '';
    gameStartTime = Date.now();
}

function drawMenu() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.fillText('PONG', canvas.width / 2 - 80, 150);
    
    ctx.font = '32px Arial';
    ctx.fillText('Select Difficulty:', canvas.width / 2 - 120, 250);
    
    ctx.font = '24px Arial';
    ctx.fillText('1 - Easy (Slow AI)', canvas.width / 2 - 100, 320);
    ctx.fillText('2 - Medium (Normal AI)', canvas.width / 2 - 110, 360);
    ctx.fillText('3 - Hard (Fast AI)', canvas.width / 2 - 90, 400);
    
    ctx.font = '18px Arial';
    ctx.fillText('Controls: W/S to move paddle', canvas.width / 2 - 110, 480);
    ctx.fillText('First to 5 points wins!', canvas.width / 2 - 90, 510);
}

function drawGame() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(player.x, player.y, player.width, player.height);
    
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(computer.x, computer.y, computer.width, computer.height);
    
    ctx.shadowColor = '#ff0080';
    ctx.shadowBlur = 15;
    ctx.strokeStyle = '#ff0080';
    ctx.lineWidth = 3;
    ctx.strokeRect(computer.x, computer.y, computer.width, computer.height);
    
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1;

    ctx.fillStyle = '#fff';
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height);

    ctx.font = '40px Arial';
    ctx.fillText(player.score, canvas.width / 4, 50);
    ctx.fillText(computer.score, 3 * canvas.width / 4, 50);

    currentTime = Date.now() - gameStartTime;
    ctx.font = '20px Arial';
    ctx.fillText(`Time: ${formatTime(currentTime)}`, canvas.width / 2 - 50, 15);
    
    ctx.font = '16px Arial';
    ctx.fillText(`Difficulty: ${difficulty.toUpperCase()}`, canvas.width / 2 - 50, 35);
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.fillText(`${winner} Wins!`, canvas.width / 2 - 140, canvas.height / 2);
    
    ctx.font = '24px Arial';
    ctx.fillText('R - Restart Game', canvas.width / 2 - 80, canvas.height / 2 + 50);
    ctx.fillText('M - Main Menu', canvas.width / 2 - 70, canvas.height / 2 + 80);
}

function draw() {
    if (gameState === 'menu') {
        drawMenu();
    } else if (gameState === 'playing') {
        drawGame();
    } else if (gameState === 'gameOver') {
        drawGame();
        drawGameOver();
    }
}

function gameLoop() {
    if (gameState === 'playing') {
        updatePlayer();
        updateComputer();
        updateBall();
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();