export default class Player {
  WALK_ANIMATION_TIMER = 200;
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;
  customCharacterImages = []; // Array to hold custom character images

  jumpPressed = false;
  jumpInProgress = false;
  falling = false;
  JUMP_SPEED = 0.6;
  GRAVITY = 0.4;

  constructor(
    ctx,
    width,
    height,
    minJumpHeight,
    maxJumpHeight,
    scaleRatio,
    characterDesign
  ) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.minJumpHeight = minJumpHeight;
    this.maxJumpHeight = maxJumpHeight;
    this.scaleRatio = scaleRatio;

    this.x = 10 * scaleRatio;
    this.y = this.canvas.height - this.height - 1.5 * scaleRatio;
    this.yStandingPosition = this.y;

    // Load custom character
    this.loadCustomCharacter(characterDesign);

    // Keyboard event listeners
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);

    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);

    // Touch event listeners
    window.removeEventListener("touchstart", this.touchstart);
    window.removeEventListener("touchend", this.touchend);

    window.addEventListener("touchstart", this.touchstart);
    window.addEventListener("touchend", this.touchend);
  }

  // Load custom character from the provided design
  loadCustomCharacter(design) {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    const cellSize = 6.25; // 16x16 grid (100 / 16 = 6.25)

    // Draw the custom character based on the design
    for (let i = 0; i < 256; i++) {
      if (design[i]) {
        const x = (i % 16) * cellSize;
        const y = Math.floor(i / 16) * cellSize;
        ctx.fillStyle = design[i]; // Use the color from the design
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }

    // Create an image from the canvas
    const customCharacterImage = new Image();
    customCharacterImage.src = canvas.toDataURL();

    // Wait for the image to load before using it
    customCharacterImage.onload = () => {
      this.customCharacterImages = [customCharacterImage]; // Only one image for simplicity
      this.image = this.customCharacterImages[0]; // Set the initial image
    };
  }

  // Touch event handlers
  touchstart = () => {
    this.jumpPressed = true;
  };

  touchend = () => {
    this.jumpPressed = false;
  };

  // Keyboard event handlers
  keydown = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = true;
    }
  };

  keyup = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = false;
    }
  };

  // Update the player's state
  update(gameSpeed, frameTimeDelta) {
    this.run(gameSpeed, frameTimeDelta);

    if (this.jumpInProgress) {
      this.image = this.customCharacterImages[0]; // Use the custom character image
    }

    this.jump(frameTimeDelta);
  }

  // Handle jumping logic
  jump(frameTimeDelta) {
    if (this.jumpPressed) {
      this.jumpInProgress = true;
    }

    if (this.jumpInProgress && !this.falling) {
      if (
        this.y > this.canvas.height - this.minJumpHeight ||
        (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)
      ) {
        this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
      } else {
        this.falling = true;
      }
    } else {
      if (this.y < this.yStandingPosition) {
        this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
        if (this.y + this.height > this.canvas.height) {
          this.y = this.yStandingPosition;
        }
      } else {
        this.falling = false;
        this.jumpInProgress = false;
      }
    }
  }

  // Handle running animation
  run(gameSpeed, frameTimeDelta) {
    if (this.walkAnimationTimer <= 0) {
      // Switch between custom character images for animation (if multiple images are available)
      if (this.customCharacterImages.length > 1) {
        this.image =
          this.customCharacterImages[
            this.image === this.customCharacterImages[0] ? 1 : 0
          ];
      }
      this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    }
    this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
  }

  // Draw the player on the canvas
  draw() {
    if (this.image && this.image.complete) {
      this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}
