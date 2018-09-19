
var GAME_WIDTHpx = 480;
var GAME_HEIGHTpx = 720;
var GAME_BOARD_WIDTH = 20;
var GAME_BOARD_HEIGHT = 35;

var blockSizeXpx = (GAME_WIDTHpx / GAME_BOARD_WIDTH);
var blockSizeYpx = (GAME_HEIGHTpx / GAME_BOARD_HEIGHT);
var centerTopBlockpx = (GAME_BOARD_WIDTH / 2) * blockSizeXpx;

var dropInterval; //used for the drop by the spacebar
var lastColor = "red";

var placingPiece = [];
var placedPieces = [];


function test(){
    myGameArea.start();
    
    setInterval(moveDownPlacingPiece, 500);
    
    
    document.getElementById("startButton").hidden = true;
    
    window.addEventListener("keypress", function(event){
        
        const key = event.keyCode;
        if(key == 27){
            //escape pressed
        }else if(key == 32){
            //space
            dropPiece();
        }else if(key == 65 || key == 37 || key == 97){
            //a or left
            movePieceLeft();
        }else if(key == 68 || key == 39 || key == 100){
            //d or right
            movePieceRight();
        }else if(key == 83 || key == 40 || key == 115){
            //s or down
            oneDownPiece();
        }else if(key == 87 || key == 38 || key == 119){
            //w or up
            rotatePiece();
        }
        
    });
    
    
    addPiece();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = GAME_WIDTHpx;
        this.canvas.height = GAME_HEIGHTpx;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
    getContext : function(){
        return this.context;
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

/*moves down the piece being placed by 1 */
function moveDownPlacingPiece(){
    
    var cantGoDownNoMore = false;
    /*
    //check if the floor is beneath us
    for(var i = 0; i < placingPiece.length; i++){
        if(placingPiece[i].ypos * blockSizeYpx + blockSizeYpx * 2 > GAME_HEIGHTpx){
            cantGoDownNoMore = true;
            break;
        }
        
    }
    //check if any other blocks are directly beneath us
    for(var i = 0; i < placingPiece.length && !cantGoDownNoMore; i++){
        //coords of the block below us:
        var x = placingPiece[i].xpos;
        var y = placingPiece[i].ypos + blockSizeYpx;
        
        //make sure it's not one of our own pieces:
        for(var j = 0; j < placingPiece.length; j++){
            if(i == j) continue;
            if(placingPiece[j].x - x < .01 && placingPiece[j].y - y < .01){
                //it's ourself, no worries
            }
        }
        
        //now we check if it's another block:
        for(var j = 0; j < placedPieces.length; j++){
            if(placedPieces[j].x - x < .01 && placedPieces[j].y - y < .01){
                //a piece is below us!
                cantGoDownNoMore = true;
            }
        }
    }*/
    
    if(!cantGoDownNoMore){
        for(var i = 0; i < placingPiece.length; i++){
            placingPiece[i].ypos += 1;
            if(placingPiece[i].ypos >= GAME_BOARD_HEIGHT) placingPiece[i].ypos = GAME_BOARD_HEIGHT;
           
        }
        redrawAllBlocks()
    }else{
        //place the piece and get us another one
        //addPiece() will take care of unloading the current piece
        addPiece();
    }
    
    
    
    return true;
}

function redrawAllBlocks(){
    
    myGameArea.clear();
    
    context = myGameArea.context;
    
    for(var i = 0; i < placingPiece.length; i++){
        context.fillStyle = placingPiece[i].color;
        context.fillRect(placingPiece[i].xpos * blockSizeXpx, placingPiece[i].ypos * blockSizeYpx, placingPiece[i].blockWidth, placingPiece[i].blockHeight);
    }
    
    
    for(var i = 0; i < placedPieces.length; i++){
        context.fillStyle = placedPieces[i].color;
        context.fillRect(placedPieces[i].xpos * blockSizeXpx, placedPieces[i].ypos * blockSizeYpx, placedPieces[i].blockWidth, placedPieces[i].blockHeight);
    }
}

function addPiece(){
    //if this was done by the spacebar method
    clearInterval(dropInterval);
    
    //move the currently fooling around with pieces to the non moving array
    while(placingPiece.length > 0){
        placedPieces.push(placingPiece[0]);
        placingPiece.splice(0, 1);
    }
    
    //create our new piece
    
    var colors = ["red", "blue", "green", "purple", "orange"];
    
    var type = Math.floor(Math.random() * 7);
    
    var color = lastColor;
    while(color == lastColor){
       color = colors[Math.floor(Math.random() * colors.length)];
    }
    lastColor = color;
    
    var centerBlock = GAME_BOARD_WIDTH / 2;
    
    
    if(type == 0){
        //4 x 1
        placingPiece.push(new block(centerBlock - 1, 0, color));
        placingPiece.push(new block(centerBlock, 0, color));
        placingPiece.push(new block(centerBlock + 1, 0, color));
        placingPiece.push(new block(centerBlock + 2, 0, color));
        
    }else if(type == 1){
        //2 x 2
        placingPiece.push(new block(centerBlock - 1, 0, color));
        placingPiece.push(new block(centerBlock, 0, color));
        placingPiece.push(new block(centerBlock - 1, 1, color));
        placingPiece.push(new block(centerBlock, 1, color));
    }else if(type == 2){
        // L
        placingPiece.push(new block(centerBlock, 0, color));
        placingPiece.push(new block(centerBlock, 1, color));
        placingPiece.push(new block(centerBlock, 2, color));
        placingPiece.push(new block(centerBlock + 1, 2, color));
    }
    else if(type == 3){
        // opposite L
        placingPiece.push(new block(centerBlock, 0, color));
        placingPiece.push(new block(centerBlock, 1, color));
        placingPiece.push(new block(centerBlock, 2, color));
        placingPiece.push(new block(centerBlock - 1, 2, color));
    }
    else if(type == 4){
        // T
        placingPiece.push(new block(centerBlock, 0, color));
        placingPiece.push(new block(centerBlock + 1, 1, color));
        placingPiece.push(new block(centerBlock, 1, color));
        placingPiece.push(new block(centerBlock - 1, 1, color));
    }
    else if(type == 5){
        // -|_
        placingPiece.push(new block(centerBlock, 0, color));
        placingPiece.push(new block(centerBlock - 1, 0, color));
        placingPiece.push(new block(centerBlock, 1, color));
        placingPiece.push(new block(centerBlock + 1, 1, color));
    }else{
        // _|-
        placingPiece.push(new block(centerBlock, 0, color));
        placingPiece.push(new block(centerBlock + 1, 0, color));
        placingPiece.push(new block(centerBlock, 1, color));
        placingPiece.push(new block(centerBlock - 1, 1, color));
    }
    
    /*
    //check if there is a full line completed
    for(var i = GAME_BOARD_HEIGHT - 1; i >= 0; i--){
        for(var j = 0; j < GAME_BOARD_WIDTH; j++){
            
        }
    }*/
}

function movePieceRight(){
    
    var farthestRightPiecepx = 0;
    for(var i = 0; i < placingPiece.length; i++){
        if(placingPiece[i].xpos * blockSizeXpx> farthestRightPiecepx) farthestRightPiecepx = placingPiece[i].xpos * blockSizeXpx;
    }
    
    if(farthestRightPiecepx + blockSizeXpx < GAME_WIDTHpx){
        for(var i = 0; i < placingPiece.length; i++){
            placingPiece[i].xpos += 1; //move it right
        }
        redrawAllBlocks()
    }
}

function movePieceLeft(){
    
    var farthestLeftPiece = GAME_WIDTHpx;
    
    for(var i = 0; i < placingPiece.length; i++){
        if(placingPiece[i].xpos * blockSizeXpx < farthestLeftPiece) farthestLeftPiece = placingPiece[i].xpos * blockSizeXpx;
    }
    
    if(farthestLeftPiece - blockSizeXpx >= 0){
        for(var i = 0; i < placingPiece.length; i++){
            placingPiece[i].xpos -= 1;
        }
        redrawAllBlocks()
    }
    
    
}

function rotatePiece(){
    
}

function dropPiece(){
    dropInterval = setInterval(oneDownPiece, 10);
}

function oneDownPiece(){
    
    var cantGoDownNoMore = false;
    /*
    //check if the floor is beneath us
    for(var i = 0; i < placingPiece.length; i++){
        if(placingPiece[i].y + blockSizeYpx * 2> GAME_HEIGHTpx){
            cantGoDownNoMore = true;
            break;
        }
        
    }
    //check if any other blocks are directly beneath us
    for(var i = 0; i < placingPiece.length && !cantGoDownNoMore; i++){
        //coords of the block below us:
        var x = placingPiece[i].x;
        var y = placingPiece[i].y + blockSizeYpx;
        
        //make sure it's not one of our own pieces:
        for(var j = 0; j < placingPiece.length; j++){
            if(i == j) continue;
            if(placingPiece[j].x - x < .01 && placingPiece[j].y - y < .01){
                //it's ourself, no worries
            }
        }
        
        //now we check if it's another block:
        for(var j = 0; j < placedPieces.length; j++){
            if(placedPieces[j].x - x < .01 && placedPieces[j].y - y < .01){
                //a piece is below us!
                cantGoDownNoMore = true;
            }
        }
    }*/
    
    if(!cantGoDownNoMore){
        for(var i = 0; i < placingPiece.length; i++){
            placingPiece[i].ypos += 1;
        }
        redrawAllBlocks()
    }else{
        //place the piece and get us another one
        //addPiece() will take care of unloading the current piece
        addPiece();
    }
    
    redrawAllBlocks()
}