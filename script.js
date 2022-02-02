// 7 0 1
// 6 - 2
// 5 4 3
const typeToAngle = {1:-0.25*Math.PI,2:0,3:0.25*Math.PI,5:0.75*Math.PI,6:Math.PI,7:-0.75*Math.PI};
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

var board = [];
var walls = [];
const gridHeight = 60;
const gridWidth = 200;
const particleSize = 5;
const particleAmount = 6000;
const vectorRes = [20,100];
var animationLoop;
var mouseDown = false;
var firstTime = true;

canvas.width = gridWidth * particleSize;
canvas.height = gridHeight * particleSize;

function startListening(){
    canvas.addEventListener('mousedown',({offsetX,offsetY})=>{
        let row = Math.floor(offsetY/particleSize);
        let colm = Math.floor(offsetX/particleSize);
        mouseDown = true;
        // addWaterCube(row,colm)
        // board[Math.floor(offsetY/particleSize)][Math.floor(offsetX/particleSize)] = 'wall';


    })

    canvas.addEventListener('mouseup',()=>{
        mouseDown = false;
    })

    canvas.addEventListener('mousemove',({offsetX,offsetY})=>{
        if(!mouseDown) {
            walls = [];
            return
        };

        let row = Math.floor(offsetY/particleSize);
        let colm = Math.floor(offsetX/particleSize);
        addSolidCube(row,colm)
    })

    addEventListener('keydown',({key})=>{
        if(key=" "){
            if(animationLoop){
                clearInterval(animationLoop);
                animationLoop = false;
            }
            else{
                loop();
            }
        }
    })
}

function addSolidCube(row,colm){
    walls = [];
    let size = 5;
    for(let irow = 0; irow > -size; irow--){
        for(let icolm = 0; icolm < size; icolm++){
            walls[(row+irow)*gridWidth+colm+icolm] = true;
        }
    }

    for(let irow = 0; irow < size; irow++){
        for(let icolm = 0; icolm < size; icolm++){
            walls[(row+irow)*gridWidth+colm+icolm] = true;
        }
    }

    for(let irow = 0; irow < size; irow++){
        for(let icolm = 0; icolm > -size; icolm--){
            walls[(row+irow)*gridWidth+colm+icolm] = true;
        }
    }

    for(let irow = 0; irow > -size; irow--){
        for(let icolm = 0; icolm > -size; icolm--){
            walls[(row+irow)*gridWidth+colm+icolm] = true;
        }
    }
}

function addWaterCube(row,colm){
    let size = 20;
    for(let irow = 0; irow > -size; irow--){
        for(let icolm = 0; icolm < size; icolm++){
            board[row+irow][colm+icolm]["1out"] = true;
        }
    }

    for(let irow = 0; irow < size; irow++){
        for(let icolm = 0; icolm < size; icolm++){
            board[row+irow][colm+icolm]["3out"] = true;
        }
    }

    for(let irow = 0; irow < size; irow++){
        for(let icolm = 0; icolm > -size; icolm--){
            board[row+irow][colm+icolm]["5out"] = true;
        }
    }

    for(let irow = 0; irow > -size; irow--){
        for(let icolm = 0; icolm > -size; icolm--){
            board[row+irow][colm+icolm]["7out"] = true;
        }
    }
}

function loop(){
    if(firstTime){
        // createRandomParticles();
        createParticleStream();
        firstTime = false;
    }

    animationLoop = setInterval(() => {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        moveParticles();
        // drawParticles();
        drawVectors();
        drawWalls();
    }, 20);
}

function createParticleStream(){
    for(let row = 0; row < gridHeight; row++){
        board[row] = [];
        for(let colm = 0; colm < gridWidth; colm++){
            if(colm == gridWidth-1 || colm == 0 || row == gridHeight-1 || row == 0){
                board[row][colm] = "wall";
                continue;
            }
            board[row][colm] = {};
        }
    }
    for(let row = 0; row < gridHeight; row++){
        for(let colm = 0; colm < 30; colm++){
            if(!(colm == gridWidth-1 || colm == 0 || row == gridHeight-1 || row == 0)){
                board[row][colm]["2out"] = true;
            }
        }
    }
}

function createRandomParticles(){
    for(let row = 0; row < gridHeight; row++){
        board[row] = [];
        for(let colm = 0; colm < gridWidth; colm++){
            if(colm == gridWidth-1 || colm == 0 || row == gridHeight-1 || row == 0){
                board[row][colm] = "wall";
                continue;
            }
            board[row][colm] = {};
            board[row][colm]["1out"] = particleRandom();
            board[row][colm]["1in"] = particleRandom();
            board[row][colm]["2out"] = particleRandom();
            board[row][colm]["2in"] = particleRandom();
            board[row][colm]["3out"] = particleRandom();
            board[row][colm]["3in"] = particleRandom();
            board[row][colm]["5out"] = particleRandom();
            board[row][colm]["5in"] = particleRandom();
            board[row][colm]["6out"] = particleRandom();
            board[row][colm]["6in"] = particleRandom();
            board[row][colm]["7out"] = particleRandom();
            board[row][colm]["7in"] = particleRandom();
        }
    }
}

function particleRandom(){
    return Math.random() <= particleAmount/(gridHeight*gridWidth * 6 * 2)
}

function drawParticles(){
    for(let row in board){
        for(let colm in board[row]){
            if(board[row][colm] == "wall"){
                ctx.fillStyle="black";
                ctx.fillRect(colm * particleSize, row * particleSize, particleSize, particleSize);
                continue;
            }

            for(let particle of Object.keys(board[row][colm])){
                if(board[row][colm][particle]){
                    ctx.fillStyle="blue";
                    ctx.fillRect(colm * particleSize, row * particleSize, particleSize, particleSize);
                    break;
                }
            }
        }
    }
}

function drawVectors(){
    for(let row = 0; row < board.length; row+=gridHeight/vectorRes[0]){
        for(let colm = 0; colm < board[row].length; colm+=gridWidth/vectorRes[1]){
            if(board[row][colm] == "wall"){
                ctx.fillStyle="black";
                ctx.fillRect(colm * particleSize, row * particleSize, particleSize, particleSize);
                continue;
            }

            let averageParticleAngle = 0;
            let particleCount = 0;

            for(let irow = 0; irow < gridHeight/vectorRes[0]; irow++){
                for(let icolm = 0; icolm < gridWidth/vectorRes[1]; icolm++){
                    for(let particle of Object.keys(board[row+irow][colm+icolm])){
                        if(!board[row+irow][colm+icolm][particle]) continue;

                        let particleType = particle.slice(0,1);
                        if(particle.slice(1) == "in")
                            particleType = (parseInt(particleType)+4)%8;

                        particleCount++;
                        averageParticleAngle += typeToAngle[particleType];
                    }
                }
            }

            if(particleCount == 0)continue;

            colm = parseInt(colm);
            row = parseInt(row);
            averageParticleAngle /= particleCount;
            drawVector(colm+gridWidth/vectorRes[1]/2,row+gridHeight/vectorRes[0]/2,Math.cos(averageParticleAngle),Math.sin(averageParticleAngle), particleCount);
        }
    }
}

function drawWalls(){
    ctx.fillStyle="black";
    for(let row = 0; row < gridHeight; row++){
        for(let colm = 0; colm < gridWidth; colm++){
            if(walls[row*gridWidth+colm]){
                ctx.fillRect(colm*particleSize,row*particleSize,particleSize,particleSize);
            }
        }
    }
}

function moveParticles(){
    var tempBoard = [];
    for(let row = 0; row < gridHeight; row++){
        tempBoard[row] = [];
        for(let colm = 0; colm < gridWidth; colm++){
            if(colm == gridWidth-1 || colm == 0 || row == gridHeight-1 || row == 0){
                tempBoard[row][colm] = "wall";
                continue;
            }

            tempBoard[row][colm] = {};
            for(let particle of Object.keys(board[row][colm])){
                tempBoard[row][colm][particle] = board[row][colm][particle];
            }
        }
    }

    for(let row = 0; row < gridHeight; row++){
        for(let colm = 0; colm < gridWidth; colm++){
            if(board[row][colm] == "wall" || walls[row*gridWidth+colm])
                continue;

            collisions(tempBoard[row][colm],row,colm)

            for(let particle of Object.keys(tempBoard[row][colm])){
                if(!tempBoard[row][colm][particle]) continue;

                let type = parseInt(particle[0]);
                let dir = particle.substring(1);

                if(dir == "in"){
                    board[row][colm][particle] = false;
                    board[row][colm][((type+4) % 8).toString() + "out"] = true;
                }

                else if(dir == "out"){
                    moveOrBounce(row,colm,type);
                }
            }
        }
    }
}

function collisions(particles,row,colm){
    if(particles["1in"] && particles["3in"] && particles["5in"] && particles["7in"]){
        if(Math.random() < 0.5){
            board[row][colm]["1out"] = true;
            board[row][colm]["5out"] = true;
        }
        else{
            board[row][colm]["7out"] = true;
            board[row][colm]["3out"] = true;
        }
        board[row][colm]["2out"] = true;
        board[row][colm]["6out"] = true;
        board[row][colm]["1in"] = false;
        board[row][colm]["3in"] = false;
        board[row][colm]["5in"] = false;
        board[row][colm]["7in"] = false;
        particles["1in"] = false;
        particles["3in"] = false;
        particles["5in"] = false;
        particles["7in"] = false;
    }

    if(particles["7in"] && particles["5in"] && particles["2in"]){
        board[row][colm]["1out"] = true;
        board[row][colm]["3out"] = true;
        board[row][colm]["6out"] = true;
        board[row][colm]["2in"] = false;
        board[row][colm]["5in"] = false;
        board[row][colm]["7in"] = false;
        particles["2in"] = false;
        particles["5in"] = false;
        particles["7in"] = false;
    }

    if(particles["1in"] && particles["3in"] && particles["6in"]){
        board[row][colm]["2out"] = true;
        board[row][colm]["5out"] = true;
        board[row][colm]["7out"] = true;
        board[row][colm]["1in"] = false;
        board[row][colm]["3in"] = false;
        board[row][colm]["6in"] = false;
        particles["1in"] = false;
        particles["3in"] = false;
        particles["6in"] = false;
    }

    if(particles["1in"] && particles["5in"]){
        if(Math.random() < 0.5){
            board[row][colm]["2out"] = true;
            board[row][colm]["6out"] = true;
        }
        else{
            board[row][colm]["7out"] = true;
            board[row][colm]["3out"] = true;
        }
        board[row][colm]["1in"] = false;
        board[row][colm]["5in"] = false;
        particles["1in"] = false;
        particles["5in"] = false;
    }

    if(particles["2in"] && particles["6in"]){
        if(Math.random() < 0.5){
            board[row][colm]["1out"] = true;
            board[row][colm]["5out"] = true;
        }
        else{
            board[row][colm]["7out"] = true;
            board[row][colm]["3out"] = true;
        }
        board[row][colm]["2in"] = false;
        board[row][colm]["6in"] = false;
        particles["2in"] = false;
        particles["6in"] = false;
    }

    if(particles["7in"] && particles["3in"]){
        if(Math.random() < 0.5){
            board[row][colm]["2out"] = true;
            board[row][colm]["6out"] = true;
        }
        else{
            board[row][colm]["1out"] = true;
            board[row][colm]["5out"] = true;
        }
        board[row][colm]["7in"] = false;
        board[row][colm]["3in"] = false;
        particles["7in"] = false;
        particles["3in"] = false;
    }

    if(particles["6in"] && particles["3in"]){
        board[row][colm]["6out"] = true;
        board[row][colm]["1out"] = true;
        board[row][colm]["6in"] = false;
        board[row][colm]["3in"] = false;
        particles["6in"] = false;
        particles["3in"] = false;
    }
    if(particles["6in"] && particles["1in"]){
        board[row][colm]["6out"] = true;
        board[row][colm]["3out"] = true;
        board[row][colm]["6in"] = false;
        board[row][colm]["1in"] = false;
        particles["6in"] = false;
        particles["1in"] = false;
    }

}

function moveOrBounce(row,colm,particle){
    let row2;
    let colm2;

    switch(particle){
        case 1:
            row2 = row-1;
            colm2 = colm+1;
            break;
        case 2:
            row2 = row;
            colm2 = colm+1;
            break;    
        case 3:
            row2 = row+1;
            colm2 = colm+1;
            break;
        case 5:
            row2 = row+1;
            colm2 = colm-1;
            break;
        case 6:
            row2 = row;
            colm2 = colm-1;
            break;
        case 7:
            row2 = row-1;
            colm2 = colm-1;
            break;
    }
    if(!board[row2] || !board[row2][colm2]) return;

    if(board[row2][colm2] == "wall" || walls[row2*gridWidth+colm2]){
        board[row][colm][particle.toString()+"out"] = false;
        board[row][colm][particle.toString()+"in"] = true;
    }
    else{
        board[row][colm][particle.toString()+"out"] = false;
        board[row2][colm2][((particle+4) % 8).toString()+"in"] = true;
    }
}

function drawVector(x1,y1,dx,dy,size){
    // dx *= size/gridHeight * 2000;
    // dy *= size/gridHeight* 2000;

    ctx.beginPath();
    ctx.moveTo(x1*particleSize,y1*particleSize);
    ctx.lineTo((x1+dx)*particleSize,(y1+dy)*particleSize);
    ctx.stroke();
    
    // ctx.beginPath();
    // ctx.arc((x1+dx) * particleSize,(y1+dy) * particleSize,particleSize,0,Math.PI*2);
    // ctx.fill();
}

loop();
startListening();