// TODO: Fix rotations on right-hand side of the board (objects will clip sides)



var GAME_WIDTHpx = 280;
var GAME_HEIGHTpx = 430;
var GAME_BOARD_WIDTH = 16;
var GAME_BOARD_HEIGHT = 25;

// implement levels where game ticks get faster?

var gameTickMils = 360;
var score = 0;

var blockSizeXpx = (GAME_WIDTHpx / GAME_BOARD_WIDTH);
var blockSizeYpx = (GAME_HEIGHTpx / GAME_BOARD_HEIGHT);
var centerTopBlockpx = (GAME_BOARD_WIDTH / 2) * blockSizeXpx;

var dropInterval; // used for the drop by the spacebar
var gameInterval; // used for the normal game drop 
var spacebarPressed = false;

var lastColor = "red";
var placingPiece = [];
var placedPieces = [];

var keepPlaying = false;

function tetris() {
    
    keepPlaying = true;
    myGameArea.start();
    gameInterval = setInterval(moveDownPlacingPiece, gameTickMils);
    
    var controls = function(event) {
        
            console.log(event);
        
        // Get the key pressed. Seems inconsistent where the key
        // pressed code comes from, but this checks both locations
        // it should be at.
        
        var key = event.which || event.keyCode || 0;

        // Also, implement features for controlling game for a touchscreen?
        
        if (key == 27) {
            //escape pressed
            myGameArea.remove_blocks();
            keepPlaying = false;
            clearInterval(gameInterval);
            window.removeEventListener("keydown", controls);
            myGameArea.exit();
            
        } else if (key == 32) {
            //space
            dropPiece();
            
        } else if (key == 65 || key == 37 || key == 97) {
            //a or left
            movePieceLeft();
            
        } else if (key == 68 || key == 39 || key == 100) {
            //d or right
            movePieceRight();    
            
        } else if (key == 83 || key == 40 || key == 115) {
            //s or down
            oneDownPiece();
            
        } else if (key == 87 || key == 38 || key == 119) {
            //w or up
            rotatePiece();
        }

    }
    
    window.addEventListener("keydown", controls);

    addPiece();

}


var myGameArea = {
    canvas : document.createElement("canvas"),
    
    start : function() {
        
        // Make sure gmae board is clear at start
        placedPieces.splice(0, placedPieces.length);
        document.getElementById("startButton").hidden = true;
        this.canvas.width = GAME_WIDTHpx;
        this.canvas.height = GAME_HEIGHTpx;
        this.context = this.canvas.getContext("2d");
        document.getElementById("game-canvas").appendChild(this.canvas);
        score = 0;
    },
    
    getContext : function() {
        return this.context;
    },
    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    
    remove_blocks : function() {
      //  placedPieces.splice(0, placedPieces.length);
        placingPiece.splice(0, placingPiece.length);
    },
    
    exit : function() {
        document.getElementById("game-canvas").removeChild(this.canvas);
        document.getElementById("startButton").hidden = false;
    }
}

function block (x, y, color){ //x, y, color
    this.blockWidth = GAME_WIDTHpx / GAME_BOARD_WIDTH;
    this.blockHeight = GAME_HEIGHTpx / GAME_BOARD_HEIGHT;
    this.xpos = x;
    this.ypos = y;
    this.color = color;
    return this;
}

function updateScore(filled_lines) {
            
    switch (filled_lines) {
        case 4:
            score += 3;
            
        case 3:
            score += 2;
            
        case 2:
            score += 2;
            
        case 1: 
            score += 1;
            
        default:
        
            score += 0;
            break;
    }
}


function addPiece() {
    //if this was done by the spacebar method
    clearInterval(dropInterval);
    spacebarPressed = false;
    
    // move the previously falling pieces to the non moving array
    while (placingPiece.length > 0) {
        placedPieces.push(placingPiece[0]);
        placingPiece.splice(0, 1);
    }
    
    // Check for any lines filled and update the score
    var filled_lines = checkFilledLines();
    updateScore(filled_lines);


    //create our new piece
    
    var colors = ["red", "blue", "green", "purple", "orange"];
    
    var type = Math.floor(Math.random() * 7);
    
    var color = lastColor;
    while (color == lastColor){
       color = colors[Math.floor(Math.random() * colors.length)];
    }
    lastColor = color;
    
    var centerBlock = GAME_BOARD_WIDTH / 2;
    var yOffset = 0;
    
    if (type == 0) {
        //4 x 1
        placingPiece.push(new block(centerBlock - 1, 0 + yOffset, color));
        placingPiece.push(new block(centerBlock, 0 + yOffset, color));
        placingPiece.push(new block(centerBlock + 1, 0 + yOffset, color));
        placingPiece.push(new block(centerBlock + 2, 0 + yOffset, color));
        
    } 
    
    else if (type == 1) {
        //2 x 2
        placingPiece.push(new block(centerBlock - 1, 0 + yOffset, color));
        placingPiece.push(new block(centerBlock, 0 + yOffset, color));
        placingPiece.push(new block(centerBlock - 1, 1 + yOffset, color));
        placingPiece.push(new block(centerBlock, 1 + yOffset, color));
    } 
    
    else if (type == 2) {
        // L
        placingPiece.push(new block(centerBlock, 0 + yOffset, color));
        placingPiece.push(new block(centerBlock, 1 + yOffset, color));
        placingPiece.push(new block(centerBlock, 2 + yOffset, color));
        placingPiece.push(new block(centerBlock + 1, 2 + yOffset, color));
    }
    
    else if (type == 3) {
        // opposite L
        placingPiece.push(new block(centerBlock, 0 + yOffset, color));
        placingPiece.push(new block(centerBlock, 1 + yOffset, color));
        placingPiece.push(new block(centerBlock, 2 + yOffset, color));
        placingPiece.push(new block(centerBlock - 1, 2 + yOffset, color));
    }
    
    else if (type == 4) {
        // T
        placingPiece.push(new block(centerBlock, 0 + yOffset, color));
        placingPiece.push(new block(centerBlock + 1, 1 + yOffset, color));
        placingPiece.push(new block(centerBlock, 1 + yOffset, color));
        placingPiece.push(new block(centerBlock - 1, 1 + yOffset, color));
    }
    
    else if (type == 5) {
        // -|_
        placingPiece.push(new block(centerBlock, 0 + yOffset, color));
        placingPiece.push(new block(centerBlock - 1, 0 + yOffset, color));
        placingPiece.push(new block(centerBlock, 1 + yOffset, color));
        placingPiece.push(new block(centerBlock + 1, 1 + yOffset, color));
        
    } 
    
    else {
        // _|-
        placingPiece.push(new block(centerBlock, 0 + yOffset, color)); 
        placingPiece.push(new block(centerBlock + 1, 0 + yOffset, color));
        placingPiece.push(new block(centerBlock, 1 + yOffset, color)); 
        placingPiece.push(new block(centerBlock - 1, 1 + yOffset, color));
    }
    
    redrawAllBlocks()
}

// Checks for full lines
function checkFilledLines() {
    var blockCount = 0;
    var filled_lines = 0;
    
    for (var i = GAME_BOARD_HEIGHT - 1; i >= 0; i--) {
        blockCount = 0;
        
        for (var j = 0; j < GAME_BOARD_WIDTH; j++) {
             
            for (var k = 0; k < placedPieces.length; k++) {
                
                if (i == placedPieces[k].ypos && j == placedPieces[k].xpos) {
                    blockCount++;
                }
            } 
        }
        
        // Remove the filled lines
        if (blockCount == GAME_BOARD_WIDTH) {
            filled_lines++;
            
            for (var k = 0; k < placedPieces.length; k++) {
                
                // remove filled row
                if (i == placedPieces[k].ypos) {
                    placedPieces.splice(k--, 1);
                }
                
                // Move all blocks above down by one
                else if (i > placedPieces[k].ypos) {
                    placedPieces[k].ypos += 1;
                
                }
            }
            
            // Adjust height location
            i++;
        }
    }
    
    return filled_lines;
}

/*moves down the piece being placed by 1 */
function moveDownPlacingPiece(){
    
    var blockBelow = false;
    
    
    for(var i = 0; i < placingPiece.length && !blockBelow; i++){
        
        if (placingPiece[i].ypos + 1 >= GAME_BOARD_HEIGHT){
            
            //we're going to hit the floor!
            blockBelow = true;
            break;
            
        } 
        
        else {
            
            //let's check if there's another block below us that is placed already
            for (var j = 0; j < placedPieces.length; j++) {
                
                if (placedPieces[j].xpos == placingPiece[i].xpos 
                    && placedPieces[j].ypos == placingPiece[i].ypos + 1){
                    //there's a block below us
                    blockBelow = true;
                    break;
                }
            }
        }
    }
    
    if (!blockBelow) {
        
        for (var i = 0; i < placingPiece.length; i++) {
            //move the placing piece down by one
            placingPiece[i].ypos += 1;
            if (placingPiece[i].ypos >= GAME_BOARD_HEIGHT) placingPiece[i].ypos = GAME_BOARD_HEIGHT;
        }
        
        redrawAllBlocks()
    }
    
    else {
        
        //place the piece and get us another one
        //addPiece() will take care of unloading the current piece
        // If the escape key is pressed, end the loop.
        if (keepPlaying) {
            addPiece();
        }
    }
    
    
    
    return true;
}

function redrawAllBlocks(){
    
    myGameArea.clear();
    
    context = myGameArea.context;
    
    for (var i = 0; i < placingPiece.length; i++) {
        context.fillStyle = placingPiece[i].color;
        context.fillRect(
            placingPiece[i].xpos * blockSizeXpx, 
            placingPiece[i].ypos * blockSizeYpx, 
            placingPiece[i].blockWidth, 
            placingPiece[i].blockHeight);
    }
    
    for(var i = 0; i < placedPieces.length; i++){
        context.fillStyle = placedPieces[i].color;
        context.fillRect(placedPieces[i].xpos * blockSizeXpx, 
        placedPieces[i].ypos * blockSizeYpx, 
        placedPieces[i].blockWidth, 
        placedPieces[i].blockHeight);
    }
    
    //draw the score at the top
    context.fillStyle = "black";
    context.font = "45px Arial";
    context.fillText(score, 25, 50, GAME_WIDTHpx);
}


function movePieceRight(){
    
    var blockToRight = false;
    
    for (var i = 0; i < placingPiece.length && !blockToRight; i++) {
        if (placingPiece[i].xpos + 1 >= GAME_BOARD_WIDTH) {
            
            //we're going to hit the left side wall
            blockToRight = true;
            break;
        } 
        
        else {
            //we're going to hit another block that is on the left
            for (var j = 0; j < placedPieces.length; j++) {
                
                if (placedPieces[j].xpos == placingPiece[i].xpos + 1 
                    && placedPieces[j].ypos == placingPiece[i].ypos) {
                        
                    //there's a block to the left of us
                    blockToRight = true;
                    break;
                }
            }
        }
    }
    
    if(!blockToRight){
        for(var i = 0; i < placingPiece.length; i++){
            placingPiece[i].xpos += 1;
        }
        redrawAllBlocks()
    }
}

function movePieceLeft(){
    var blockToLeft = false;
    
    for (var i = 0; i < placingPiece.length && !blockToLeft; i++) {
        if (placingPiece[i].xpos - 1 < 0) {
            //we're going to hit the left side wall
            blockToLeft = true;
            break;
        } 
        
        else {
            //we're going to hit another block that is on the left
            for (var j = 0; j < placedPieces.length; j++) {
                
                if(placedPieces[j].xpos == placingPiece[i].xpos - 1 && placedPieces[j].ypos == placingPiece[i].ypos){
                    //there's a block to the left of us
                    blockToLeft = true;
                    break;
                }
            }
        }
    }
    
    if (!blockToLeft) {
        
        for(var i = 0; i < placingPiece.length; i++){
            placingPiece[i].xpos -= 1;
        }
        
        redrawAllBlocks()
    }
}

function rotatePiece(){
    //The coords of the top leftmost spot, there may not be a piece here, but it's the top left corner
    var topXCoord = GAME_BOARD_WIDTH;
    var topYCoord = GAME_BOARD_HEIGHT;
    
    //The coords of the bottom rightmost spot
    //var botXCoord = 0;
    var botYCoord = 0;
    for (var i = 0; i < placingPiece.length; i++){
        if (placingPiece[i].xpos < topXCoord){
            topXCoord = placingPiece[i].xpos;
        }
        
        if (placingPiece[i].ypos < topYCoord) {
            topYCoord = placingPiece[i].ypos;
        }
        
        /*if(placingPiece[i].xpos > botXCoord){
            botXCoord = placingPiece[i].xpos;
        }*/
        
        if (placingPiece[i].ypos > botYCoord) {
            botYCoord = placingPiece[i].ypos;
        }
    }
    
    var height = Math.abs(botYCoord - topYCoord);
    
    for (var i = 0; i < placingPiece.length; i++) {
        
        var newXPos = height - (placingPiece[i].ypos - topYCoord) + topXCoord;
        placingPiece[i].ypos = (placingPiece[i].xpos - topXCoord) + topYCoord;
        placingPiece[i].xpos = newXPos;
        
    }
    
    redrawAllBlocks()
}

function dropPiece() {
    if (!(spacebarPressed)) {
        spacebarPressed = true;
        dropInterval = setInterval(oneDownPiece, 5);    
    }
}

function oneDownPiece(){
    
    var blockBelow = false;
    
    for (var i = 0; i < placingPiece.length && !blockBelow; i++) {
        
        if (placingPiece[i].ypos + 1 >= GAME_BOARD_HEIGHT) {
            //we're going to hit the floor!
            blockBelow = true;
            break;
        } 
        
        else {
            //let's check if there's another block below us that is placed already
            for (var j = 0; j < placedPieces.length; j++) {
                if (placedPieces[j].xpos == placingPiece[i].xpos 
                    && placedPieces[j].ypos == placingPiece[i].ypos + 1) {
                    //there's a block below us
                    blockBelow = true;
                    break;
                }
            }
        }
    }
    
    if (!blockBelow) {
        for ( var i = 0; i < placingPiece.length; i++) {
            placingPiece[i].ypos += 1;
        } 
        
        redrawAllBlocks()
        
    } else {
        //place the piece and get us another one
        //addPiece() will take care of unloading the current piece
        // If the escape is pressed, end the loop.
        if (keepPlaying) {
            addPiece();
        }
    }
    
    redrawAllBlocks()
}