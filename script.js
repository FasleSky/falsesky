const birdSkins=[
 "https://i.ibb.co/Tx18hNjp/download-1-removebg-preview.png",
 "https://i.ibb.co/cKWYWR3z/Untitled-Project-12.png",
 "https://i.ibb.co/0jLLJ15q/Untitled-Project-1.png",
 "https://i.ibb.co/XkKdpVp7/Untitled-Project-2.png",
 "https://i.ibb.co/Y7fTWKTf/Untitled-Project-1-removebg-preview.png"
];
// AUDIO for each bird (one sound per character)
const birdSounds = [
    new Audio("sounds/bsound1.mp3"),  // sound for Bird 1
    new Audio("sounds/bs(clumsy).mp3"),  // sound for Bird 2
    new Audio("sounds/bs(pere).mp3"),   // sound for Bird 3
    new Audio("sounds/bs(raju).mp3"),
    new Audio("sounds/bs(sia).mp3")
];

const pipeUp="https://i.ibb.co/6R7g7dSn/pipe-bottom.png";
const pipeDown="https://i.ibb.co/XfNG6d2t/pipe-top.png";
const bgSrc="https://i.ibb.co/8DhDHTYR/A2VW8b.png";

let menu=document.getElementById("menu");
let charMenu=document.getElementById("charMenu");
let gameWrapper=document.getElementById("wrapper");
let over=document.getElementById("gameOver");
let scoreBox=document.getElementById("score");

let canvas=document.getElementById("game");
let ctx=canvas.getContext("2d");

let birdImg=new Image();
let bg=new Image(); bg.src=bgSrc;

let birdHitbox = 40;   // collision box (unchanged small size)
let birdDisplay = 190;  // visual size (increase or tune later)
let birdX=100,birdY=250,vel=0,gravity=0.35,lift=-4.7;
let pipes=[],score=0,run=false,bird=0;

/* --- UI BUTTONS --- */
document.getElementById("play").onclick=()=>{
    menu.style.display="none";
    gameWrapper.style.display="block";
    run=true; start(); pipeLoop();
}

document.getElementById("characters").onclick=()=>{
    menu.style.display="none";
    charMenu.style.display="block";
}

document.getElementById("back").onclick=()=>{
    charMenu.style.display="none";
    menu.style.display="block";
}

document.querySelectorAll("#skins img").forEach(i=>{
    i.onclick=()=>{
        bird=i.getAttribute("data-id");
        alert("Bird Selected!");
    }
});

document.getElementById("retry").onclick=()=>location.reload();

/* GAME LOOP */
function start(){
    if(!run)return;
    ctx.drawImage(bg,0,0,450,600);

    birdImg.src=birdSkins[bird];
    vel+=gravity; birdY+=vel;
    ctx.drawImage(birdImg, birdX - (birdDisplay - birdHitbox)/2, birdY - (birdDisplay - birdHitbox)/2, birdDisplay, birdDisplay);

    if(birdY<0||birdY>560) return end();

    pipes.forEach((p,i)=>{
        p.x-=3;
        let top=new Image(); top.src=pipeUp;
        let bottom=new Image(); bottom.src=pipeDown;

        ctx.drawImage(top,p.x,p.y-450,60,450);
        ctx.drawImage(bottom,p.x,p.y+150,60,450);
        // Increase score only when pipe passes the bird completely
if(p.x + 60 < birdX && !p.scored){   // 60 is pipe width default
    score++;
    p.scored = true;                 // prevents double scoring
    scoreBox.innerHTML = score;
}

        if(
         birdX + birdHitbox > p.x && 
         birdX < p.x + 60 && 
         (birdY < p.y || birdY + birdHitbox > p.y + 150)
        ) return end();

        if(p.x<-60) pipes.splice(i,1);
    });

    requestAnimationFrame(start);
}
function pipeLoop(){
    if(!run) return;

    pipes.push({
        x:450,
        y:Math.random()*250+60,
        scored:false   // <-- add this flag
    });

    setTimeout(pipeLoop,1500);
}

/* CONTROLS */
function jump(){
    if(!run) return;

    vel = lift;

    // play respective sound per selected bird
    let sound = birdSounds[bird];
    sound.pause();
    sound.currentTime = 0;
    sound.play();
}

document.addEventListener("keydown", jump);
document.addEventListener("click", jump);

/* END */
function end(){
    run=false;
    over.style.display="block";
}
