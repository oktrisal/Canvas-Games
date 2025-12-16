import Button from '../button/button.js';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const button = new Button(null, { text: 'Klicka här!' });
let lastTime = performance.now();

let highScore = localStorage.getItem('highScore') || 0;
highScore = parseInt(highScore);
let timer = 45; 
let timerActive = true;
let score = 0;
let hitSomething = false;
let hits = 0;
let misses = 0;

const music = new Audio('./music.mp3')
music.loop = true

async function tryPlayAudio() {
  try {
    await music.play();
    console.log('Audio is playing!');
  } catch (err) {
    console.warn('Autoplay prevented, waiting for user interaction...');
    // Retry after user interacts
    document.addEventListener('click', retryOnUserAction, { once: true });
  }
}

function retryOnUserAction() {
  music.play().then(() => {
    console.log('Audio started after user interaction');
  }).catch(err => {
    console.error('Still failed to play:', err);
  });
}
tryPlayAudio();

const input = {
    mousePosition: { x: 0, y: 0 },
    mouseDown: false,
    getMouseButtonDown(button) {
        return this.mouseDown;
    }
};

let restartButton = new Button(input, {
    text: "Restart",
    fontSize: 30,
    width: 200,
    height: 60,
    x: canvas.width / 2 - 100,
    y: canvas.height / 2 - 30,
    fillColor: "#2ecc71",
    hoverFillColor: "#27ae60",
    borderSize: 2,
    borderColor: "#000"
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    input.mousePosition.x = e.clientX - rect.left;
    input.mousePosition.y = e.clientY - rect.top;
});

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) input.mouseDown = true;
});

canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0) input.mouseDown = false;
});

let ball1 = {
    x: Math.random() * (canvas.width - 30) + 15,
    y: Math.random() * (canvas.height - 30) + 15,
    radius: 30,
    color: 'cyan'
}
let ball2 = {
    x: Math.random() * (canvas.width - 30) + 15,
    y: Math.random() * (canvas.height - 30) + 15,
    radius: 30,
    color: 'cyan'
}
let ball3 = {
    x: Math.random() * (canvas.width - 30) + 15,
    y: Math.random() * (canvas.height - 30) + 15,
    radius: 30,
    color: 'cyan'
}

let balls = [ball1, ball2, ball3];

canvas.addEventListener('click', function(event) {
    if (timer <= 0) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    let hit = false;

    balls.forEach(ball => {
        const distance = Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2);
        if (distance <= ball.radius) {
            score += 100;
            hits++;
            hit = true; 
            respawnBall(ball);
        }
    });
    if (!hit) {
        misses++;
        score -= 50;
    }
});
function respawnBall(ball) {
    ball.x = Math.random() * (canvas.width - 30) + 15;
    ball.y = Math.random() * (canvas.height - 30) + 15;
}

function resetGame() {
    timer = 45;
    score = 50;
    hits = 0;
    misses = -1;
    timerActive = true;

    balls.forEach(ball => {
        ball.x = Math.random() * (canvas.width - 30) + 15;
        ball.y = Math.random() * (canvas.height - 30) + 15;
    });

    lastTime = performance.now();
    gameLoop(lastTime);
}

function gameLoop(currentTime){
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    update(deltaTime);
    render();
    requestAnimationFrame(gameLoop);

}
function render(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "darkgray";
    ctx.fillRect(0,0,canvas.width, canvas.height); 

    if (timer > 0) {
        balls.forEach(ball => {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = ball.color;
            ctx.fill();
            ctx.closePath();
            ctx.lineWidth = 1.2; 
            ctx.strokeStyle = "black";
            ctx.stroke();

        ctx.closePath();
        });
    }
    if(timer <= 0){
        if (score > highScore){
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        ctx.font = "50px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Game Over", 150, 100);
        ctx.fillText("Score: " + score, 150, 160);
        ctx.fillText("High Score: " + highScore, 200, 220);
        ctx.fillText("Accuracy: " + (hits + misses > 0 ? ((hits / (hits + misses)) * 100).toFixed(2) : 0) + "%", 210, 280);

        restartButton.draw(ctx);
        if (restartButton.clicked()) {
            resetGame();
    };
    }

    else if (hits >= 0) {  
        ctx.font = "50px Arial"
        ctx.fillStyle = timer <= 3 ? "red" : "black";
        ctx.fillText(Math.ceil(timer), 100, 100);
        

        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Score: " + score, 100, 150);
        ctx.fillText("Hits: " + hits, 100, 200);
        ctx.fillText("Misses: " + misses, 100, 250);
    }
}
function update(deltaTime){
    if(timerActive && (hits || misses) > 0){
        timer -= deltaTime;
    }
    if (timer == 0 ){
        timer = 0; 
        timerActive = false;
    
    }
}

gameLoop(performance.now());