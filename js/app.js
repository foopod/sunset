var ctx;
var canvas;
var perlin = new ClassicalNoise(Math);

function init(){
    canvas = document.getElementById('sunset');
	ctx = canvas.getContext('2d');
    
    resizeCanvas();
    drawGradient();
    drawSun();
    drawClouds();
    drawMountainRange(0.5);
    drawMountainRange(0.6);
    drawMountainRange(0.8);

}

function drawClouds(){
    var cloudCover = .3;    
    
// create a temporary canvas to hold the gradient overlay
    var canvas2=document.createElement("canvas");
    canvas2.width=canvas.width;
    canvas2.height=canvas.height;
    var ctx2=canvas2.getContext("2d");

    // make gradient using ImageData
    var imgData = ctx2.getImageData(0,0,canvas.width,canvas.height);
    var data=imgData.data;
    var val = Math.random() * 60 + 190;
    for(var y=0; y<canvas.height; y++) {
        for(var x=0; x<canvas.width; x++) {
            var n=((canvas.width*y)+x)*4;
            
            data[n]=val;
            data[n+1]=val;
            data[n+2]=val;
            data[n+3]=125* perlin.noise(x / 200, y/200,0);
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

function drawMountainRange(height){
    var numberOfPoints = canvas.width;
    var terrainFluctation = Math.random() * 0.3 +  0.05;
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for(var i = 0; i <= canvas.width; i+=canvas.width/numberOfPoints){
        ctx.lineTo(i,perlin.noise(i/400,height*canvas.height,0)*terrainFluctation*canvas.height + height*canvas.height);
    }
    ctx.lineTo(i,perlin.noise(canvas.width/400,height*canvas.height,0)*terrainFluctation*canvas.height+height*canvas.height);
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

function drawGradient(){
    var grd=ctx.createLinearGradient(0,0,0,canvas.width);
    grd.addColorStop(0,generateRandomRed());
    grd.addColorStop(0.4,generateRandomBlue());

    ctx.fillStyle=grd;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
}

function drawSun(){
    var x = canvas.width * Math.random();
    var y = canvas.height * Math.random();
    
    var r = 100 * Math.random() + 200;
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = generateRandomRed();
    ctx.fill();
}