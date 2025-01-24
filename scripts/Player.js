import Graphics from "./Graphics.js";

export default class Player {
  WALK_ANIMATION_TIMER = 200;
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;
  customCharacterImages = [];

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

    this.loadCustomCharacter(characterDesign);

    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);

    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
  }

  loadCustomCharacter(design) {
    const canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext("2d");
    const cellSize = 4;

    const graphics = new Graphics(ctx, canvas.width, canvas.height);

    for (let i = 0; i < 900; i++) {
      if (design[i]) {
        const x = (i % 30) * cellSize;
        const y = Math.floor(i / 30) * cellSize;

        graphics.drawLine(x, y, x + cellSize, y, design[i]); // Top line
        graphics.drawLine(
          x + cellSize,
          y,
          x + cellSize,
          y + cellSize,
          design[i]
        ); // Right line
        graphics.drawLine(
          x + cellSize,
          y + cellSize,
          x,
          y + cellSize,
          design[i]
        ); // Bottom line
        graphics.drawLine(x, y + cellSize, x, y, design[i]); // Left line

        graphics.floodFill(x + 1, y + 1, design[i], "#000000");
      }
    }

    graphics.render();

    const customCharacterImage = new Image();
    customCharacterImage.src = canvas.toDataURL();

    customCharacterImage.onload = () => {
      this.customCharacterImages = [customCharacterImage];
      this.image = this.customCharacterImages[0];
    };
  }

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

  update(gameSpeed, frameTimeDelta) {
    this.run(gameSpeed, frameTimeDelta);

    if (this.jumpInProgress) {
      this.image = this.customCharacterImages[0];
    }

    this.jump(frameTimeDelta);
  }

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

  run(gameSpeed, frameTimeDelta) {
    if (this.walkAnimationTimer <= 0) {
      this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    }
    this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
  }

  draw() {
    if (this.image && this.image.complete) {
      this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}
