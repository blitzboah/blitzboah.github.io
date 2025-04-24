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
        if (typeof sprites[direction].move === 'string') {
            allImages.push(sprites[direction].move);
        } else if (Array.isArray(sprites[direction].move)) {
            allImages.push(...sprites[direction].move);
        }
        allImages.push(sprites[direction].stand);
    }
    
    let loadedCount = 0;
    const totalImages = allImages.length;
    
    return new Promise((resolve) => {
        allImages.forEach(src => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    resolve();
                }
            };
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    resolve();
                }
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

pikachu.style.position = "fixed";
pikachu.style.left = pikachu.style.left || "10px";
pikachu.style.top = pikachu.style.top || "10px";
pikachu.style.imageRendering = "pixelated";
pikachu.style.width = "40px";
pikachu.style.height = "40px";
pikachu.style.zIndex = "1000";
pikachu.style.pointerEvents = "none";

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

    const pikachuX = parseFloat(pikachu.style.left);
    const pikachuY = parseFloat(pikachu.style.top);
    const dx = targetX - pikachuX;
    const dy = targetY - pikachuY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > cursorRadius) {
        // Normalize movement vector
        const angle = Math.atan2(dy, dx);
        const moveX = Math.cos(angle) * speed;
        const moveY = Math.sin(angle) * speed;

        // Update position
        pikachu.style.left = `${pikachuX + moveX}px`;
        pikachu.style.top = `${pikachuY + moveY}px`;

        // Determine direction
        if (Math.abs(dx) > Math.abs(dy)) {
            currentDirection = dx < 0 ? "left" : "right";
        } else {
            currentDirection = dy < 0 ? "up" : "down";
        }

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
    if (isMoving) {
        if (currentDirection === "left" || currentDirection === "right") {
            pikachu.src = frameToggle < frameDelay / 2 ? spriteSet.move : spriteSet.stand;
        } else {
            const frameIndex = Math.floor(frameToggle / (frameDelay / 2));
            pikachu.src = spriteSet.move[frameIndex % spriteSet.move.length];
        }
    } else {
        pikachu.src = spriteSet.stand;
    }

    requestAnimationFrame(movePikachu);
}
preloadImages().then(() => {
    movePikachu();
}).catch(error => {
    console.error("Error in preloading:", error);
});
