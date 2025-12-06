const pikachu = document.getElementById("pikachu");
const cursorRadius = 75;
const cursorRadiusSq = cursorRadius * cursorRadius;
const speed = 1.5;
const frameDelay = 40;
const movementStartDelay = 15;
const mouseMovementDelay = 15;

const spritePositions = {
  "front-move-2": { x: 0, y: 0 },
  "right-stand": { x: -45, y: 0 },
  "back-move-2": { x: -90, y: 0 },
  "back-stand": { x: -135, y: 0 },
  "left-move": { x: 0, y: -42 },
  "front-stand": { x: -45, y: -42 },
  "front-move-1": { x: -90, y: -42 },
  "right-move": { x: -135, y: -42 },
  "left-stand": { x: 0, y: -84 },
  "back-move-1": { x: -45, y: -84 }
};

const sprites = {
    left: {
        move: "left-move",
        stand: "left-stand"
    },
    right: {
        move: "right-move",
        stand: "right-stand"
    },
    up: {
        move: ["back-move-1", "back-move-2"],
        stand: "back-stand"
    },
    down: {
        move: ["front-move-1", "front-move-2"],
        stand: "front-stand"
    }
};

function preloadSpritesheet() {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => resolve();
        img.src = "../static/spritesheet.png";
    });
}

let targetX = 100;
let targetY = 100;
let lastMouseX = 100;
let lastMouseY = 100;
let mouseStableCounter = 0;
let frameToggle = 0;
let currentDirection = "down";
let isMoving = false;
let movementDelayCounter = 0;
let pikachuX = 10;
let pikachuY = 10;
let lastSrc = "";

pikachu.style.position = "fixed";
pikachu.style.backgroundImage = "url(../static/spritesheet.png)";
pikachu.style.backgroundPosition = "0px 0px";
pikachu.style.width = "45px";
pikachu.style.height = "42px";
pikachu.style.zIndex = "1000";
pikachu.style.pointerEvents = "none";
pikachu.style.willChange = "transform";
pikachu.style.imageRendering = "pixelated";

document.addEventListener("mousemove", (event) => {
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    mouseStableCounter = 0;
});

function setSpriteFrame(frameName) {
    if (frameName === lastSrc) return;
    lastSrc = frameName;
    const pos = spritePositions[frameName];
    pikachu.style.backgroundPosition = `${pos.x}px ${pos.y}px`;
}

function movePikachu() {
    mouseStableCounter++;
    if (mouseStableCounter >= mouseMovementDelay) {
        targetX = lastMouseX;
        targetY = lastMouseY;
    }

    const dx = targetX - pikachuX;
    const dy = targetY - pikachuY;
    const distanceSq = dx * dx + dy * dy;

    if (distanceSq > cursorRadiusSq) {
        const len = Math.sqrt(distanceSq);
        pikachuX += (dx / len) * speed;
        pikachuY += (dy / len) * speed;
        pikachu.style.transform = `translate3d(${Math.round(pikachuX)}px, ${Math.round(pikachuY)}px, 0)`;

        if (Math.abs(dx) > Math.abs(dy)) {
            currentDirection = dx < 0 ? "left" : "right";
        } else {
            currentDirection = dy < 0 ? "up" : "down";
        }

        if (!isMoving) {
            isMoving = true;
            movementDelayCounter = 0;
        } else if (movementDelayCounter < movementStartDelay) {
            movementDelayCounter++;
        } else {
            frameToggle = (frameToggle + 1) % frameDelay;
        }
    } else {
        isMoving = false;
        movementDelayCounter = 0;
    }

    const spriteSet = sprites[currentDirection];
    let newSrc;

    if (isMoving && movementDelayCounter >= movementStartDelay) {
        if (currentDirection === "left" || currentDirection === "right") {
            newSrc = frameToggle < frameDelay / 2 ? spriteSet.move : spriteSet.stand;
        } else {
            const frameIndex = Math.floor(frameToggle / (frameDelay / 2));
            newSrc = spriteSet.move[frameIndex % spriteSet.move.length];
        }
    } else {
        newSrc = spriteSet.stand;
    }

    setSpriteFrame(newSrc);
    requestAnimationFrame(movePikachu);
}

preloadSpritesheet().then(() => {
    movePikachu();
}).catch(error => {
    console.error("spritesheet preload error:", error);
});
