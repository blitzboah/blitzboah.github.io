const pikachu = document.getElementById("pikachu");
const cursorRadius = 75;
const speed = 1; // Movement speed
const frameDelay = 40; // Increased delay for slower animation
const movementStartDelay = 15; // Delay before animation starts
const mouseMovementDelay = 15; // Delay before following new mouse position

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

let targetX = 100;
let targetY = 100;
let lastMouseX = 100;
let lastMouseY = 100;
let mouseStableCounter = 0;
let frameToggle = 0;
let currentDirection = "down";
let isMoving = false;
let movementDelayCounter = 0;

// Initialize position and ensure Pikachu is on top
pikachu.style.position = "fixed"; // Use fixed positioning to stay on top
pikachu.style.left = pikachu.style.left || "10px";
pikachu.style.top = pikachu.style.top || "10px";
pikachu.style.imageRendering = "pixelated";
pikachu.style.width = "35px";
pikachu.style.height = "35px";
pikachu.style.zIndex = "9999"; // High z-index to ensure it's on top
pikachu.style.pointerEvents = "none"; // Allow clicks to pass through Pikachu

document.addEventListener("mousemove", (event) => {
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    mouseStableCounter = 0; // Reset counter on mouse movement
});

function movePikachu() {
    // Update target position with delay
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

        // Animation logic
        if (!isMoving) {
            isMoving = true;
            movementDelayCounter = 0;
        }

        // Slow down the sprite toggle
        if (movementDelayCounter++ >= movementStartDelay) {
            frameToggle = (frameToggle + 1) % frameDelay;
        }
    } else {
        isMoving = false;
        movementDelayCounter = 0;
    }

    // Update sprite
    const spriteSet = sprites[currentDirection];
    if (isMoving) {
        if (currentDirection === "left" || currentDirection === "right") {
            // Toggle between move and stand sprites for horizontal directions
            pikachu.src = frameToggle < frameDelay / 2 ? spriteSet.move : spriteSet.stand;
        } else {
            // Use array-based sprites for vertical directions
            const frameIndex = Math.floor(frameToggle / (frameDelay / 2));
            pikachu.src = spriteSet.move[frameIndex % spriteSet.move.length];
        }
    } else {
        pikachu.src = spriteSet.stand;
    }

    requestAnimationFrame(movePikachu);
}

movePikachu();