const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const container = document.getElementById("container");

let isDrawing = false;
let lastX = 0;
let lastY = 0;

let currentColor = "#000000";
let currentSize = 5;
let currentTool = "pencil";

let undoStack = [];
let redoStack = [];

canvas.width = container.clientWidth;
canvas.height = container.clientHeight;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    return { mouseX, mouseY };
}

canvas.addEventListener("mousedown", function (e) {
  isDrawing = true;
  let pos = getMousePos(e);
  lastX = pos.mouseX;
  lastY = pos.mouseY;
});

canvas.addEventListener("mousemove", function (event) {
  if (isDrawing === false) {
    return;
  }
  let pos = getMousePos(event);

  ctx.lineWidth = currentSize;
  ctx.lineCap = "round";

  if (currentTool === "pencil") {
        ctx.globalCompositeOperation = "source-over"; 
        ctx.strokeStyle = currentColor;
    } else if (currentTool === "eraser") {
        ctx.globalCompositeOperation = "destination-out"; 
    }

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(pos.mouseX, pos.mouseY);
  ctx.stroke();

  lastX = pos.mouseX;
  lastY = pos.mouseY;
});

canvas.addEventListener("mouseup", function () {
    isDrawing = false;
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStack.push(imageData);
    redoStack = [];
});

canvas.addEventListener("mouseleave", function () {
  isDrawing = false;
});

function changeColor(color){
    currentColor = color;
}

function changeSize(){
    currentSize = document.getElementById("size").value;
}

function selectPencil() {
    currentTool = "pencil";
}

function selectEraser() {
    currentTool = "eraser";
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function saveImage() {
    const imageData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageData;
    link.download = "mein_bild.png";
    link.click();
    closeSaveWrapper();
}

function openSaveWrapper() {
    const saveWrapper = document.getElementById("saveWrapper");
    saveWrapper.style.opacity = "1";
    saveWrapper.style.pointerEvents = "auto";
}

function closeSaveWrapper() {
    const saveWrapper = document.getElementById("saveWrapper");
    saveWrapper.style.opacity = "0";
    saveWrapper.style.pointerEvents = "none";
}

function undo() {
    if (undoStack.length === 0) {
        return;
    }
    let lastState = undoStack.pop();
    redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.length > 0) {
        ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function redo() {
    if (redoStack.length === 0) {
        return;
    }
    var redoState = redoStack.pop();
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.putImageData(redoState, 0, 0);
}

function fill(){
    ctx.fillStyle = currentColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}