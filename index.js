const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");
const lineWidth = document.getElementById("line-width");
const color = document.getElementById("color");
const colorOptions = Array.from(document.getElementsByClassName("color-option"));
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const fillBtn = document.getElementById("fill-btn");
const paintBtn = document.getElementById("paint-btn");
const lineCapBtn = document.getElementById("line-cap-btn");

const catBtn = document.getElementById("cat");
const birdBtn = document.getElementById("bird");
const frogBtn = document.getElementById("frog");
const horseBtn = document.getElementById("horse");
const images = ["bird.png", "cat.png", "frog.png", "horse.png"];

const drawBox = document.getElementById("draw-box");
const textBtn = document.getElementById("text-btn");
const fontSizeInput = document.getElementById("font-size");

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "square";

let isDrawing = false;
let isPainting = false;
let isFilling = false;

let isTexting = false;
let fontSize = fontSizeInput.value;

function onMove(event) {
    if (isDrawing) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return;
    }

    if (isPainting) {
        ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}
function startDrawing(event) {
    if (isTexting) {
        if (textForm === null) {
            createTextInput(event);
        } else {
            textForm.remove();
            textForm = null;
            isTexting = false;
        }
        return;
    } else {
        isDrawing = true;
    }
}
function cancelDrawing() {
    isDrawing = false;
}

function onFillClick(event) {
    onSelected(event.target.id);
    isFilling = true;
    ctx.strokeStyle = color.value;
    ctx.fillStyle = color.value;
}

function changePainting(event) {
    onSelected(event.target.id);
    isPainting = true;
    ctx.strokeStyle = color.value;
    ctx.fillStyle = color.value;
}

function onLineWidthChange(event) {
    ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
    const colorValue = event.target.dataset.color;
    ctx.strokeStyle = colorValue;
    ctx.fillStyle = colorValue;
    color.value = colorValue;
}

function onSelected(id) {
    const currentSelectedBtn = document.querySelector(".selected");
    const targetBtn = document.getElementById(id);

    currentSelectedBtn.classList.remove("selected");
    targetBtn.classList.add("selected");

    isDrawing = false;
    isPainting = false;
    isFilling = false;
}

function onModeClick(event) {
    onSelected(event.target.id);
    // isDrawing = true;
}

function onCanvasClick() {
    if (isFilling) {
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        isDrawing = false;
        isPainting = false;
    }
}

function onDestroyClick(event) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = color.value;
    ctx.fillStyle = color.value;
}

function onEraserClick(event) {
    onSelected(event.target.id);
    ctx.strokeStyle = "white";
}

function onFileChange(event) {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image.onload = function () {
        ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        fileInput.value = null;
    };
}

function onLoadImage(event) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const image = new Image();
    image.src = `image/${event.target.id}.png`;
    image.onload = function () {
        ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        fileInput.value = null;
    };
}

function onSaveClick() {
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = "myDrawing.png";
    a.click();
}

function changeLineCap(event) {
    if (event.target.dataset.shape === "square") {
        ctx.lineCap = "round";
        lineCapBtn.classList.remove("fa-square-full");
        lineCapBtn.classList.add("fa-circle");
        lineCapBtn.dataset.shape = "circle";
        lineCapBtn.title = "원형 브러쉬";
    } else {
        ctx.lineCap = "square";
        lineCapBtn.classList.remove("fa-circle");
        lineCapBtn.classList.add("fa-square-full");
        lineCapBtn.dataset.shape = "square";
        lineCapBtn.title = "사각형 브러쉬";
    }
}

function onTextClick(event) {
    isTexting = true;
}
function changeFontSize(event) {
    fontSize = event.target.value;
}

let textForm = null;
function createTextInput(event) {
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("required", true);
    input.style.color = color.value;
    input.style.fontSize = `${fontSize}px`;
    input.style.fontFamily = `"Lato", sans-serif`;
    form.appendChild(input);
    form.setAttribute("style", `top:${event.pageY}px; left:${event.pageX}px;`);
    drawBox.appendChild(form);
    setTimeout(() => {
        input.focus();
    }, 50);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const target = e.target;
        const text = target.querySelector("input").value;
        if (text !== "") {
            ctx.save();
            ctx.lineWidth = 1;
            ctx.font = `${fontSize}px Lato`;
            ctx.fillStyle = color.value;
            ctx.fillText(text, event.offsetX, event.offsetY + parseInt(fontSize));
            ctx.restore();
        }
        isTexting = false;
        textForm = null;
        target.remove();
    });
    textForm = form;
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", cancelDrawing);
canvas.addEventListener("mouseleave", cancelDrawing);
canvas.addEventListener("click", onCanvasClick);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);

fillBtn.addEventListener("click", onFillClick);
paintBtn.addEventListener("click", changePainting);

fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);

lineCapBtn.addEventListener("click", changeLineCap);

catBtn.addEventListener("click", onLoadImage);
birdBtn.addEventListener("click", onLoadImage);
frogBtn.addEventListener("click", onLoadImage);
horseBtn.addEventListener("click", onLoadImage);

textBtn.addEventListener("click", onTextClick);
fontSizeInput.addEventListener("change", changeFontSize);
