var ctx;
var canvas;
var perlin = new ClassicalNoise(Math);

function init(){
    canvas = document.getElementById('sunset');
	ctx = canvas.getContext('2d');
    
    resizeCanvas();
    drawGradient();
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
    
    
//    
//    var image = ctx.createImageData(canvas.width, canvas.height*0.3);
//    var data = image.data;
//    for (var x = 0; x < canvas.width; x++) {
//      for (var y = 0; y < canvas.height*0.3; y++) {
//        var value = Math.abs(perlin.noise(x / 300, y/300,0));
//        value = Math.floor(value * 256);
//        var cell = (x + y * canvas.width) * 4;
//        data[cell] = data[cell + 1] = data[cell + 2] = 255;
//        data[cell + 3] = 0; // alpha.
//      }
//    }
//    
//    ctx.fillColor = 'black';
//    ctx.fillRect(0, 0, 100, 100);
//    ctx.putImageData(image, 0, 0);

}

function drawMountainRange(height){
    var averageHeight =height;
    var numberOfPoints = canvas.width;
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for(var i = 0; i <= canvas.width; i+=canvas.width/numberOfPoints){
//        console.log(perlin.noise(i/0,0,0));
        ctx.lineTo(i,perlin.noise(i/400,averageHeight*canvas.height,0)*0.20*canvas.height + averageHeight*canvas.height);
    }
    ctx.lineTo(i,perlin.noise(canvas.width/400,averageHeight*canvas.height,0)*0.20*canvas.height + averageHeight*canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    

    // complete custom shape
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'blue';
    var grd=ctx.createLinearGradient(0,0,0,canvas.height * (1-height) + .5 * canvas.height);
    grd.addColorStop(1,'#565656');
    grd.addColorStop(0.5,'#aaaaaa');
    grd.addColorStop(0,'#ffffff');

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