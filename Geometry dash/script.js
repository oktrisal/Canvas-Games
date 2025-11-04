const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
import Input, { Keys } from "../input.js/input.js";
const input = new Input(canvas);
let gameState = 'menu';
let debugMovement = false;
let gamestate2 = '';
let imagesLoaded = 0;
let finishLine = null;
const totalImages = 3;
const tileSize = 50;
let mode ='cube'
let boxobstacles = [];
let doubleJumpBalls = [];
let jumpPads = [];
let portals = [];
let unlockedMaps = JSON.parse(localStorage.getItem('unlockedMaps')) || {
    map1: true,
    map2: false,
    map3: false
};



const forest = new Image();
forest.src = '../../../../images/Forest.avif';

const ocean = new Image();
ocean.src = '../../../../images/Ocean.webp';

const desert = new Image();
desert.src = '../../../../images/Desert.jpg';

const map1Img = new Image();
map1Img.src = './maps/map1.png';

const map2Img = new Image();
map2Img.src = './maps/test.map2.png'

const map3Img = new Image();
map3Img.src = './maps/test.map3.png';

let camera = {
    x: 0,
    speed: 4
};

let player = {
    x: 50,
    y: 900,
    width: 50,
    height: 50,
    color: 'red',
    velocity: 0,
    gravity: 0.65,
    rotation: 0,
    targetRotation: 0,
    grounded: true,
};

let map1Data = {
    obstacles: [],
    jumpBalls: [],
    jumpPads: [],
    finishLine: null
};

let map2Data = {
    obstacles: [],
    jumpBalls: [],
    jumpPads: [],
    finishLine: null
};

let map3Data = {
    obstacles: [],
    jumpBalls: [],
    jumpPads: [],
    portals: [],
    finishLine: null
};



map1Img.onload = () => {
    const map1Canvas = document.createElement('canvas');
    const map1Ctx = map1Canvas.getContext('2d');

    map1Canvas.width = map1Img.width;
    map1Canvas.height = map1Img.height;
    map1Ctx.drawImage(map1Img, 0, 0);

    map1Data.obstacles = [];
    map1Data.jumpBalls = [];
    map1Data.jumpPads = [];
    map1Data.finishLine = null;

    const { data, width, height } = 
    map1Ctx.getImageData(0, 0, map1Img.width, map1Img.height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const r = data[i],
                  g = data[i + 1],
                  b = data[i + 2];
            if (r === 255 && g === 0 && b === 0) {
                map1Data.obstacles.push({
                    x: x * tileSize,
                    y: y * tileSize,
                    width: tileSize,
                    height: tileSize,
                    color: 'black'
                });
            } else if (r === 0 && g === 255 && b === 0) {
                ctx.fillStyle = 'green';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

                if (!map1Data.finishLine) {
                    map1Data.finishLine = {
                        x: x * tileSize,
                        y: 0, 
                        width: tileSize,
                        height: canvas.height,
                        color: 'gold',
                        reached: false
                    };
                } else {
                    map1Data.finishLine.width = Math.max(map1Data.finishLine.width, (x * tileSize) - map1Data.finishLine.x + tileSize);
                }
            } else if (r === 0 && g === 0 && b === 255) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

                map1Data.jumpBalls.push({
                    x: x * tileSize + tileSize / 2,
                    y: y * tileSize + tileSize / 2,
                    radius: tileSize / 2,
                    color: 'yellow',
                    used: false,
                });
            }else if (r === 255 && g === 255 && b === 0) {
                    map1Data.portals = map1Data.portals || [];
                    map1Data.portals.push({
                    x: x * tileSize,
                    y: y * tileSize,
                    width: tileSize,
                    height: tileSize,
                    color: 'yellow',
                    type: 'fly', 
    });
}
        }
    }
    console.log(`Map 1 loaded! Created ${map1Data.obstacles.length} obstacles and ${map1Data.jumpBalls.length} double jump balls. Additionally created ${map1Data.jumpPads.length} jump pads.`);
};

map2Img.onload = () => {
    const map2Canvas = document.createElement('canvas');
    const map2Ctx = map2Canvas.getContext('2d');

    map2Canvas.width = map2Img.width;
    map2Canvas.height = map2Img.height;
    map2Ctx.drawImage(map2Img, 0, 0);

    map2Data.obstacles = [];
    map2Data.jumpBalls = [];
    map2Data.jumpPads = [];
    map2Data.finishLine = null;

    const { data, width, height } = 
    map2Ctx.getImageData(0, 0, map2Img.width, map2Img.height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const r = data[i],
                  g = data[i + 1],
                  b = data[i + 2];
            if (r === 255 && g === 0 && b === 0) {
                map2Data.obstacles.push({
                    x: x * tileSize,
                    y: y * tileSize,
                    width: tileSize,
                    height: tileSize,
                    color: 'black'
                });
            } else if (r === 0 && g === 255 && b === 0) {
                ctx.fillStyle = 'green';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

                if (!map2Data.finishLine) {
                    map2Data.finishLine = {
                        x: x * tileSize,
                        y: 0, 
                        width: tileSize,
                        height: canvas.height,
                        color: 'gold',
                        reached: false
                    };
                } else {
                    map2Data.finishLine.width = Math.max(map2Data.finishLine.width, (x * tileSize) - map2Data.finishLine.x + tileSize);
                }
            } else if (r === 0 && g === 0 && b === 255) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

                map2Data.jumpBalls.push({
                    x: x * tileSize + tileSize / 2,
                    y: y * tileSize + tileSize / 2,
                    radius: tileSize / 2,
                    color: 'yellow',
                    used: false,
                });
            } else if (r === 255 && g === 0 && b === 255) {
                map2Data.jumpPads.push({
                    x: x * tileSize,
                    y: (y + 1)  * tileSize - (tileSize / 4),
                    width: tileSize,
                    height: tileSize / 4,
                    color: 'orange',
                    cooldown: 0,
                });
            }else if (r === 255 && g === 255 && b === 0) {
                    map2Data.portals = map2Data.portals || [];
                    map2Data.portals.push({
                    x: x * tileSize,
                    y: y * tileSize,
                    width: tileSize,
                    height: tileSize,
                    color: 'yellow',
                    type: 'fly', 
    });
} 
        }
    }
    console.log(`Map 2 loaded! Created ${map2Data.obstacles.length} obstacles and ${map2Data.jumpBalls.length} double jump balls. Additionally created ${map2Data.jumpPads.length} jump pads.`);
};

map3Img.onload = () => {
    const map3Canvas = document.createElement('canvas');
    const map3Ctx = map3Canvas.getContext('2d');

    map3Canvas.width = map3Img.width;
    map3Canvas.height = map3Img.height;
    map3Ctx.drawImage(map3Img, 0, 0);

    map3Data.obstacles = [];
    map3Data.jumpBalls = [];
    map3Data.portals = [];
    map3Data.jumpPads = [];
    map3Data.finishLine = null;

    const { data, width, height } = 
    map3Ctx.getImageData(0, 0, map3Img.width, map3Img.height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const r = data[i],
                  g = data[i + 1],
                  b = data[i + 2];
            if (r === 255 && g === 0 && b === 0) {
                map3Data.obstacles.push({
                    x: x * tileSize,
                    y: y * tileSize,
                    width: tileSize,
                    height: tileSize,
                    color: 'black'
                });
            } else if (r === 0 && g === 255 && b === 0) {
                ctx.fillStyle = 'green';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

                if (!map3Data.finishLine) {
                    map3Data.finishLine = {
                        x: x * tileSize,
                        y: 0, 
                        width: tileSize,
                        height: canvas.height,
                        color: 'gold',
                        reached: false
                    };
                } else {
                    map3Data.finishLine.width = Math.max(map3Data.finishLine.width, (x * tileSize) - map3Data.finishLine.x + tileSize);
                }
            } else if (r === 0 && g === 0 && b === 255) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

                map3Data.jumpBalls.push({
                    x: x * tileSize + tileSize / 2,
                    y: y * tileSize + tileSize / 2,
                    radius: tileSize / 2,
                    color: 'yellow',
                    used: false,
                });
            } else if (r === 255 && g === 255 && b === 0) {
                    map3Data.portals = map3Data.portals || [];
                    map3Data.portals.push({
                    x: x * tileSize,
                    y: y * tileSize,
                    width: tileSize,
                    height: tileSize,
                    color: 'yellow',
                    type: 'fly',
    });
            } else if (r === 255 && g === 0 && b === 255) {
                map3Data.jumpPads.push({
                    x: x * tileSize,
                    y: (y + 1)  * tileSize - (tileSize / 4),
                    width: tileSize,
                    height: tileSize / 4,
                    color: 'orange',
                    cooldown: 0,
                });
        }
    }
}
    console.log(`Map 3 loaded! Created ${map3Data.obstacles.length} obstacles and ${map3Data.jumpBalls.length} double jump balls. Additionally created ${map3Data.jumpPads.length} jump pads. also ${map3Data.portals.length} portals`);
};

function saveProgress(){
    localStorage.setItem('unlockedMaps', JSON.stringify(unlockedMaps));
}

function progressBar(){
    if (!finishLine) return 0;
    const playerProgress = player.x + camera.x;
    const totalDistance = finishLine.x;

    let progress = playerProgress / totalDistance;
    progress = Math.min(Math.max(progress, 0), 1);

    return progress;
}

function checkPortals() {
    portals.forEach(portal => {
        let adjustedX = portal.x - camera.x;

        if (checkCollision(player.x, player.y, player.width, player.height,
                           adjustedX, portal.y, portal.width, portal.height)) {
            if (portal.type === 'fly' && mode !== 'ship') {
                mode = 'ship';
                player.velocity = 0;
                console.log("Entered fly mode!");
            }
        }
    });
}

function loadMapData(mapData) {
    boxobstacles = [...mapData.obstacles];
    doubleJumpBalls = mapData.jumpBalls.map(ball => ({...ball, used: false})); 
    portals = mapData.portals ? [...mapData.portals] : [];
    jumpPads = mapData.jumpPads.map(pad => ({...pad, cooldown: 0})); 
    finishLine = mapData.finishLine ? {...mapData.finishLine, reached: false} : null; 
}

function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        console.log('All images loaded successfully.');
    }
}
forest.onload = onImageLoad;
ocean.onload = onImageLoad;
desert.onload = onImageLoad;

forest.onerror = () => console.error('Failed to load forest image:', forest.src);

function resetGame() {
    mode = 'cube';
    player.x = 50;
    player.y = 900;
    player.velocity = 0;
    player.rotation = 0;
    player.targetRotation = 0;
    camera.x = 0;
    doubleJumpBalls.forEach(ball => {
        ball.used = false;
    });
    jumpPads.forEach(pad => {
        pad.cooldown = 0;
    });
    if (finishLine) {
        finishLine.reached = false;
    }
}

function checkFinishLine() {
    if (finishLine && !finishLine.reached) {
        let adjustedFinishX = finishLine.x - camera.x;
        

        if (checkCollision(player.x, player.y, player.width, player.height, 
            adjustedFinishX, finishLine.y, finishLine.width, finishLine.height)) {
            finishLine.reached = true;
            console.log("Level Complete!");

            if (gameState === 'map1' && !unlockedMaps.map2) {
                unlockedMaps.map2 = true;
                saveProgress();
            } else if (gameState === 'map2' && !unlockedMaps.map3) {
                unlockedMaps.map3 = true;
                saveProgress();
            }

            setTimeout(() => {
                gameState = 'choosemap'; 
                resetGame();
                finishLine.reached = false;
            }, 2000); 
        }
    }
}

function drawProgressBar() {
    if (!finishLine) return;
    const progress = progressBar();
    const barWidth = canvas.width * 0.8;
    const barHeight = 20;
    const x = (canvas.width - barWidth) / 2;
    const y = 30;

    ctx.fillStyle = 'grey';
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = 'rgb(0, 200, 0)';
    ctx.fillRect(x, y, barWidth * progress, barHeight);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);
}

function drawPortals() {
    portals.forEach(portal => {
        let adjustedX = portal.x - camera.x;
        ctx.save();
        ctx.fillStyle = portal.color;
        ctx.fillRect(adjustedX, portal.y, portal.width, portal.height);

        ctx.shadowColor = portal.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(adjustedX, portal.y, portal.width, portal.height);
        ctx.restore();
    });
}

function drawFinishLine() {
    if (finishLine) {
        let adjustedFinishX = finishLine.x - camera.x;
        
        if (adjustedFinishX > -finishLine.width && adjustedFinishX < canvas.width) {
            ctx.save();
            ctx.fillStyle = "green";
            ctx.fillRect(adjustedFinishX, finishLine.y, finishLine.width, finishLine.height);
            ctx.restore();
        }
    }
}

function doubleJump(){
    doubleJumpBalls.forEach(ball => {
        if (!ball.used) {
            let adjustedBallX = ball.x - camera.x;
            
            let playerCenterX = player.x + player.width / 2;
            let playerCenterY = player.y + player.height / 2;
            
            let distance = Math.sqrt(
                Math.pow(playerCenterX - adjustedBallX, 2) + 
                Math.pow(playerCenterY - ball.y, 2)
            );
            
            if (distance < ball.radius + player.width / 2 &&
                (input.getKeyDown(Keys.Space) || input.getKeyDown(Keys.Enter))) {
                player.velocity = -15; 
                player.targetRotation += 90; 
                player.grounded = false;
                ball.used = true; 
                
                console.log("Double jump activated!");
            }
        }
    })
}
function drawJumpBalls() {
    doubleJumpBalls.forEach(ball => {
        if (!ball.used) {
            let adjustedBallX = ball.x - camera.x;
            
            if (adjustedBallX > -ball.radius && adjustedBallX < canvas.width + ball.radius) {
                ctx.save();
                ctx.shadowColor = ball.color;
                ctx.shadowBlur = 10;
                
                ctx.beginPath();
                ctx.arc(adjustedBallX, ball.y, ball.radius, 0, 2 * Math.PI);
                ctx.fillStyle = ball.color;
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(adjustedBallX - ball.radius/3, ball.y - ball.radius/3, ball.radius/3, 0, 2 * Math.PI);
                ctx.fillStyle = 'white';
                ctx.globalAlpha = 0.6;
                ctx.fill();
                ctx.restore();
            }
        }
    });
}
function jumpPad() {
    jumpPads.forEach(pad => {
        if (pad.cooldown > 0) {
            pad.cooldown--;
        }
        
        let adjustedPadX = pad.x - camera.x;
        
         
            
if (checkCollision(player.x, player.y, player.width, player.height, 
                    adjustedPadX, pad.y, pad.width, pad.height)) {
            
            if (pad.cooldown === 0) {
                player.velocity = -20;
                player.targetRotation += 90;
                player.grounded = false;
                pad.cooldown = 30;
                console.log("Jump pad activated!");
            }
        }
    });
}


function drawJumpPads() {
    jumpPads.forEach(pad => {
        let adjustedPadX = pad.x - camera.x;
        
        if (adjustedPadX > -pad.width && adjustedPadX < canvas.width + pad.width) {
            ctx.fillStyle = pad.color;
            ctx.fillRect(adjustedPadX, pad.y, pad.width, pad.height);
        }
    });
}

function debugPlayerMovement() {
    if (!debugMovement || gamestate2 !== 'playing') return;
    camera.x = 0;
    const moveSpeed = 5;
    
    if (input.getKey(Keys.A) || input.getKey(Keys.ArrowLeft)) {
        player.x -= moveSpeed;
    }
    if (input.getKey(Keys.D) || input.getKey(Keys.ArrowRight)) {
        player.x += moveSpeed;
    }
    
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    console.log(`Player Position: (${player.x.toFixed(2)}, ${player.y.toFixed(2)})`);
}

function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && 
           x1 + w1 > x2 && 
           y1 < y2 + h2 && 
           y1 + h1 > y2;
}

function updateCamera() {
    if (gamestate2 === 'playing') {
        camera.x += camera.speed; 
    }
}

function drawMenu() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.fillText('GEOMETRY DASH', canvas.width / 2 - 150, 150);
    
    ctx.font = '24px Arial';
    ctx.fillText('Press SPACE or ENTER to Start', canvas.width / 2 - 140, 300);
    ctx.fillText('SPACE to Jump', canvas.width / 2 - 70, 350);
}
function drawPlayer(){
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    if (mode === 'cube') {
        ctx.rotate(player.rotation * Math.PI / 180);
    }
    ctx.fillStyle = player.color;
    ctx.fillRect(-player.width/2, -player.height/2, player.width, player.height);
    ctx.restore();
}
function updatePlayer(){
    
if (mode === 'cube') {
    player.velocity += player.gravity;
    player.y += player.velocity;
} 
else if (mode === 'ship') {

    const flyForce = 0.5; 
    const gravity = 0.4;  

    if (input.getKey(Keys.Space) || input.getKey(Keys.ArrowUp)) {
        player.velocity -= flyForce;
    } else {
        player.velocity += gravity;
    }

    player.velocity = Math.max(-10, Math.min(10, player.velocity));

    player.y += player.velocity;
    player.rotation = player.velocity * 2;
}

    if (player.rotation !== player.targetRotation) {
        let rotationDiff = player.targetRotation - player.rotation;
        player.rotation += rotationDiff * 0.15;

        if (Math.abs(rotationDiff) < 1) {
            player.rotation = player.targetRotation;
        }
    }

        doubleJump();
        jumpPad();
        checkPortals();
        checkFinishLine();
    if (mode === 'cube') {
    boxobstacles.filter(box => box.color !=='orange').forEach(box => {
        let adjustedBoxX = box.x - camera.x;
        
        if (checkCollision(player.x, player.y, player.width, player.height, 
                          adjustedBoxX, box.y, box.width, box.height)) {
            

            let overlapLeft = (player.x + player.width) - adjustedBoxX;
            let overlapRight = (adjustedBoxX + box.width) - player.x;
            let overlapTop = (player.y + player.height) - box.y;
            let overlapBottom = (box.y + box.height) - player.y;
            let minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
            
            if (minOverlap === overlapTop && player.velocity > 0) {
                player.y = box.y - player.height;
                player.velocity = 0;
                player.grounded = true;
            } else if (minOverlap === overlapBottom && player.velocity < 0) {
                player.y = box.y + box.height;
                player.velocity = 0;
            } else if (minOverlap === overlapLeft && Math.abs(player.velocity) < 5) {
                gameState = 'menu'; 
                resetGame();
            }  else if (player.velocity > 0 && overlapTop < overlapLeft && overlapTop < overlapRight) {

                player.y = box.y - player.height;
                player.velocity = 0;
                player.grounded = true;
            } else if (player.velocity < 0 && overlapBottom < overlapLeft && overlapBottom < overlapRight) {
                player.y = box.y + box.height;
                player.velocity = 0;
            }
        }
    });
};
if (mode === 'ship') {
    const floorY = canvas.height - player.height;

    if (player.y > floorY) {
        player.y = floorY;
        player.velocity = Math.min(0, player.velocity); 
    }
    if (player.y < 0) {
        player.y = 0;
        player.velocity = Math.max(0, player.velocity);
    }

  boxobstacles.forEach(box => {
    const bx = box.x - camera.x;
    if (!checkCollision(player.x, player.y, player.width, player.height, bx, box.y, box.width, box.height)) return;

    const overlapLeft   = (player.x + player.width) - bx;
    const overlapRight  = (bx + box.width) - player.x;
    const overlapTop    = (player.y + player.height) - box.y;
    const overlapBottom = (box.y + box.height) - player.y;
    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    if (minOverlap === overlapLeft) {
      console.log("Ship crashed into front - death");
      gameState = 'menu';
      resetGame();
    } else if (minOverlap === overlapTop) {
        player.y = box.y - player.height;
        player.velocity = Math.min(0, player.velocity);
    } else if (minOverlap === overlapBottom) {
        player.y = box.y + box.height;
        player.velocity = Math.max(0, player.velocity);
    }
});
}

if (mode === 'cube') {
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.velocity = 0;
        player.grounded = true;
    } else if (!player.grounded) {
        let standingOnObstacle = false;
        boxobstacles.forEach(box => {
            let adjustedBoxX = box.x - camera.x;
            if (player.x < adjustedBoxX + box.width && 
                player.x + player.width > adjustedBoxX && 
                Math.abs((player.y + player.height) - box.y) < 5) {
                standingOnObstacle = true;
            }
        });
        jumpPads.forEach(pad => {
            let adjustedPadX = pad.x - camera.x;
            if (player.x < adjustedPadX + pad.width && 
                player.x + player.width > adjustedPadX && 
                Math.abs((player.y + player.height) - pad.y) < 5) {
                standingOnObstacle = true;
            }
        });
        if (!standingOnObstacle) {
            player.grounded = false;
        }
    }
}
    
    if (player.y < 0) {
        player.y = 0;
        player.velocity = 0;
    }

    if (gamestate2 == 'playing' ){
        if ((input.getKey(Keys.Space) || input.getKey(Keys.ArrowUp)) && player.grounded && mode === 'cube') {
            player.velocity = -10;
            player.targetRotation += 90;
            player.grounded = false;
        }
    }
}

function chooseMapUI(){
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Choose Your Map', canvas.width / 2, 100);
    
    const boxWidth = 200;
    const boxHeight = 150;
    const spacing = 50;
    const startX = (canvas.width - (3 * boxWidth + 2 * spacing)) / 2;
    const boxY = 200;
    
    const mapColors = ['lightgreen','lightblue', '#e29d48ff']; 
    const mapNames = ['Forest World', 'Ocean World', 'Desert World'];
    const mapImg = [forest, ocean, desert];
    
    for(let i = 0; i < 3; i++){
        const boxX = startX + i * (boxWidth + spacing);

        ctx.fillStyle = mapColors[i];
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        if (mapImg[i].complete && mapImg[i].naturalWidth > 0) {
            ctx.drawImage(mapImg[i], boxX, boxY, boxWidth, boxHeight);
        }

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        ctx.fillStyle = '#000';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(`${i + 1}`, boxX + boxWidth / 2, boxY + 30);

        if(!unlockedMaps[`map${i + 1}`]){
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
            ctx.fillStyle = '#fff';
            ctx.font = '24px Arial';
            ctx.fillText('Locked', boxX + boxWidth / 2, boxY + boxHeight / 2);
            continue;
        }

        ctx.fillStyle = '#fff';
        ctx.font = '18px Arial';
        ctx.fillText(mapNames[i], boxX + boxWidth / 2, boxY + boxHeight + 30);
    }
    ctx.textAlign = 'start';
};

function update(){
    if(gameState === 'menu'){
        if(input.getKeyDown(Keys.Space) || input.getKeyDown(Keys.Enter)) {
            gameState = 'choosemap';
        }
    }
    else if(gameState === 'choosemap'){
        if(input.getKeyDown(Keys.Digit1) && unlockedMaps.map1) {
            gameState = 'map1';
            loadMapData(map1Data);
            resetGame();
        }
        else if(input.getKeyDown(Keys.Digit2) && unlockedMaps.map2) {
            gameState = 'map2';
            loadMapData(map2Data);
            resetGame();
            console.log('key 2 pressed');
        }
        else if(input.getKeyDown(Keys.Digit3) && unlockedMaps.map3) {
            gameState = 'map3';
            loadMapData(map3Data);
            resetGame();
            console.log('key 3 pressed');
        }
    }
}

function map1(){
    if (forest.complete && forest.naturalWidth > 0) {
        ctx.drawImage(forest, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

boxobstacles.forEach(box => {
        ctx.fillStyle = box.color;
        ctx.fillRect(box.x - camera.x, box.y, box.width, box.height);
    });

    drawJumpBalls();
    drawJumpPads();
    drawFinishLine();
    drawPortals();
}

function map2(){
    if (ocean.complete && ocean.naturalWidth > 0){
        ctx.drawImage(ocean, 0, 0, canvas.width, canvas.height);
    } else {
 ctx.fillStyle = 'lightgreen';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    boxobstacles.forEach(box => {
        ctx.fillStyle = box.color;
        ctx.fillRect(box.x - camera.x, box.y, box.width, box.height);
    });

    drawJumpBalls();
    drawJumpPads();
    drawFinishLine();
    drawPortals();

}
function map3(){
    if (desert.complete && desert.naturalWidth > 0){
        ctx.drawImage(desert, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = 'lightyellow';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    boxobstacles.forEach(box => {
        ctx.fillStyle = box.color;
        ctx.fillRect(box.x - camera.x, box.y, box.width, box.height);
    });

    drawJumpBalls();
    drawJumpPads();
    drawFinishLine();
    drawPortals();

}

function gameloop(){
    input.update();
    if(gameState === 'menu'){
        drawMenu();
        update();
        gamestate2 = 'menu';
    } else if(gameState === 'choosemap'){
        chooseMapUI();
        update();
    } else if (gameState === 'map1'){
        updateCamera();
        updatePlayer();
        debugPlayerMovement();
        map1();
        drawPlayer();
        drawProgressBar();
        gamestate2 = 'playing';
    } else if (gameState === 'map2'){
        updateCamera();
        updatePlayer();
        debugPlayerMovement();
        map2();
        drawPlayer();
        drawProgressBar();
        gamestate2 = 'playing';
    } else if (gameState === 'map3'){
        updateCamera();
        updatePlayer();
        debugPlayerMovement();
        map3();
        drawPlayer();
        drawProgressBar();
        gamestate2 = 'playing';
    }

    requestAnimationFrame(gameloop);
}

gameloop();
