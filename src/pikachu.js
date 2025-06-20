const pikachu = document.getElementById("pikachu");
const cursorRadius = 75;
const speed = 1.5;
const frameDelay = 40;
const movementStartDelay = 15;
const mouseMovementDelay = 15;

const sprites = {
    left: {
        move: "image-folder/left-move.png",
        stand: "image-folder/left-stand.png"
    },
    right: {
        move: "image-folder/right-move.png",
        stand: "image-folder/right-stand.png"
    },
    up: {
        move: ["image-folder/back-move-1.png", "image-folder/back-move-2.png"],
        stand: "image-folder/back-stand.png"
    },
    down: {
        move: ["image-folder/front-move-1.png", "image-folder/front-move-2.png"],
        stand: "image-folder/front-stand.png"
    }
};

function preloadImages() {
    const allImages = [];

    for (const direction in sprites) {
        const sprite = sprites[direction];
        if (Array.isArray(sprite.move)) {
            allImages.push(...sprite.move);
        } else {
            allImages.push(sprite.move);
        }
        allImages.push(sprite.stand);
    }

    let loaded = 0;
    return new Promise((resolve) => {
        allImages.forEach(src => {
            const img = new Image();
            img.onload = img.onerror = () => {
                loaded++;
                if (loaded === allImages.length) resolve();
            };
            img.src = src;
        });
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
pikachu.style.transform = `translate(${pikachuX}px, ${pikachuY}px)`;
pikachu.style.imageRendering = "pixelated";
pikachu.style.width = "40px";
pikachu.style.height = "40px";
pikachu.style.zIndex = "1000";
pikachu.style.pointerEvents = "none";
pikachu.style.willChange = "transform";

document.addEventListener("mousemove", (event) => {
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    mouseStableCounter = 0;
});

function movePikachu() {
    mouseStableCounter++;
    if (mouseStableCounter >= mouseMovementDelay) {
        targetX = lastMouseX;
        targetY = lastMouseY;
    }

    const dx = targetX - pikachuX;
    const dy = targetY - pikachuY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > cursorRadius) {
        const angle = Math.atan2(dy, dx);
        const moveX = Math.cos(angle) * speed;
        const moveY = Math.sin(angle) * speed;

        pikachuX += moveX;
        pikachuY += moveY;
        pikachu.style.transform = `translate(${pikachuX}px, ${pikachuY}px)`;

        currentDirection = Math.abs(dx) > Math.abs(dy)
            ? (dx < 0 ? "left" : "right")
            : (dy < 0 ? "up" : "down");

        if (!isMoving) {
            isMoving = true;
            movementDelayCounter = 0;
        }

        if (movementDelayCounter++ >= movementStartDelay) {
            frameToggle = (frameToggle + 1) % frameDelay;
        }
    } else {
        isMoving = false;
        movementDelayCounter = 0;
    }

    const spriteSet = sprites[currentDirection];
    let newSrc;

    if (isMoving) {
        if (currentDirection === "left" || currentDirection === "right") {
            newSrc = frameToggle < frameDelay / 2 ? spriteSet.move : spriteSet.stand;
        } else {
            const frameIndex = Math.floor(frameToggle / (frameDelay / 2));
            newSrc = spriteSet.move[frameIndex % spriteSet.move.length];
        }
    } else {
        newSrc = spriteSet.stand;
    }

    if (pikachu.src !== newSrc) {
        pikachu.src = newSrc;
    }

    requestAnimationFrame(movePikachu);
}

preloadImages().then(() => {
    movePikachu();
}).catch(error => {
    console.error("Image preload error:", error);
});
