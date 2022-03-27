//Global Constants
const cluePauseTime = 333; //how long to pause in between class
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
let pattern = [];
let progress = 0;
let gamePlaying = false;
let tonePlaying = false;
let volume = 0.5;
let guessCounter = 0;
let clueHoldTime = 1000; //how long to hold each clue's light/sound
let numLife;
let gameTimer;
let numButtons = 4;
let gamemode = 1; //1 OG,2 Pokemon,3 Digimon
let gameTimeLimit = 15;

function startGame(){
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  numLife = 3; 
  rdmNumGn();
  playClueSequence();
}

function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  clueHoldTime = 1000;
  endTimer();
  resetLife();
}

//Light/Clear Button
function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
  
}
function clearButton(btn){
  console.log(btn)
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSound(btn) {
  switch(gamemode){
    case 1://OG
      startTone(btn);
      break;
    case 2://Pokemon
      playPkmTone(btn);
      break;
    case 3:
      playDgmTone(btn);
      break;
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 534.2,
  6: 602.2,
  7: 670.2,
  8: 738.2
}

//Different Audios for each Game
const pkmBlWhAudio = {
  1: "https://cdn.glitch.global/103b247a-321b-46a7-962f-d90791b11196/Pokemon%20Cries%20-%20%23495%20Snivy.mp3?v=1648400793625",
  2: "https://cdn.glitch.global/103b247a-321b-46a7-962f-d90791b11196/Pokemon%20Cries%20-%20%23498%20Tepig.mp3?v=1648406530527",
  3: "https://cdn.glitch.global/103b247a-321b-46a7-962f-d90791b11196/Pokemon%20Cries%20-%20%23501%20Oshawott.mp3?v=1648406530642",
  4: "https://cdn.glitch.global/103b247a-321b-46a7-962f-d90791b11196/Pokemon%20Cries%20-%20%23570%20Zorua.mp3?v=1648406531785",
  5: "https://cdn.glitch.global/103b247a-321b-46a7-962f-d90791b11196/Pokemon%20Cries%20-%20%23587%20Emolga.mp3?v=1648406530831",
  6: "https://cdn.glitch.global/103b247a-321b-46a7-962f-d90791b11196/Pokemon%20Black%20and%20White%20-%20Axew's%20Cry.mp3?v=1648406530745",
  7: "https://cdn.glitch.global/103b247a-321b-46a7-962f-d90791b11196/Pokemon%20Black%20and%20White%20-%20Reshiram's%20Cry.mp3?v=1648406531681",
  8: "https://cdn.glitch.global/103b247a-321b-46a7-962f-d90791b11196/Pokemon%20Black%20and%20White%20-%20Zekrom's%20Cry.mp3?v=1648406530977"
}

const digimonAudio = {
  1: "https://cdn.glitch.global/103b247a-321b-46a7-962f-d90791b11196/wormmon.wav?v=1648407604471",
  2: "https://cdn.glitch.global/103b247a-321b-46a7-962f-d90791b11196/agumon.wav?v=1648407604260",
  3: "https://cdn.glitch.global/103b247a-321b-46a7-962f-d90791b11196/gabumon.wav?v=1648407604050",
  4: "https://cdn.glitch.global/103b247a-321b-46a7-962f-d90791b11196/gomamon.wav?v=1648407603951",
  5: "https://cdn.glitch.global/103b247a-321b-46a7-962f-d90791b11196/guilmon.wav?v=1648407604390",
  6: "https://cdn.glitch.global/103b247a-321b-46a7-962f-d90791b11196/biyomon.wav?v=1648407603935",
  7: "https://cdn.glitch.global/103b247a-321b-46a7-962f-d90791b11196/gatomon.wav?v=1648407603914",
  8: "https://cdn.glitch.global/103b247a-321b-46a7-962f-d90791b11196/tentamon.wav?v=1648407604415"
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}

function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    aiSound(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  context.resume();
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  //disable buttons
  document.getElementById("gameButtonArea").style.pointerEvents = 'none';
  
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
  setTimeout(startTimer, delay);
  setTimeout(() => {document.getElementById("gameButtonArea").style.pointerEvents = 'auto'}, delay)
}
//Pokemon Sound
function playPkmTone(btn) {
  let audio = new Audio(pkmBlWhAudio[btn]);
  audio.play();
}

//Digimon Sound
function playDgmTone(btn) {
  let audio = new Audio(digimonAudio[btn]);
  audio.play();
}

function aiSound(btn,len) {
  switch(gamemode) {
    case 1:
      playTone(btn,len);
      break;
    case 2:
      playPkmTone(btn);
      break;
    case 3:
      playDgmTone(btn);
      break;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You won!");
}

//Original Game Heart Code
function loseHeart() {
  numLife--;
  switch(numLife) {
    case 2:
      document.getElementById("fullHeart3").classList.add("hidden");
      document.getElementById("emptyHeart3").classList.remove("hidden");
      break;
    case 1:
      document.getElementById("fullHeart2").classList.add("hidden");
      document.getElementById("emptyHeart2").classList.remove("hidden");
      break;
    case 0:
      document.getElementById("fullHeart1").classList.add("hidden");
      document.getElementById("emptyHeart1").classList.remove("hidden");
  }
  if (numLife == 0){
    loseGame();
  } 
}

function resetHearts() {
  document.getElementById("fullHeart1").classList.remove("hidden");
  document.getElementById("fullHeart2").classList.remove("hidden");
  document.getElementById("fullHeart3").classList.remove("hidden");
  document.getElementById("emptyHeart1").classList.add("hidden");
  document.getElementById("emptyHeart2").classList.add("hidden");
  document.getElementById("emptyHeart3").classList.add("hidden");
}

//Pokemon Game Heart Code
function loseBall() {
  numLife--;
  switch(numLife) {
    case 2:
      document.getElementById("fullBall3").classList.add("hidden");
      document.getElementById("emptyBall3").classList.remove("hidden");
      break;
    case 1:
      document.getElementById("fullBall2").classList.add("hidden");
      document.getElementById("emptyBall2").classList.remove("hidden");
      break;
    case 0:
      document.getElementById("fullBall1").classList.add("hidden");
      document.getElementById("emptyBall1").classList.remove("hidden");
  }
  if (numLife == 0){
    loseGame();
  } 
}

function resetBall() {
  document.getElementById("fullBall1").classList.remove("hidden");
  document.getElementById("fullBall2").classList.remove("hidden");
  document.getElementById("fullBall3").classList.remove("hidden");
  document.getElementById("emptyBall1").classList.add("hidden");
  document.getElementById("emptyBall2").classList.add("hidden");
  document.getElementById("emptyBall3").classList.add("hidden");
}

//Digimon Game Ball Code
function loseDigivice() {
  numLife--;
  switch(numLife) {
    case 2:
      document.getElementById("fullDigivice3").classList.add("hidden");
      document.getElementById("emptyDigivice3").classList.remove("hidden");
      break;
    case 1:
      document.getElementById("fullDigivice2").classList.add("hidden");
      document.getElementById("emptyDigivice2").classList.remove("hidden");
      break;
    case 0:
      document.getElementById("fullDigivice1").classList.add("hidden");
      document.getElementById("emptyDigivice1").classList.remove("hidden");
  }
  if (numLife == 0){
    loseGame();
  } 
}

function resetDigivice() {
  document.getElementById("fullDigivice1").classList.remove("hidden");
  document.getElementById("fullDigivice2").classList.remove("hidden");
  document.getElementById("fullDigivice3").classList.remove("hidden");
  document.getElementById("emptyDigivice1").classList.add("hidden");
  document.getElementById("emptyDigivice2").classList.add("hidden");
  document.getElementById("emptyDigivice3").classList.add("hidden");
}

function loseLife() {
  switch(gamemode) {
    case 1:
      loseHeart();
      break;
    case 2:
      loseBall();
      break;
    case 3:
      loseDigivice();
      break;
  }
  endTimer();
  if (numLife != 0) {
    playClueSequence();
  }
}

function resetLife() {
  switch(gamemode) {
    case 1:
      resetHearts();
      break;
    case 2:
      resetBall();
      break;
    case 3:
      resetDigivice();
      break;
      
  }
}

//Guessing Button Code
function guess(btn){
  console.log("user guessed: " + btn);
  
  if(!gamePlaying){
    return;
  }
  
  if(pattern[guessCounter] == btn){
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        winGame();
      }else{
        progress++;
        playClueSequence();
        clueHoldTime -= 100;
        endTimer();
      }
    }else{
      guessCounter++;
    }
  }else{
    loseLife();
  }
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

//Choosing how many buttons you want to play with
document.getElementById("4Btns").addEventListener("click", () => {
  stopGame();
  document.getElementById("button5").classList.add("hidden");
  document.getElementById("button6").classList.add("hidden");
  document.getElementById("button7").classList.add("hidden");
  document.getElementById("button8").classList.add("hidden");
  numButtons = 4;
});

document.getElementById("5Btns").addEventListener("click", () => {
  stopGame();
  document.getElementById("button5").classList.remove("hidden");
  document.getElementById("button6").classList.add("hidden");
  document.getElementById("button7").classList.add("hidden");
  document.getElementById("button8").classList.add("hidden");
  numButtons = 5;
});

document.getElementById("6Btns").addEventListener("click", () => {
  stopGame();
  document.getElementById("button5").classList.remove("hidden");
  document.getElementById("button6").classList.remove("hidden");
  document.getElementById("button7").classList.add("hidden");
  document.getElementById("button8").classList.add("hidden");
  numButtons = 6;
});

document.getElementById("7Btns").addEventListener("click", () => {
  stopGame();
  document.getElementById("button5").classList.remove("hidden");
  document.getElementById("button6").classList.remove("hidden");
  document.getElementById("button7").classList.remove("hidden");
  document.getElementById("button8").classList.add("hidden");
  numButtons = 7;
});

document.getElementById("8Btns").addEventListener("click", () => {
  stopGame();
  endTimer();
  document.getElementById("button5").classList.remove("hidden");
  document.getElementById("button6").classList.remove("hidden");
  document.getElementById("button7").classList.remove("hidden");
  document.getElementById("button8").classList.remove("hidden");
  numButtons = 8;
});

//Generate Random Number based on how many current buttons are on screen
function rdmNumGn() { 
  for (let i = 0 ; i < 8; i++) {
    pattern[i] = Math.ceil(Math.random() * numButtons)
  }
}

//Choosing the gamemode you wish to play
document.getElementById("originalBtn").addEventListener("click", () => {
  stopGame();
  //add active from shapes
  //Shapes
  document.getElementById("umbrella").classList.add("active");
  document.getElementById("triangle").classList.add("active");
  document.getElementById("star").classList.add("active");
  document.getElementById("circle").classList.add("active");
  document.getElementById("square").classList.add("active");
  document.getElementById("cone").classList.add("active");
  document.getElementById("heart").classList.add("active");
  document.getElementById("diamond").classList.add("active");
  //remove active to all Pokemon and Digimon
  //Pokemon
  document.getElementById("snivy").classList.remove("active");
  document.getElementById("tepig").classList.remove("active");
  document.getElementById("oshawott").classList.remove("active");
  document.getElementById("zorua").classList.remove("active");
  document.getElementById("emolga").classList.remove("active");
  document.getElementById("axew").classList.remove("active");
  document.getElementById("reshiram").classList.remove("active");
  document.getElementById("zekrom").classList.remove("active");
  //Digimon
  document.getElementById("wormmon").classList.remove("active");
  document.getElementById("agumon").classList.remove("active");
  document.getElementById("gabumon").classList.remove("active");
  document.getElementById("gomamon").classList.remove("active");
  document.getElementById("guilmon").classList.remove("active");
  document.getElementById("biyomon").classList.remove("active");
  document.getElementById("gatomon").classList.remove("active");
  document.getElementById("tentamon").classList.remove("active");
  //Change Button Color
  //Add Original
  document.getElementById("button1").classList.add("original");
  document.getElementById("button2").classList.add("original");
  document.getElementById("button3").classList.add("original");
  document.getElementById("button4").classList.add("original");
  document.getElementById("button5").classList.add("original");
  document.getElementById("button6").classList.add("original");
  document.getElementById("button7").classList.add("original");
  document.getElementById("button8").classList.add("original");
  //Remove Pokemon and Digimon
  document.getElementById("button1").classList.remove("pokemon");
  document.getElementById("button2").classList.remove("pokemon");
  document.getElementById("button3").classList.remove("pokemon");
  document.getElementById("button4").classList.remove("pokemon");
  document.getElementById("button5").classList.remove("pokemon");
  document.getElementById("button6").classList.remove("pokemon");
  document.getElementById("button7").classList.remove("pokemon");
  document.getElementById("button8").classList.remove("pokemon"); 
  document.getElementById("button1").classList.remove("digimon");
  document.getElementById("button2").classList.remove("digimon");
  document.getElementById("button3").classList.remove("digimon");
  document.getElementById("button4").classList.remove("digimon");
  document.getElementById("button5").classList.remove("digimon");
  document.getElementById("button6").classList.remove("digimon");
  document.getElementById("button7").classList.remove("digimon");
  document.getElementById("button8").classList.remove("digimon"); 
});

document.getElementById("pokemonBtn").addEventListener("click", () => {
  stopGame();
//add active from Pokemon
  //Pokemon
  document.getElementById("snivy").classList.add("active");
  document.getElementById("tepig").classList.add("active");
  document.getElementById("oshawott").classList.add("active");
  document.getElementById("zorua").classList.add("active");
  document.getElementById("emolga").classList.add("active");
  document.getElementById("axew").classList.add("active");
  document.getElementById("reshiram").classList.add("active");
  document.getElementById("zekrom").classList.add("active");
  //remove active to all Shapes and Digimon
  //Shapes
  document.getElementById("umbrella").classList.remove("active");
  document.getElementById("triangle").classList.remove("active");
  document.getElementById("star").classList.remove("active");
  document.getElementById("circle").classList.remove("active");
  document.getElementById("square").classList.remove("active");
  document.getElementById("cone").classList.remove("active");
  document.getElementById("heart").classList.remove("active");
  document.getElementById("diamond").classList.remove("active");
  //Digimon
  document.getElementById("wormmon").classList.remove("active");
  document.getElementById("agumon").classList.remove("active");
  document.getElementById("gabumon").classList.remove("active");
  document.getElementById("gomamon").classList.remove("active");
  document.getElementById("guilmon").classList.remove("active");
  document.getElementById("biyomon").classList.remove("active");
  document.getElementById("gatomon").classList.remove("active");
  document.getElementById("tentamon").classList.remove("active");
  //Change Button Color
  //Add Pokemon
  document.getElementById("button1").classList.add("pokemon");
  document.getElementById("button2").classList.add("pokemon");
  document.getElementById("button3").classList.add("pokemon");
  document.getElementById("button4").classList.add("pokemon");
  document.getElementById("button5").classList.add("pokemon");
  document.getElementById("button6").classList.add("pokemon");
  document.getElementById("button7").classList.add("pokemon");
  document.getElementById("button8").classList.add("pokemon");
  //Remove Original and Digimon
  document.getElementById("button1").classList.remove("original");
  document.getElementById("button2").classList.remove("original");
  document.getElementById("button3").classList.remove("original");
  document.getElementById("button4").classList.remove("original");
  document.getElementById("button5").classList.remove("original");
  document.getElementById("button6").classList.remove("original");
  document.getElementById("button7").classList.remove("original");
  document.getElementById("button8").classList.remove("original"); 
  document.getElementById("button1").classList.remove("digimon");
  document.getElementById("button2").classList.remove("digimon");
  document.getElementById("button3").classList.remove("digimon");
  document.getElementById("button4").classList.remove("digimon");
  document.getElementById("button5").classList.remove("digimon");
  document.getElementById("button6").classList.remove("digimon");
  document.getElementById("button7").classList.remove("digimon");
  document.getElementById("button8").classList.remove("digimon"); 
});

document.getElementById("digimonBtn").addEventListener("click", () => {
  stopGame();
//add active from Digimon
  //Digimon
  document.getElementById("wormmon").classList.add("active");
  document.getElementById("agumon").classList.add("active");
  document.getElementById("gabumon").classList.add("active");
  document.getElementById("gomamon").classList.add("active");
  document.getElementById("guilmon").classList.add("active");
  document.getElementById("biyomon").classList.add("active");
  document.getElementById("gatomon").classList.add("active");
  document.getElementById("tentamon").classList.add("active");
  //remove active to all Pokemon and Shapes
  //Pokemon
  document.getElementById("snivy").classList.remove("active");
  document.getElementById("tepig").classList.remove("active");
  document.getElementById("oshawott").classList.remove("active");
  document.getElementById("zorua").classList.remove("active");
  document.getElementById("emolga").classList.remove("active");
  document.getElementById("axew").classList.remove("active");
  document.getElementById("reshiram").classList.remove("active");
  document.getElementById("zekrom").classList.remove("active");
  //Shapes
  document.getElementById("umbrella").classList.remove("active");
  document.getElementById("triangle").classList.remove("active");
  document.getElementById("star").classList.remove("active");
  document.getElementById("circle").classList.remove("active");
  document.getElementById("square").classList.remove("active");
  document.getElementById("cone").classList.remove("active");
  document.getElementById("heart").classList.remove("active");
  document.getElementById("diamond").classList.remove("active");
  //Change Button Color
  //Add Digimon
  document.getElementById("button1").classList.add("digimon");
  document.getElementById("button2").classList.add("digimon");
  document.getElementById("button3").classList.add("digimon");
  document.getElementById("button4").classList.add("digimon");
  document.getElementById("button5").classList.add("digimon");
  document.getElementById("button6").classList.add("digimon");
  document.getElementById("button7").classList.add("digimon");
  document.getElementById("button8").classList.add("digimon");
  //Remove Original and Pokemon
  document.getElementById("button1").classList.remove("pokemon");
  document.getElementById("button2").classList.remove("pokemon");
  document.getElementById("button3").classList.remove("pokemon");
  document.getElementById("button4").classList.remove("pokemon");
  document.getElementById("button5").classList.remove("pokemon");
  document.getElementById("button6").classList.remove("pokemon");
  document.getElementById("button7").classList.remove("pokemon");
  document.getElementById("button8").classList.remove("pokemon"); 
  document.getElementById("button1").classList.remove("original");
  document.getElementById("button2").classList.remove("original");
  document.getElementById("button3").classList.remove("original");
  document.getElementById("button4").classList.remove("original");
  document.getElementById("button5").classList.remove("original");
  document.getElementById("button6").classList.remove("original");
  document.getElementById("button7").classList.remove("original");
  document.getElementById("button8").classList.remove("original"); 
});

//Change Hearts depending on gamemode
//Original Hearts
document.getElementById("originalBtn").addEventListener("click", () => {
  gamemode = 1;
  //remove hidden from original hearts and add hidden to orignal empty hearts
  document.getElementById("fullHeart1").classList.remove("hidden");
  document.getElementById("fullHeart2").classList.remove("hidden");
  document.getElementById("fullHeart3").classList.remove("hidden");
  document.getElementById("emptyHeart1").classList.add("hidden");
  document.getElementById("emptyHeart2").classList.add("hidden");
  document.getElementById("emptyHeart3").classList.add("hidden");
  //add hidden to all the other gamemode hearts
  document.getElementById("fullBall1").classList.add("hidden");
  document.getElementById("fullBall2").classList.add("hidden");
  document.getElementById("fullBall3").classList.add("hidden");
  document.getElementById("emptyBall1").classList.add("hidden");
  document.getElementById("emptyBall2").classList.add("hidden");
  document.getElementById("emptyBall3").classList.add("hidden");
  document.getElementById("fullDigivice1").classList.add("hidden");
  document.getElementById("fullDigivice2").classList.add("hidden");
  document.getElementById("fullDigivice3").classList.add("hidden");
  document.getElementById("emptyDigivice1").classList.add("hidden");
  document.getElementById("emptyDigivice2").classList.add("hidden");
  document.getElementById("emptyDigivice3").classList.add("hidden");
});

document.getElementById("pokemonBtn").addEventListener("click", () => {
  gamemode = 2;
  //remove hidden from pokeball and add hidden to empty ball
  document.getElementById("fullBall1").classList.remove("hidden");
  document.getElementById("fullBall2").classList.remove("hidden");
  document.getElementById("fullBall3").classList.remove("hidden");
  document.getElementById("emptyBall1").classList.add("hidden");
  document.getElementById("emptyBall2").classList.add("hidden");
  document.getElementById("emptyBall3").classList.add("hidden");
  //add hidden to all the other gamemode hearts
  document.getElementById("fullHeart1").classList.add("hidden");
  document.getElementById("fullHeart2").classList.add("hidden");
  document.getElementById("fullHeart3").classList.add("hidden");
  document.getElementById("emptyHeart1").classList.add("hidden");
  document.getElementById("emptyHeart2").classList.add("hidden");
  document.getElementById("emptyHeart3").classList.add("hidden");
  document.getElementById("fullDigivice1").classList.add("hidden");
  document.getElementById("fullDigivice2").classList.add("hidden");
  document.getElementById("fullDigivice3").classList.add("hidden");
  document.getElementById("emptyDigivice1").classList.add("hidden");
  document.getElementById("emptyDigivice2").classList.add("hidden");
  document.getElementById("emptyDigivice3").classList.add("hidden");
});

document.getElementById("digimonBtn").addEventListener("click", () => {
  gamemode = 3;
  //remove hidden from digivice and add hidden to empty digivice
  document.getElementById("fullDigivice1").classList.remove("hidden");
  document.getElementById("fullDigivice2").classList.remove("hidden");
  document.getElementById("fullDigivice3").classList.remove("hidden");
  document.getElementById("emptyDigivice1").classList.add("hidden");
  document.getElementById("emptyDigivice2").classList.add("hidden");
  document.getElementById("emptyDigivice3").classList.add("hidden");
  //add hidden to all the other gamemode hearts
  document.getElementById("fullHeart1").classList.add("hidden");
  document.getElementById("fullHeart2").classList.add("hidden");
  document.getElementById("fullHeart3").classList.add("hidden");
  document.getElementById("emptyHeart1").classList.add("hidden");
  document.getElementById("emptyHeart2").classList.add("hidden");
  document.getElementById("emptyHeart3").classList.add("hidden");
  document.getElementById("fullBall1").classList.add("hidden");
  document.getElementById("fullBall2").classList.add("hidden");
  document.getElementById("fullBall3").classList.add("hidden");
  document.getElementById("emptyBall1").classList.add("hidden");
  document.getElementById("emptyBall2").classList.add("hidden");
  document.getElementById("emptyBall3").classList.add("hidden");
});

//Changing Background color
//Original Game
document.getElementById("originalBtn").addEventListener("click", () => {
  document.body.classList.add("og");
  document.body.classList.remove("pkm");
  document.body.classList.remove("dgm");
});
//Pokemon Game
document.getElementById("pokemonBtn").addEventListener("click", () => {
  document.body.classList.add("pkm");
  document.body.classList.remove("og");
  document.body.classList.remove("dgm");
});
//Digimon Game
document.getElementById("digimonBtn").addEventListener("click", () => {
  document.body.classList.add("dgm");
  document.body.classList.remove("og");
  document.body.classList.remove("pkm");
});

//Changing Panel color
//Original Game
document.getElementById("originalBtn").addEventListener("click", () => {
  document.getElementById("panel").classList.add("OG");
  document.getElementById("panel").classList.remove("Pkm");
  document.getElementById("panel").classList.remove("Dgm");
});
//Pokemon game
document.getElementById("pokemonBtn").addEventListener("click", () => {
  document.getElementById("panel").classList.add("Pkm");
  document.getElementById("panel").classList.remove("OG");
  document.getElementById("panel").classList.remove("Dgm");
});
//Digimon game
document.getElementById("digimonBtn").addEventListener("click", () => {
  document.getElementById("panel").classList.add("Dgm");
  document.getElementById("panel").classList.remove("OG");
  document.getElementById("panel").classList.remove("Pkm");
});

//Changing Header and Footer color
document.getElementById("originalBtn").addEventListener("click", () => {
  document.getElementById("header").classList.add("OG");
  document.getElementById("footer").classList.add("OG");
  document.getElementById("header").classList.remove("Pkm");
  document.getElementById("header").classList.remove("Dgm");
  document.getElementById("footer").classList.remove("Pkm");
  document.getElementById("footer").classList.remove("Dgm");
});
//Pokemon game
document.getElementById("pokemonBtn").addEventListener("click", () => {
  document.getElementById("header").classList.add("Pkm");
  document.getElementById("footer").classList.add("Pkm");
  document.getElementById("header").classList.remove("OG");
  document.getElementById("header").classList.remove("Dgm");
  document.getElementById("footer").classList.remove("OG");
  document.getElementById("footer").classList.remove("Dgm");
});
//Digimon game
document.getElementById("digimonBtn").addEventListener("click", () => {
  document.getElementById("header").classList.add("Dgm");
  document.getElementById("footer").classList.add("Dgm");
  document.getElementById("header").classList.remove("OG");
  document.getElementById("header").classList.remove("Pkm");
  document.getElementById("footer").classList.remove("OG");
  document.getElementById("footer").classList.remove("Pkm");
});

//Changing Timer Color
document.getElementById("originalBtn").addEventListener("click", () => {
  document.getElementById("timer").classList.add("OG");
  document.getElementById("timer").classList.remove("Pkm");
  document.getElementById("timer").classList.remove("Dgm");
});
//Pokemon game
document.getElementById("pokemonBtn").addEventListener("click", () => {
  document.getElementById("timer").classList.add("Pkm");
  document.getElementById("timer").classList.remove("Dgm");
  document.getElementById("timer").classList.remove("OG");
});
//Digimon game
document.getElementById("digimonBtn").addEventListener("click", () => {
  document.getElementById("timer").classList.add("Dgm");
  document.getElementById("timer").classList.remove("Pkm");
  document.getElementById("timer").classList.remove("OG");
});

function startTimer() {
  gameTimer = setInterval(() => {
    gameTimeLimit -= 1;
    if (gameTimeLimit == 0) {
      loseLife();
    }
    document.getElementById("timer").innerHTML = gameTimeLimit;
  }, 1000)
}

function endTimer() {
  clearInterval(gameTimer);
  gameTimeLimit = 15;
  document.getElementById("timer").innerHTML = gameTimeLimit;
}
