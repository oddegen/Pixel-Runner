import Graphics from "./Graphics.js";

const grid = document.getElementById("grid");
const preview = document.getElementById("preview");
const colorPicker = document.getElementById("colorPicker");
const clearButton = document.getElementById("clearButton");
const playButton = document.getElementById("playButton");

let characterDesign = Array(900).fill(null);
let selectedColor = "#000000";
let isMouseDown = false;

const colors = [
  "#000000",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFFFFF",
];

colors.forEach((color) => {
  const colorOption = document.createElement("div");
  colorOption.classList.add("color-option");
  colorOption.style.backgroundColor = color;
  colorOption.addEventListener("click", () => {
    selectedColor = color;
  });
  colorPicker.appendChild(colorOption);
});

for (let i = 0; i < 900; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");

  cell.addEventListener("mousedown", () => {
    isMouseDown = true;
    cell.style.backgroundColor = selectedColor;
    characterDesign[i] = selectedColor;
    updatePreview();
  });

  cell.addEventListener("mouseover", () => {
    if (isMouseDown) {
      cell.style.backgroundColor = selectedColor;
      characterDesign[i] = selectedColor;
      updatePreview();
    }
  });

  grid.appendChild(cell);
}

document.addEventListener("mouseup", () => {
  isMouseDown = false;
});

function updatePreview() {
  preview.innerHTML = "";
  const canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");

  const graphics = new Graphics(ctx, canvas.width, canvas.height);

  for (let i = 0; i < 900; i++) {
    if (characterDesign[i]) {
      const x = (i % 30) * 10;
      const y = Math.floor(i / 30) * 10;

      graphics.drawLine(x, y, x + 10, y, characterDesign[i]);
      graphics.drawLine(x + 10, y, x + 10, y + 10, characterDesign[i]);
      graphics.drawLine(x + 10, y + 10, x, y + 10, characterDesign[i]);
      graphics.drawLine(x, y + 10, x, y, characterDesign[i]);

      graphics.floodFill(x + 1, y + 1, characterDesign[i], "#000000");
    }
  }

  graphics.render();
  preview.appendChild(canvas);
}

clearButton.addEventListener("click", () => {
  characterDesign = Array(900).fill(null);
  grid.querySelectorAll(".cell").forEach((cell) => {
    cell.style.backgroundColor = "";
  });
  updatePreview();
});

playButton.addEventListener("click", () => {
  localStorage.setItem("characterDesign", JSON.stringify(characterDesign));
  window.location.href = "play.html";
});

updatePreview();
