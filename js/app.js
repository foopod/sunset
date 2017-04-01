var ctx;
var canvas;
var perlin = new ClassicalNoise(Math);
var count = 0;

var fluctuation;
var red;
var sunColor;
var sunSeed;
var sunX;
var sunY;
var sunR;

var rangeHeights;
var mountainColor;

var idealHeight = 680;
var flexHeight;

function gameLoop() {
    drawGradient(red, blendColors("#FFFFFF", red, 0.5));
    drawSun(sunColor, sunX, sunY, sunR);
    for(var i = 0; i < rangeHeights.length; i++){
        if( i%3 == 0){
            if( i  == 3){
                drawMountainRange(rangeHeights[i],fluctuation,count*(i+2), 0.3);
            } else {
                drawMountainRange(rangeHeights[i],fluctuation,count*(i+2), 0.2);
            }
        } else if (i%3 == 1){
            drawTreeRange(rangeHeights[i],fluctuation,count*(i+2));
           
            drawLowClouds(rangeHeights[i],fluctuation,count*(i+2));
            drawMountainRange(rangeHeights[i]+0.01,fluctuation,count*(i+2), 0.2);
            drawTreeRange(rangeHeights[i]+0.05,fluctuation,count*(i+3)-6);
            drawTreeRange(rangeHeights[i]+0.03,fluctuation,count*(i+3)-12);
         } else {
            drawLowClouds(rangeHeights[i],fluctuation,count*(i+2));
         }
    }
    count+=0.1;
}

function init(){
    canvas = document.getElementById('sunset');
	ctx = canvas.getContext('2d');
    resizeCanvas();
    fluctuation = Math.random() * 0.3 +  0.05* canvas.width/1000;
    red = generateRandomRed();
    sunSeed = Math.random();
    sunColor = generateRandomRed();
    sunColor = blendColors("#FFFFFF", red, 0.5)
    sunX = canvas.width * Math.random();
    sunR = 100 * Math.random() + canvas.width/10;
    sunY = 0;
    count = 0;
    mountainColor = "#555555";
    mountainColor = blendColors(red, "#999999", 0.5);
    flexHeight = idealHeight/canvas.height;
    
    rangeHeights = [];
    for( var i = 0; i < 7; i++){
        rangeHeights.push(0.9 - (7-i)/30);
    }
}

function start(){
    init();
    //Start gameloop
    setInterval(gameLoop, 33); // 33 milliseconds = ~ 30 frames per sec
}

function drawMountainRange(height, fluctuation, step, Tfluctuation){
    var numberOfPoints = canvas.width;
    var terrainFluctation = Tfluctuation;
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    
    for(var i = 0; i <= canvas.width; i+=canvas.width/numberOfPoints){
        ctx.lineTo(i,octavePerlin((i+step)/500,height*canvas.height,10, 7, .5)*terrainFluctation*canvas.height*2.5*height*flexHeight + height*canvas.height);
    }
    ctx.lineTo(canvas.width, canvas.height);

    // complete custom shape
    ctx.closePath();
    ctx.lineWidth = 1;
    var grd=ctx.createLinearGradient(0,canvas.height*height,0,canvas.height);
    grd.addColorStop(0,shadeColor2(mountainColor, (1/height-0.5)-1));
    ctx.fillStyle=grd;
    ctx.fill();
    drawMountainShadow(height, fluctuation, step, Tfluctuation);
}

function drawMountainShadow(height, fluctuation, step, Tfluctuation){
    var numberOfPoints = canvas.width;
    var terrainFluctation = Tfluctuation;
    
    
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    var p = Math.abs((perlin.noise(fluctuation,height*canvas.height,10)+1)/10);
    for(var i = 0; i <= canvas.width; i+=canvas.width/numberOfPoints){
        var offset = (sunX - i)/canvas.width;
        var diff = offset + p;
        ctx.lineTo(i,octavePerlin((i+step+offset)/500,height*canvas.height,10, 7, .5)*terrainFluctation*canvas.height*2.5*height*flexHeight + height*canvas.height + Math.abs((200*diff) -(step+i+height*1000)%400*diff)*2);
    }
    ctx.lineTo(canvas.width, canvas.height);

    // complete custom shape
    ctx.closePath();
    ctx.lineWidth = 1;
//    ctx.strokeStyle = 'blue';
    var grd=ctx.createLinearGradient(0,canvas.height*height,0,canvas.height);
    grd.addColorStop(0,shadeColor2(mountainColor, (1/height-0.53)-1));
    var grdColor  = 160-(Math.floor(255*sunY/canvas.height));
    grd.addColorStop(1,shadeColor2(mountainColor, (1/height-0.505)-1));
    ctx.fillStyle=grd;
    ctx.fill();
}

function drawLowClouds(height, fluctuation, step){
    var numberOfPoints = canvas.width;
    var terrainFluctation = 0.05;
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for(var i = 0; i <= canvas.width; i+=canvas.width/numberOfPoints){
        ctx.lineTo(i,octavePerlin((i+step)/200,height*canvas.height,10, 1, .5)*terrainFluctation*canvas.height*2.5*height*flexHeight+ Math.abs(Math.sin((i+step)/20))*10 * -1 + height*canvas.height*1.05);
    }

    ctx.lineTo(canvas.width, canvas.height);

    // complete custom shape
    ctx.closePath();
    ctx.lineWidth = 1;
//    ctx.strokeStyle = 'blue';
    var grd=ctx.createLinearGradient(0,canvas.height*height,0,canvas.height);
    grd.addColorStop(0,blendColors(shadeColor2(mountainColor, (1/height-0.3)-1),shadeColor2("#FFFFFF", (1/height-0.3)-1), 0.2));
    ctx.fillStyle=grd;
    ctx.fill();
}

function drawTreeRange(height, fluctuation, step){
    var numberOfPoints = canvas.width;
    var terrainFluctation = 0.1;
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for(var i = 0; i <= canvas.width; i+=canvas.width/numberOfPoints){
        var sawtooth = Math.abs(12 - (i+step)%24);
        if(sawtooth <= 1 || sawtooth >= 11 || i <=5 || i >= canvas.width-5){
            ctx.lineTo(i,octavePerlin((i+step)/200,height*canvas.height*10,1, 10, 0.5)*terrainFluctation*canvas.height*4*flexHeight + Math.abs(12 - (i+step)%24) * 6 + height*canvas.height*1.04);
        }
    }

    ctx.lineTo(canvas.width, canvas.height);

    // complete custom shape
    ctx.closePath();
    ctx.lineWidth = 1;
    var grd=ctx.createLinearGradient(0,canvas.height*height,0,canvas.height);
    grd.addColorStop(0,blendColors(shadeColor2(mountainColor, (1/height-0.3)-1),shadeColor2("#002200", (1/height-0.3)-1), 0.2));
    var grdColor  = 160-(Math.floor(255*sunY/canvas.height));
    ctx.fillStyle=grd;
    ctx.fill();
}

function octavePerlin(x, y, z, octaves, persistence) {
    var total = 0;
    var frequency = 1;
    var amplitude = 1;
    var maxValue = 0;  // Used for normalizing result to 0.0 - 1.0
    for(var i=0;i<octaves;i++) {
        total += perlin.noise(x * frequency, y * frequency, z * frequency) * amplitude;
        
        maxValue += amplitude;
        
        amplitude *= persistence;
        frequency *= 2;
    }
    
    return total/maxValue;
}

function drawGradient(top, bottom){
    var grd=ctx.createLinearGradient(0,0,0,canvas.width);
    grd.addColorStop(0,top);
    grd.addColorStop(.4,bottom);

    ctx.fillStyle=grd;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
}

function drawSun(colour, x,y,r){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = colour;
    ctx.fill();
}
