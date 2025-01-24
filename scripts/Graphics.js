export default class Graphics {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.imageData = ctx.createImageData(width, height);
    this.pixels = this.imageData.data;
  }

  setPixel(x, y, color) {
    const rgba = this.getRGBA(color);
    const pixelIndex = (y * this.width + x) * 4;

    this.pixels[pixelIndex] = rgba[0];
    this.pixels[pixelIndex + 1] = rgba[1];
    this.pixels[pixelIndex + 2] = rgba[2];
    this.pixels[pixelIndex + 3] = rgba[3];
  }

  getPixel(x, y) {
    const pixelIndex = (y * this.width + x) * 4;
    return [
      this.pixels[pixelIndex],
      this.pixels[pixelIndex + 1],
      this.pixels[pixelIndex + 2],
      this.pixels[pixelIndex + 3],
    ];
  }

  drawLine(x0, y0, x1, y1, color) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      this.setPixel(x0, y0, color);

      if (x0 === x1 && y0 === y1) break;

      const e2 = 2 * err;

      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }

      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  floodFill(x, y, fillColor, borderColor) {
    const stack = [{ x, y }];
    const targetColor = this.getPixel(x, y);

    if (
      this.colorsEqual(targetColor, this.getRGBA(fillColor)) ||
      this.colorsEqual(targetColor, this.getRGBA(borderColor))
    ) {
      return;
    }

    while (stack.length > 0) {
      const { x: currentX, y: currentY } = stack.pop();

      if (
        currentX < 0 ||
        currentX >= this.width ||
        currentY < 0 ||
        currentY >= this.height ||
        !this.colorsEqual(this.getPixel(currentX, currentY), targetColor)
      ) {
        continue;
      }

      this.setPixel(currentX, currentY, fillColor);

      stack.push({ x: currentX + 1, y: currentY });
      stack.push({ x: currentX - 1, y: currentY });
      stack.push({ x: currentX, y: currentY + 1 });
      stack.push({ x: currentX, y: currentY - 1 });
    }
  }

  colorsEqual(color1, color2) {
    return (
      color1[0] === color2[0] &&
      color1[1] === color2[1] &&
      color1[2] === color2[2] &&
      color1[3] === color2[3]
    );
  }

  getRGBA(color) {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b, 255];
  }

  render() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}
