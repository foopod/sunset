var ctx;
var canvas;
var perlin = new ClassicalNoise(Math);

function init(){
    canvas = document.getElementById('sunset');
	ctx = canvas.getContext('2d');
    
    resizeCanvas();
    drawGradient();
    drawMountainRange(0.55);
    drawMountainRange(0.6);
    drawMountainRange(0.7);
}

function drawMountainRange(height){
    var averageHeight =height;
    var numberOfPoints = 1000;
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for(var i = 0; i < canvas.width; i+=canvas.width/numberOfPoints){
//        console.log(perlin.noise(i/0,0,0));
        ctx.lineTo(i,perlin.noise(i/300,averageHeight*canvas.height,0)*0.20*canvas.height + averageHeight*canvas.height);
    }
    ctx.lineTo(canvas.width, canvas.height);
    

    // complete custom shape
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'blue';
    var grd=ctx.createLinearGradient(0,0,0,canvas.width);
    grd.addColorStop(height-.1,'black');
    grd.addColorStop(0,'#636363');

    ctx.fillStyle=grd;
    ctx.fill();
}

function drawGradient(){
    var grd=ctx.createLinearGradient(0,0,0,canvas.width);
    grd.addColorStop(0,generateRandomRed());
    grd.addColorStop(0.5,generateRandomBlue());

    ctx.fillStyle=grd;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
}