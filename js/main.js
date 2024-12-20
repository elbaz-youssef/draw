const c = document.getElementById('c');
const ctx = c.getContext('2d');
const w = c.width = window.innerWidth - 80;
const h = c.height = 400;
const circle = Math.PI * 2;

let gradient = ctx.createLinearGradient(0, 0, w / 2, 0);
gradient.addColorStop(1, '#aaa');
gradient.addColorStop(1, '#777');
gradient.direction = 'ltr';

let color = "#333";
let width = 3;
let is_drawing = false;
let bg = "#fff";
ctx.fillStyle = bg;
ctx.fillRect(0,0,w,h);
ctx.font = "30px Tahoma";
ctx.lineWidth = 2;
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.strokeStyle = gradient;
ctx.strokeText("You Can Draw Here",w/2,h/2);

let beginDraw = 0;
let changes = [];
let index = - 1;

function changeColor(element) {
    color = window.getComputedStyle(element).backgroundColor;
}

function otherColor(clr) {
    color = clr;
}

function changeWidth(wid) {
    width = wid;
}

function clearAll() {
    index = -1;
    changes = [];
    ctx.clearRect(0,0,w,h);
    ctx.fillRect(0,0,w,h);
}



function restore() {
    changes.push(ctx.getImageData(0, 0 , w, h));
    index += 1;
}

function undo() {
    if(index <= 0) {
        clearAll();
    }
    else {
        changes.pop();
        index -= 1;
        ctx.putImageData(changes[index], 0, 0);
    }
}



c.addEventListener('touchstart',start,false);
c.addEventListener('touchmove',draw,false);
c.addEventListener('mousedown',start,false);
c.addEventListener('mousemove',draw,false);

c.addEventListener("touchend",stop,false);
c.addEventListener('mouseout',stop,false);
c.addEventListener('mouseup',stop,false);




function start(event) {
    beginDraw++;
    if(beginDraw === 1) {
        ctx.clearRect(0,0,w,h);
        ctx.fillRect(0,0,w,h);
    }
    c.style.boxShadow = "none";
    is_drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.clientX - c.offsetLeft,event.clientY - c.offsetTop);
    event.preventDefault();
}

function draw(event) {
    if(is_drawing) {
        ctx.lineTo(event.clientX - c.offsetLeft,event.clientY - c.offsetTop);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

    }
    event.preventDefault();
}

function stop(event) {
    if(is_drawing) {
        ctx.closePath();
        is_drawing = false; 
    }
    if(event.type != "mouseout") {
        restore();
    }
    event.preventDefault();
}

let boxColor = "rgb(43, 134, 197)";
console.log(window.getComputedStyle(c).boxShadow);
console.log(`${boxColor} 1px 1px 5px 1px, ${boxColor} -1px -1px 5px 1px`);
    
let intervalId = setInterval(() => {
    if(beginDraw > 0) clearInterval(intervalId);
    else {
        if(window.getComputedStyle(c).boxShadow === `${boxColor} 1px 1px 5px 1px, ${boxColor} -1px -1px 5px 1px`) {
            c.style.cssText = `box-shadow: ${boxColor} 0px 0px 0px 0px`;
            console.log("condition is true");
        } 
        else c.style.cssText = `box-shadow: ${boxColor} 1px 1px 5px 1px, ${boxColor} -1px -1px 5px 1px`;
    }
},1500);



