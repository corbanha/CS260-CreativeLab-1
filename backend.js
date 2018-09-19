
var GAME_WIDTH = 480;
var GAME_HEIGHT = 720;
var GAME_BOARD_WIDTH = 20;
var GAME_BOARD_HEIGHT = 35;

var blockSizeX = (GAME_WIDTH / GAME_BOARD_WIDTH);
var blockSizeY = (GAME_HEIGHT / GAME_BOARD_HEIGHT);
var centerTopBlock = (GAME_BOARD_WIDTH / 2) * blockSizeX;

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
        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;
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
    this.blockWidth = GAME_WIDTH / GAME_BOARD_WIDTH;
    this.blockHeight = GAME_HEIGHT / GAME_BOARD_HEIGHT;
    this.x = x;
    this.y = y;
    this.color = color;
    
    //context = myGameArea.getContext();
    //context.fillStyle = this.color;
    //context.fillRect(this.x, this.y, this.blockWidth, this.blockHeight);
    return this;
}

/*moves down the piece being placed by 1 */
function moveDownPlacingPiece(){
    
    var cantGoDownNoMore = false;
    //check if the floor is beneath us
    for(var i = 0; i < placingPiece.length; i++){
        if(placingPiece[i].y + blockSizeY * 2> GAME_HEIGHT){
            cantGoDownNoMore = true;
            break;
        }
        
    }
    //check if any other blocks are directly beneath us
    for(var i = 0; i < placingPiece.length && !cantGoDownNoMore; i++){
        //coords of the block below us:
        var x = placingPiece[i].x;
        var y = placingPiece[i].y + blockSizeY;
        
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
    }
    
    
    
    
    if(!cantGoDownNoMore){
        for(var i = 0; i < placingPiece.length; i++){
            placingPiece[i].y += placingPiece[i].blockHeight;
            if(placingPiece[i].y >= GAME_HEIGHT) placingPiece[i].y = GAME_HEIGHT;
           
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
        context.fillRect(placingPiece[i].x, placingPiece[i].y, placingPiece[i].blockWidth, placingPiece[i].blockHeight);
    }
    
    
    for(var i = 0; i < placedPieces.length; i++){
        context.fillStyle = placedPieces[i].color;
        context.fillRect(placedPieces[i].x, placedPieces[i].y, placedPieces[i].blockWidth, placedPieces[i].blockHeight);
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
    
    
    if(type == 0){
        //4 x 1
        placingPiece.push(new block(centerTopBlock - blockSizeX, 0, color));
        placingPiece.push(new block(centerTopBlock, 0, color));
        placingPiece.push(new block(centerTopBlock + blockSizeX, 0, color));
        placingPiece.push(new block(centerTopBlock + blockSizeX * 2, 0, color));
        
    }else if(type == 1){
        //2 x 2
        placingPiece.push(new block(centerTopBlock - blockSizeX, 0, color));
        placingPiece.push(new block(centerTopBlock, 0, color));
        placingPiece.push(new block(centerTopBlock - blockSizeX, blockSizeY, color));
        placingPiece.push(new block(centerTopBlock, blockSizeY, color));
    }else if(type == 2){
        // L
        placingPiece.push(new block(centerTopBlock, 0, color));
        placingPiece.push(new block(centerTopBlock, blockSizeY, color));
        placingPiece.push(new block(centerTopBlock, blockSizeY * 2, color));
        placingPiece.push(new block(centerTopBlock + blockSizeX, blockSizeY * 2, color));
    }
    else if(type == 3){
        // opposite L
        placingPiece.push(new block(centerTopBlock, 0, color));
        placingPiece.push(new block(centerTopBlock, blockSizeY, color));
        placingPiece.push(new block(centerTopBlock, blockSizeY * 2, color));
        placingPiece.push(new block(centerTopBlock - blockSizeX, blockSizeY * 2, color));
    }
    else if(type == 4){
        // T
        placingPiece.push(new block(centerTopBlock, 0, color));
        placingPiece.push(new block(centerTopBlock + blockSizeX, blockSizeY, color));
        placingPiece.push(new block(centerTopBlock, blockSizeY, color));
        placingPiece.push(new block(centerTopBlock - blockSizeX, blockSizeY, color));
    }
    else if(type == 5){
        // -|_
        placingPiece.push(new block(centerTopBlock, 0, color));
        placingPiece.push(new block(centerTopBlock - blockSizeX, 0, color));
        placingPiece.push(new block(centerTopBlock, blockSizeY, color));
        placingPiece.push(new block(centerTopBlock + blockSizeX, blockSizeY, color));
    }else{
        // _|-
        placingPiece.push(new block(centerTopBlock, 0, color));
        placingPiece.push(new block(centerTopBlock + blockSizeX, 0, color));
        placingPiece.push(new block(centerTopBlock, blockSizeY, color));
        placingPiece.push(new block(centerTopBlock - blockSizeX, blockSizeY, color));
    }
    
    /*
    //check if there is a full line completed
    for(var i = GAME_BOARD_HEIGHT - 1; i >= 0; i--){
        for(var j = 0; j < GAME_BOARD_WIDTH; j++){
            
        }
    }*/
}

function movePieceRight(){
    
    var farthestRightPiece = 0;
    for(var i = 0; i < placingPiece.length; i++){
        if(placingPiece[i].x > farthestRightPiece) farthestRightPiece = placingPiece[i].x;
    }
    
    if(farthestRightPiece + blockSizeX < GAME_WIDTH){
        for(var i = 0; i < placingPiece.length; i++){
            placingPiece[i].x += blockSizeX;
        }
        redrawAllBlocks()
    }
}

function movePieceLeft(){
    
    var farthestLeftPiece = GAME_WIDTH;
    
    for(var i = 0; i < placingPiece.length; i++){
        if(placingPiece[i].x < farthestLeftPiece) farthestLeftPiece = placingPiece[i].x;
    }
    
    if(farthestLeftPiece - blockSizeX >= 0){
        for(var i = 0; i < placingPiece.length; i++){
            placingPiece[i].x -= blockSizeX;
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
    //check if the floor is beneath us
    for(var i = 0; i < placingPiece.length; i++){
        if(placingPiece[i].y + blockSizeY * 2> GAME_HEIGHT){
            cantGoDownNoMore = true;
            break;
        }
        
    }
    //check if any other blocks are directly beneath us
    for(var i = 0; i < placingPiece.length && !cantGoDownNoMore; i++){
        //coords of the block below us:
        var x = placingPiece[i].x;
        var y = placingPiece[i].y + blockSizeY;
        
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
    }
    
    if(!cantGoDownNoMore){
        for(var i = 0; i < placingPiece.length; i++){
            placingPiece[i].y += blockSizeY;
        }
        redrawAllBlocks()
    }else{
        //place the piece and get us another one
        //addPiece() will take care of unloading the current piece
        addPiece();
    }
    
    redrawAllBlocks()
}