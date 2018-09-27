/* This is the main script that will get the game working. First, we'll draw the Canvas, using a 2d format where *
*  we'll put in all the "images" of the game. Then, we'll start dynamic interactions on these images between each*
*  other. As we set the "rectangle" or canvas, we'll load the images. I've decided to call the characters as ch0 *
*  and ch1 (I'll try to slightly animate them).                                                                  *
*  | DrawImage method: DrawImage(SourceFile, SourceX, SourceY, PixelsGetWidth, PixelsGetHeight, CanvasX,         *
*  | CanvasY, ScaleX, ScaleY)                                                                                    *
*                                                                                                                *
*                                                                                                                *
*                                                                                                                *
*                                                                                                                */

// Building canvas and its parameters.
var canvas = document.createElement("canvas");
var cctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;

var ch = new Image();
ch.ready = false;
ch.onload = gameReady;
document.body.appendChild(canvas);
var firstCharSetY = 0; // Start first set of sprites
var secondCharSetY = 432;  // Start second set of sprites.
var nextXChar = 16;
var nextYchar = 32;
var widthT = (canvas.width) / 16 // N tiles
var heightT = (canvas.height) / 16; // N tiles height

// Source image paths
var ch0 = "Tileset/Characters/Humanoid0.png";
ch.src = ch0;



// Object creation with parameters



var player = {
    ID: 0,
    x: myRNum(widthT)*16,
    y: myRNum(heightT)*16,
    pmodelX: 96,
    pmodelY: [32,
        464],
    psize: 16,
    speed: 16,
    attack: 15,
    defense: 10,
    magic: 8,
    HP: 30,
    MP: 10,
    XP: 0,
    Level: 1,
    inventory: [ item,
        item,
        item],
    moved: false,
}

var enemy = {
    ID: 1,
    x: myRNum(widthT)*16,
    y: myRNum(heightT)*16,
    pmodelX: [
        0,
        16,
        32,
        48,
        64,
        80,
        96
    ],
    pmodelY: [
        64,
    496], // 496 v2
    psize: 16,
    speed: 16,
    attack: 5,
    defense: 10,
    magic: 8,
    HP: 10,
    MP: 10,
}
var itemtype = [
    Empty = [0, 0, 0, 0, 0, 0],
    Sword = [8, 7, 0, 0, 0, 0],
    Spear = [10, 5, 0, 0, 0, 0],
    Axe = [12, 3, 0, 0, 0, 0],
    Necro = [15, 0, 0, 0, 0, 0],
    Anima = [12, 3, 0, 0, 0, 0],
    Lux = [10, 5, 0, 0, 0, 0],
    LArmor = [3, 8, 0, 20, 0, 0],
    HArmor = [0, 15, -2, 50, 0, 0],

]
var item = {
    ID: 9999,
    type: itemtype[0],
    x: myRNum(widthT)*16,
    y: myRNum(heightT)*16,
    stats: [ iattack = 0,
    idefense = 0,
    imagic = 0,
    iHP = 0,
    iMP = 0,
    Heal = 0],
}



var score = 0;
var randomorc = myRNum(6);
var animation = setInterval(changeAnim, 1000);
var keyclick = {68: false, 65: false, 83: false, 87: false};

// Keyclick keydown keyup registry, with keydown to register pressed keys and keyup to set 'em false in the mapping:
document.addEventListener("keydown", function (event) {
    keyclick[event.keyCode] = true;
    move(keyclick);
}, false)
document.addEventListener("keyup", function (event) {
    keyclick[event.keyCode] = false;
}, false)

function myRNum(number){ // generate a random number
    return Math.floor((Math.random()*number));
}







/* Listeners */


function gameReady() {
    this.ready = true;
    playGame();
}

function playGame() {
   
    render();
    requestAnimationFrame(playGame);
}

/* This function will check if the player has moved. If they did, game will check player's pos x,y; then move the       *
/ enemy as it's more convenient. Keep in mind this project is meant to be simple, so I won't use Markov Decision        *
/ Processes, or heuristic searches at the moment. I have knowledge of these two though, and I'll implement them if it's *
/ necessary    
_______________                                
| 2nd  |  1st  |
|      |       |
================
| 3rd  |   4rd |
|______|_______|                                                                        */


function checkMovement(){
if (player.moved === true){
    if ( Math.abs((player.x - enemy.x)) != 1 || Math.abs((player.y - enemy.y)) != 1){
    var path = myRNum(2);
      // First four conditionals are in case of being in the same Y or X as other characters.
        if (player.x < enemy.x && player.y === enemy.y) mLeft(enemy);           //  What do we archieve with these
        if (player.x === enemy.x && player.y > enemy.y) mDown(enemy);           //  conditionals in the context of
        if (player.x === enemy.x && player.y < enemy.y) mUp(enemy);             //  enemy movement?
        if (player.x > enemy.x && player.y === enemy.y) mRight(enemy);          //  Well, let's be clear: A player
                                                                                //  doesn't want an enemy to stick
                                                                                //  to his buttocks. By choosing
                                                                                //  one direction to go, if the 
                                                                                //  player doesn't go all the way
                                                                                //  straight into a direction, and
                                                                                //  tries to zig zag a bit, the enemy
                                                                                //  will gradually get far away, giving
                                                                                //  some chance of relocating yourself.
        if (player.x > enemy.x && player.y < enemy.y){  // move towards 1st quadrant
        path === 1 ? mRight(enemy) : mUp(enemy);
        }
        if (player.x < enemy.x && player.y < enemy.y){  // move towards 2nd quadrant
            path === 1 ? mLeft(enemy) : mUp(enemy);   
        }
        if (player.x < enemy.x && player.y > enemy.y){  // move towards 3rd quadrant
            path === 1 ? mLeft(enemy) : mDown(enemy);
        }
        if (player.x > enemy.x && player.y > enemy.y){  // move towards 4rd quadrant
        path === 1 ? mRight(enemy) : mDown(enemy); }
    } else {
        attack(enemy, player);
    }
    }
}

function attack(char1, char2){
var char1AT = 0;
var char2DEF = 0;

char2.HP -= char1AT - char2DEF;

if (char2.HP <= 0) eraseEnemy(char2);
}



// Create images and stuff over the canvas. It refreshes character positions too.
function render() {
    cctx.fillStyle = "black";
    cctx.fillRect(0, 0, canvas.width, canvas.height);
    cctx.drawImage(ch, player.pmodelX, player.pmodelY[iSprite], player.psize, player.psize,
        player.x, player.y, 16, 16);  
    cctx.drawImage(ch, enemy.pmodelX[randomorc], enemy.pmodelY[iSprite], enemy.psize, enemy.psize,
            enemy.x, enemy.y, 16, 16);  
    cctx.font = "20px Bungee Shade";
    cctx.fillStyle = "white";
    cctx.fillText("Score: " + score, (canvas.width/2)-30, 20);
    cctx.fillText("TO THE GAMEEEES", 350, 350)              // Placeholder.
    
}



/* Movement: */


function mLeft(character) {
    character.x -= character.speed;

}

function mRight(character) {
    character.x += character.speed;

}

function mUp(character) {
    character.y -= character.speed;

}

function mDown(character) {
    character.y += character.speed;

}


function move(keyclick) {
    


    if (keyclick[87] === true) { 
        if (player.y > 0)  mUp(player);   
        player.moved = true;
        
    }

    if (keyclick[83] === true) {
        if (player.y < canvas.height-16) mDown(player);   
        player.moved = true;
      
    }
    if (keyclick[68] === true) { 
        if (player.x < canvas.width-16) mRight(player); 
        player.moved = true;
        
    }
    if (keyclick[65] === true) { 
        if (player.x > 0) mLeft(player);
        player.moved = true;
       
    }
    checkMovement();
    render();
    
        
}


//changeAnim() will be used to change animations
var iSprite = 0;
function changeAnim() {
    if (i === 0) iSprite++;
    else {
        iSprite--;
    }

}




