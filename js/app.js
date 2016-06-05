var ctx;
var canvas;
var perlin = new ClassicalNoise(Math);
var count = 0;

var fluctuation;
var red;
var blue;
var sunColor;
var sunSeed;

function gameLoop() {
    // Do stuff.
    drawGradient(red, blue);
    drawSun(sunColor,sunSeed);
//    drawClouds(count);
    drawMountainRange(0.5,fluctuation,count);
    drawMountainRange(0.6,fluctuation,count*2);
    drawMountainRange(0.8,fluctuation,count*3);
    
    count+=1;
}

function init(){
    canvas = document.getElementById('sunset');
	ctx = canvas.getContext('2d');
    
    fluctuation = Math.random() * 0.3 +  0.05* canvas.width/1000;
    red = generateRandomRed();
    blue = generateRandomBlue();
    sunSeed = Math.random();
    sunColor = generateRandomRed();
    
    resizeCanvas();
    
    

    //Start gameloop
    setInterval(gameLoop, 33); // 33 milliseconds = ~ 30 frames per sec
}





function drawClouds(step){
    var cloudCover = .3;    
    
// create a temporary canvas to hold the gradient overlay
    var canvas2=document.createElement("canvas");
    canvas2.width=canvas.width;
    canvas2.height=canvas.height;
    var ctx2=canvas2.getContext("2d");

    // make gradient using ImageData
    var imgData = ctx2.getImageData(0,0,canvas.width,canvas.height);
    var data=imgData.data;
    var val = 1 * 60 + 190;
    for(var y=0; y<canvas.height; y++) {
        for(var x=0; x<canvas.width; x++) {
            var n=((canvas.width*y)+x)*4;
            
            data[n]=val;
            data[n+1]=val;
            data[n+2]=val;
            data[n+3]=125* perlin.noise(x / 200+step/51, y/200,0);
            if(y>cloudCover*canvas.height){
                data[n+3]=data[n+3]-(y-cloudCover*canvas.height)/2;
            }
        }
    }

    // put the modified pixels on the temporary canvas
    ctx2.putImageData(imgData,0,0);

    // ctx the temporary gradient canvas on the visible canvas
    ctx.drawImage(canvas2,0,0, canvas.width, canvas.height/1.5);

}

function drawMountainRange(height, fluctuation, step){
    var numberOfPoints = canvas.width/5;
    var terrainFluctation = fluctuation;
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for(var i = 0; i <= canvas.width; i+=canvas.width/numberOfPoints){
        ctx.lineTo(i,perlin.noise((i+step)/400,height*canvas.height,0)*terrainFluctation*canvas.height + height*canvas.height);
    }
    ctx.lineTo(i,perlin.noise((i+step+1)/400,height*canvas.height,0)*terrainFluctation*canvas.height+height*canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    

    // complete custom shape
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'blue';
    var grd=ctx.createLinearGradient(0,0,0,canvas.height * (1-height) + .5 * canvas.height);
    grd.addColorStop(1,'#000000');
    grd.addColorStop(0.5,'#454545');
    grd.addColorStop(0,'#aaaaaa');

    ctx.fillStyle=grd;
    ctx.fill();
}

function drawGradient(red, blue){
    var grd=ctx.createLinearGradient(0,0,0,canvas.width);
    grd.addColorStop(0,red);
    grd.addColorStop(0.4,blue);

    ctx.fillStyle=grd;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
}

function drawSun(colour,seed){
    var x = canvas.width * perlin.noise(seed,0,0);
    var y = canvas.height*0.6* perlin.noise(seed+1,0,0) + canvas.height * 0.1;
    
    var r = 100 * perlin.noise(seed+2,0,0) + canvas.width/10;
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = colour;
    ctx.fill();
}