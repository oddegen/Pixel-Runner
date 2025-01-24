import Obstacle from "./Obstacle.js";

export default class Controller {
  INTERVAL_MIN = 500;
  INTERVAL_MAX = 2000;

  nextInterval = null;
  values = [];

  constructor(ctx, images, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.images = images;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextTime();
  }

  setNextTime() {
    const num = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);

    this.nextInterval = num;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  create() {
    const index = this.getRandomNumber(0, this.images.length - 1);
    const image = this.images[index];
    const x = this.canvas.width * 1.5;
    const y = this.canvas.height - image.height;
    const obstacle = new Obstacle(
      this.ctx,
      x,
      y,
      image.width,
      image.height,
      image.image
    );

    this.values.push(obstacle);
  }

  update(gameSpeed, frameTimeDelta) {
    if (this.nextInterval <= 0) {
      this.create();
      this.setNextTime();
    }
    this.nextInterval -= frameTimeDelta;

    this.values.forEach((obstacle) => {
      obstacle.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });

    this.values = this.values.filter(
      (obstacle) => obstacle.x > -obstacle.width
    );
  }

  draw() {
    this.values.forEach((obstacle) => obstacle.draw());
  }

  collideWith(sprite) {
    return this.values.some((obstacle) => obstacle.collideWith(sprite));
  }

  reset() {
    this.values = [];
  }
}
