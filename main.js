var canvasSize = 0;
var canvas;
var gridSize;
var ctx;
var boardW = [];
var boardB = [];
var round = 0;
var pieceScore = [1,3,3,3,10,100];

function init(){
    //set canvas
    var sw = window.innerWidth-20;
    var sh = window.innerHeight-20;
    if (sw > sh){
        canvasSize = sh
    }else{
        canvasSize = sw
    }
    gridSize = canvasSize/8
    canvas = document.getElementById("chessBoard");
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    
    //make piece images
    let tfp = "images/white/" //temp file path
    var pawnW = new Image();//0
    pawnW.src = tfp+'pawn.png';
    var rookW = new Image();//1
    rookW.src = tfp+'rook.png';
    var knightW = new Image();//2
    knightW.src = tfp+'knight.png';
    var bishopW = new Image();//3
    bishopW.src = tfp+'bishop.png';
    var queenW = new Image();//4
    queenW.src = tfp+'queen.png';
    var kingW = new Image();//5
    kingW.src = tfp+'king.png';
    
    whitePieces = [pawnW, rookW, knightW, bishopW, queenW, kingW];
    
    tfp = "images/black/"
    var pawnB = new Image();//0
    pawnB.src = tfp+'pawn.png';
    var rookB = new Image();//1
    rookB.src = tfp+'rook.png';
    var knightB = new Image();//2
    knightB.src = tfp+'knight.png';
    var bishopB = new Image();//3
    bishopB.src = tfp+'bishop.png';
    var queenB = new Image();//4
    queenB.src = tfp+'queen.png';
    var kingB = new Image();//5
    kingB.src = tfp+'king.png';
    
    blackPieces = [pawnB, rookB, knightB, bishopB, queenB, kingB];
    
    //board
    boardW = [
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [ 0,  0,  0,  0,  0,  0,  0,  0],
        [ 1,  2,  3,  4,  5,  3,  2,  1]
    ]
    boardB = [
        [ 1,  2,  3,  4,  5,  3,  2,  1],
        [ 0,  0,  0,  0,  0,  0,  0,  0],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1], 
    ]
}

function drawChecker(){
    let cc = "#ffffe6";
    for (let y=0; y<8; y++){
        for (let x=0; x<8; x++){
            ctx.beginPath();
            ctx.fillStyle = cc;
            ctx.fillRect(x*gridSize, y*gridSize, gridSize, gridSize);
            ctx.stroke();
            if(x != 7){
                if(cc == "#ffffe6"){
                    cc = "#1f7a1f";
                }else{
                    cc = "#ffffe6";
                }
            }
        }
    }
}

function drawWall(s){
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.rect(0, 0, s, s);
    ctx.stroke();
};

function drawGrid(){
    ctx.fillStyle = "#000000";
    ctx.lineWidth = 1;
    for (let i=0; i<9; i++){
        lx = i*gridSize;
        ly = i*gridSize;
        if (i==0){
            lx += 1
            ly += 1
        }
        if (i==8){
            lx -= 1
            ly -= 1
        }
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, canvasSize);
        ctx.stroke();
        

        ctx.beginPath();
        ctx.moveTo(0, ly);
        ctx.lineTo(canvasSize, ly);
        ctx.stroke();
    };
};

//make a piece class and loop thru all that and call draw method in each?
function drawPieces(){  
    let es = 10; //edge size
    for (let x=0; x<8; x++){
        for (let y=0; y<8; y++){
            if(boardW[y][x] != -1){
                ctx.drawImage(whitePieces[boardW[y][x]], x*gridSize+es, y*gridSize+es, gridSize-es*2, gridSize-es*2);
            }
            if(boardB[y][x] != -1){
                ctx.drawImage(blackPieces[boardB[y][x]], x*gridSize+es, y*gridSize+es, gridSize-es*2, gridSize-es*2);
            }
        };
    };
};

function updateBoard(){
    drawChecker();
    drawGrid();
    drawPieces();
};

function getRandomInt(n){
    return Math.floor(Math.random() * Math.floor(n))
}

function movableLoc(x, y, side, mbl=[], ebl=[]){
    var mbl, ebl, t, ml, cx, cy;
    
    if(mbl.length == 0){
        if(side == "w"){
            mbl = boardW;
            ebl = boardB;
        }else{
            mbl = boardB;
            ebl = boardW;
        }
    }
    
    t = mbl[y][x]
    ml = [] //movable location
    
    if(t == 0){//pawn
        if(side=="w"){
            if(y==0){ return ml };
            if(ebl[y-1][x]==-1 && mbl[y-1][x]==-1){ ml.push([x, y-1]) }; //direct front
            if(x>0 && ebl[y-1][x-1]!=-1){ ml.push([x-1, y-1]) } //left
            if(x<7 && ebl[y-1][x+1]!=-1){ ml.push([x+1, y-1]) } //right
            if(y==6){
                if(ebl[y-2][x]==-1 && mbl[y-2][x]==-1){ ml.push([x, y-2]) }; //2 front
            }
        }else{
            if(y==7){ return ml };
            if(ebl[y+1][x]==-1 && mbl[y+1][x]==-1){ ml.push([x, y+1]) };
            if(x>0 && ebl[y+1][x-1]!=-1){ ml.push([x-1, y+1]) }
            if(x<7 && ebl[y+1][x+1]!=-1){ ml.push([x+1, y+1]) }
            if(y==1){
                if(ebl[y+2][x]==-1 && mbl[y+2][x]==-1){ ml.push([x, y+2]) }; //2 front
            }
        }
    }
    
    if(t == 1 || t == 4){//rook or queen
        //up
        cx = x;
        cy = y-1;
        while(cy>-1 && mbl[cy][cx]==-1){//while current check location y >-1 and currect loc of my board is empty
            if(ebl[cy][cx]!=-1){//if theres enemy in currect check loc
                ml.push([cx, cy]); //add curect loc to movable loc and stop this loop
                break;
            }else{ ml.push([cx, cy]) }//if empty add loc to movable loc
            cy--; //move
        }
        //down
        cy = y+1;
        while(cy<8 && mbl[cy][cx]==-1){
            if(ebl[cy][cx]!=-1){
                ml.push([cx, cy]);
                break;
            }else{ ml.push([cx, cy]) }
            cy++;
        }
        //left
        cx = x-1;
        cy = y;
        while(cx>-1 && mbl[cy][cx]==-1){
            if(ebl[cy][cx]!=-1){
                ml.push([cx, cy]);
                break;
            }else{ ml.push([cx, cy]) }
            cx--;
        }
        //right
        cx = x+1;
        cy = y;
        while(cx<8 && mbl[cy][cx]==-1){
            if(ebl[cy][cx]!=-1){
                ml.push([cx, cy]);
                break;
            }else{ ml.push([cx, cy]) }
            cx++;
        }
    }
    
    if(t == 2 || t == 5){//knight
        var kml;
        if(t == 2){
            kml = [
            [-2,-1], [-2,1],
            [-1,2], [1,2],
            [2,1], [2,-1],
            [-1,-2], [1,-2]]; //[y,x]
        }else{
            kml = [
            [-1,-1], [-1,0], [-1,1],
            [0,1],
            [1,1], [1,0], [1,-1],
            [0,-1]];
        }
        kml.forEach(d => {
            try { if(mbl[y+d[0]][x+d[1]]==-1 ){ ml.push([x+d[1], y+d[0]]) } }catch(e){};
        });
    }
    
    if(t == 3 || t == 4){//bishop or queen
        //left up
        cx = x-1;
        cy = y-1;
        while(cy>-1 && cx>-1 && mbl[cy][cx]==-1){
            if(ebl[cy][cx]!=-1){
                ml.push([cx, cy]);
                break;
            }else{ ml.push([cx, cy]) }
            cx--;
            cy--;
        }
        //right up
        cx = x+1;
        cy = y-1;
        while(cy>-1 && cx<8 && mbl[cy][cx]==-1){
            if(ebl[cy][cx]!=-1){
                ml.push([cx, cy]);
                break;
            }else{ ml.push([cx, cy]) }
            cx++;
            cy--;
        }
        //right down
        cx = x+1;
        cy = y+1;
        while(cy<8 && cx<8 && mbl[cy][cx]==-1){
            if(ebl[cy][cx]!=-1){
                ml.push([cx, cy]);
                break;
            }else{ ml.push([cx, cy]) }
            cx++;
            cy++;
        }
        //left down
        cx = x-1;
        cy = y+1;
        while(cy<8 && cx>-1 && mbl[cy][cx]==-1){
            if(ebl[cy][cx]!=-1){
                ml.push([cx, cy]);
                break;
            }else{ ml.push([cx, cy]) }
            cx--;
            cy++;
        }
    }
    return ml
}

function genScore(ox, oy, nx, ny, side){
    var mbl, ebl, score, gs, ls, eSide, ml;

    if(side == "w"){
        mbl = JSON.parse(JSON.stringify(boardW));
        ebl = JSON.parse(JSON.stringify(boardB));
        eSide = "b";
    }else{
        mbl = JSON.parse(JSON.stringify(boardB));
        ebl = JSON.parse(JSON.stringify(boardW));
        eSide = "w";
    }
    
    gs = 0 //gained score
    if(ebl[ny][nx] != -1){ gs = pieceScore[ebl[ny][nx]]; }
    
    mbl[ny][nx] = mbl[oy][ox];
    mbl[oy][ox] = -1;
    ebl[ny][nx] = -1;
    
    ls = 0
    score = -999;
    var tx, ty, tt
    for (let y=0; y<8; y++){
        for (let x=0; x<8; x++){
            ml = movableLoc(x, y, eSide, ebl, mbl);
            if(ml.length > 0){
                ml.forEach(mli => {
                    cs = 0;
                    op = mbl[mli[1]][mli[0]]
                    if(op != -1){ cs = pieceScore[op] };
                    if(cs > score){
                        score = cs;
                        tx = x
                        ty = y
                    }
                })
            }
        }
    }
    ls = score;
    //console.log("gs:"+gs, "("+nx+","+ny+")");
    //console.log("ls:"+ls, "("+tx+","+ty+")");
    return gs-ls;
}

function moveCPU(side){
    console.log("moveCPU current side:" + side)
    //mbl my board list, ebl enemy board list
    var x = getRandomInt(8);
    var y = getRandomInt(8);
    //let j = 0
    var ml;
    var score = -999;
    var nx = [];
    var ny = [];
    var ox = [];
    var oy = [];
    
    var op; //obtainedpiece
    var cs = 0;
    
    var test1 = 0
    for (let y=0; y<8; y++){
        for (let x=0; x<8; x++){
            ml = movableLoc(x, y, side);
            if(ml.length > 0){
                test1++;
                var localBestScore = -999;
                ml.forEach(mli => {
                    cs = genScore(x, y, mli[0], mli[1], side);
                    if(cs >= score){
                        if(cs>score){
                            nx = [];
                            ny = [];
                            ox = [];
                            oy = [];
                        }
                        score = cs;
                        nx.push(mli[0]);
                        ny.push(mli[1]);
                        ox.push(x);
                        oy.push(y);
                    }
                    if(cs>localBestScore){ localBestScore = cs}
                })
                console.log("n:"+test1+" ("+x+", "+y+") score:"+localBestScore);
            }
        }
    }
    console.log("score: "+score)
    console.log(nx,ny)

    let tn = getRandomInt(nx.length);
    nx = nx[tn];
    ny = ny[tn];
    ox = ox[tn];
    oy = oy[tn];
    if(side == "w"){
        boardW[ny][nx] = boardW[oy][ox];
        boardW[oy][ox] = -1;
        boardB[ny][nx] = -1;
    }else{
        boardB[ny][nx] = boardB[oy][ox];
        boardB[oy][ox] = -1;
        boardW[ny][nx] = -1;
    }
    updateBoard();
    
    //later, make it so check every single grid and choose one with best score after it checked every piece(location)
    //
}

var lastml = [];
var clickedX = 0;
var clickedY = 0;
document.onclick = function(){
    //if(lastMoved == "w"){ return };
    //moveCPU();
    //updateBoard();
    var r = getMousePos(canvas, event);
    var x = r[0]
    var y = r[1]
    var side;
    var t;
    var ml;
    x = Math.floor(x/gridSize)
    y = Math.floor(y/gridSize)
    console.log(x, y)
    if(boardW[y][x] != -1){
        side = "w"
        t = boardW[y][x]
    }else if(boardB[y][x] != -1){
        side = "b"
        t = boardB[y][x]
    }
    
    if(lastml.find(mli => mli[0] == x && mli[1] == y)){
        boardW[y][x] = boardW[clickedY][clickedX];
        boardW[clickedY][clickedX] = -1;
        boardB[y][x] = -1;
        updateBoard();
        lastml = [];
        lastMoved = "w";
        
        setTimeout(function(){
            moveCPU("b")
            lastmoved = "b";
        }, 500)
    }else{
        console.log("not in lastml")
        ml = movableLoc(x, y, "w")
        lastml = ml;
        clickedX = x;
        clickedY = y;
        console.log(lastml)
    }
    /*
    var cs = 0;
    var score = 0;
    ml = movableLoc(x, y, side)//.map(list => [list[0]-x, list[1]-y])
    console.log(ml)
    ml.forEach(mli => {
        cs = genScore(x, y, mli[0], mli[1], side);
        if(cs >= score){
            score = cs;
        }
    })
    console.log(score);
    */
}
var oldBoardW = [];
var oldBoardB = [];
var playingSideSave = [];

var lastMoved = "b"
document.onkeydown = function(event){
    e = event.key;
    //console.log(e)
    if(e == "ArrowUp"){
        oldBoardW.push(JSON.parse(JSON.stringify(boardW)));
        oldBoardB.push(JSON.parse(JSON.stringify(boardB)));
        playingSideSave.push(lastMoved);
        if(lastMoved == "w"){
            try { moveCPU("b") }catch(e){ moveCPU("w") };
            lastMoved = "b";
        }else{
            try { moveCPU("w"); }catch(e){ moveCPU("b") };
            lastMoved = "w";
        }
        updateBoard();
        round++;
        console.log("####### round " + round + " finished #########")
        //console.log(boardW);
        //console.log(oldBoardW);
    }
    if(e == "ArrowDown"){
        let lp = oldBoardW.length-1;
        if(lp>-1){
            boardW = JSON.parse(JSON.stringify(oldBoardW[lp]));
            boardB = JSON.parse(JSON.stringify(oldBoardB[lp]));
            lastMoved = playingSideSave[lp];
            round = lp;
            oldBoardW.pop();
            oldBoardB.pop();
            playingSideSave.pop();
            updateBoard();
            console.log("restored round:"+lp)
        }
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return [evt.clientX - rect.left, evt.clientY - rect.top]
}


init();
window.onload = function(){
    updateBoard();
    //setInterval(moveCPU, 1000);
    //moveCPU();
}

function moveCPUold1(side){
    console.log("moveCPU current side:" + side)
    //mbl my board list, ebl enemy board list
    var x = getRandomInt(8);
    var y = getRandomInt(8);
    //let j = 0
    var ml;
    var score = 0;
    var pieceScore = [1,3,3,3,10,100];
    var nx = [];
    var ny = [];
    var ox = [];
    var oy = [];
    
    var op; //obtainedpiece
    var cs = 0;
    
    var test1 = 0
    for (let y=0; y<8; y++){
        for (let x=0; x<8; x++){
            //console.log(x, y)
            ml = movableLoc(x, y, side);
            //console.log(x, y, ml);
            if(ml.length > 0){
                test1++;
                ml.forEach(mli => {
                    cs = 0;
                    if(side == "w"){
                        op = boardB[mli[1]][mli[0]]
                    }else{
                        op = boardW[mli[1]][mli[0]]
                    }
                    if(op != -1){ cs = pieceScore[op] };
                    if(cs >= score){
                        if(cs>score){
                            nx = [];
                            ny = [];
                            ox = [];
                            oy = [];
                        }
                        score = cs;
                        nx.push(mli[0]);
                        ny.push(mli[1]);
                        ox.push(x);
                        oy.push(y);
                    }
                })
                //console.log("n:"+test1+" ("+x+", "+y+") score:"+cs);
            }
        }
    }
    console.log("score: "+score)
    console.log(nx,ny)

    let tn = getRandomInt(nx.length);
    nx = nx[tn];
    ny = ny[tn];
    ox = ox[tn];
    oy = oy[tn];
    if(side == "w"){
        boardW[ny][nx] = boardW[oy][ox];
        boardW[oy][ox] = -1;
        boardB[ny][nx] = -1;
    }else{
        boardB[ny][nx] = boardB[oy][ox];
        boardB[oy][ox] = -1;
        boardW[ny][nx] = -1;
    }
    updateBoard();
}


// ###old way to choose move - check random grid and choose first one that can move
//console.log("test1:"+test1)
/*
while(true && j<1000){
    j++;
    x = getRandomInt(8);
    y = getRandomInt(8);
    //if(boardW[y][x]!=-1 && y!=0 && boardW[y-1][x]==-1){ break };
    if(side == "w"){
        if(boardW[y][x] == -1){ continue }; 
    }else{
        if(boardB[y][x] == -1){ continue }; 
    }   
    ml = movableLoc(x, y);
    if(ml.length > 0){ break };
}
console.log(ml);
console.log(y, x)
let mo = getRandomInt(ml.length);
nx = ml[mo][0]
ny = ml[mo][1]
*/