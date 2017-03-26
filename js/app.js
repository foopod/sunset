var ctx;
var canvas;
var perlin = new ClassicalNoise(Math);
var count = 0;

var fluctuation;
var red;
var blue;
var sunColor;
var sunSeed;
var sunX;
var sunY;
var sunR;

var rangeHeights;
var mountainColor;

function gameLoop() {
//    drawGradient(red, blue);
    drawGradient(red, blendColors("#FFFFFF", red, 0.5));
    drawSun(sunColor, sunX, sunY, sunR);
//    drawClouds(count); //Lags out
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
            drawTreeRange(rangeHeights[i]+0.03,fluctuation,count*(i+3)-12);
         } else {
             drawLowClouds(rangeHeights[i],fluctuation,count*(i+2));
         }
    }
//    drawMountainRange(0.5,fluctuation,count);
//    drawMountainRange(0.6,fluctuation,count*2);
//    drawMountainRange(0.8,fluctuation,count*5);
//    if(sunY<canvas.height+sunR){
//        sunY+=0.2;
//    }
    if(sunY/canvas.height>1){
        init();
    }
    
    count+=0.1;
}

function init(){
    canvas = document.getElementById('sunset');
	ctx = canvas.getContext('2d');
    resizeCanvas();
    fluctuation = Math.random() * 0.3 +  0.05* canvas.width/1000;
    red = generateRandomRed();
    blue = generateRandomBlue();
    sunSeed = Math.random();
    sunColor = generateRandomRed();
    sunColor = blendColors("#FFFFFF", red, 0.5)
    sunX = canvas.width * Math.random();
    sunR = 100 * Math.random() + canvas.width/10;
    sunY = 0;
    count = 0;
    mountainColor = "#555555";
    mountainColor = red;
    
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

function drawMountainRange(height, fluctuation, step, Tfluctuation){
    var numberOfPoints = canvas.width;
    var terrainFluctation = Tfluctuation;
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    
    for(var i = 0; i <= canvas.width; i+=canvas.width/numberOfPoints){
        ctx.lineTo(i,octavePerlin((i+step)/500,height*canvas.height,10, 7, .5)*terrainFluctation*canvas.height*2.5*height + height*canvas.height);
    }
ctx.lineTo(i,perlin.noise((i+step+1)/200,height*canvas.height,10)*terrainFluctation*canvas.height+height*canvas.height);
    ctx.lineTo(canvas.width, canvas.height);

    // complete custom shape
    ctx.closePath();
    ctx.lineWidth = 1;
//    ctx.strokeStyle = 'blue';
    var grd=ctx.createLinearGradient(0,canvas.height*height,0,canvas.height);
    grd.addColorStop(0,shadeColor2(mountainColor, (1/height-0.5)-1));
//    console.log((height*2)-.7);
//    var grdColor  = 160-(Math.floor(255*sunY/canvas.height));
//    grd.addColorStop(1, "".concat('rgb(',grdColor,',',grdColor,',',grdColor,')'));
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
    console.log(p);
    for(var i = 0; i <= canvas.width; i+=canvas.width/numberOfPoints){
        var offset = (sunX - i)/canvas.width;
//    console.log(offset);
        var diff = offset + p;
        ctx.lineTo(i,octavePerlin((i+step+offset)/500,height*canvas.height,10, 7, .5)*terrainFluctation*canvas.height*2.5*height + height*canvas.height + Math.abs((200*diff) -(step+i)%400*diff)*2);
    }
ctx.lineTo(i,perlin.noise((i+step+1)/200,height*canvas.height,10)*terrainFluctation*canvas.height+height*canvas.height);
    ctx.lineTo(canvas.width, canvas.height);

    // complete custom shape
    ctx.closePath();
    ctx.lineWidth = 1;
//    ctx.strokeStyle = 'blue';
    var grd=ctx.createLinearGradient(0,canvas.height*height,0,canvas.height);
    grd.addColorStop(0,shadeColor2(mountainColor, (1/height-0.56)-1));
//    console.log((height*2)-.7);
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
        ctx.lineTo(i,octavePerlin((i+step)/200,height*canvas.height,10, 1, .5)*terrainFluctation*canvas.height*2.5*height+ Math.abs(Math.sin((i+step)/20))*10 * -1 + height*canvas.height*1.05);
    }

ctx.lineTo(i,perlin.noise((i+step+1)/200,height*canvas.height,10)*terrainFluctation*canvas.height+height*canvas.height);
    ctx.lineTo(canvas.width, canvas.height);

    // complete custom shape
    ctx.closePath();
    ctx.lineWidth = 1;
//    ctx.strokeStyle = 'blue';
    var grd=ctx.createLinearGradient(0,canvas.height*height,0,canvas.height);
    grd.addColorStop(0,blendColors(shadeColor2(mountainColor, (1/height-0.3)-1),shadeColor2("#FFFFFF", (1/height-0.3)-1), 0.2));
//    console.log((height*2)-.7);
//    var grdColor  = 160-(Math.floor(255*sunY/canvas.height));
//    grd.addColorStop(1, "".concat('rgb(',grdColor,',',grdColor,',',grdColor,')'));
    ctx.fillStyle=grd;
    ctx.fill();
}

function drawTreeRange(height, fluctuation, step){
    var numberOfPoints = canvas.width;
    var terrainFluctation = 0.1;
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for(var i = 0; i <= canvas.width; i+=canvas.width/numberOfPoints){
        ctx.lineTo(i,octavePerlin((i+step)/200,height*canvas.height*10,1, 10, 0.5)*terrainFluctation*canvas.height*2 + Math.abs(10 - (i+step)%20) * 5 + height*canvas.height*1.05);
    }


ctx.lineTo(i,perlin.noise((i+step+1)/20,height*canvas.height,10)*terrainFluctation*canvas.height+height*canvas.height);
    ctx.lineTo(canvas.width, canvas.height);

    // complete custom shape
    ctx.closePath();
    ctx.lineWidth = 1;
//    ctx.strokeStyle = 'blue';
    var grd=ctx.createLinearGradient(0,canvas.height*height,0,canvas.height);
    grd.addColorStop(0,blendColors(shadeColor2(mountainColor, (1/height-0.3)-1),shadeColor2("#002200", (1/height-0.3)-1), 0.2));
//    console.log((height*2)-.7);
    var grdColor  = 160-(Math.floor(255*sunY/canvas.height));
//    grd.addColorStop(1, "".concat('rgb(',grdColor,',',grdColor,',',grdColor,')'));
    ctx.fillStyle=grd;
    ctx.fill();
}

function shadeColor2(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function blendColors(c0, c1, p) {
    var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
    return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
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

function drawGradient(red, blue){
    var grd=ctx.createLinearGradient(0,0,0,canvas.width);
    grd.addColorStop(0,hexFade(red, (sunY)/canvas.height));
    grd.addColorStop(0.4,hexFade(blue, (sunY)/canvas.height+0.1));

    ctx.fillStyle=grd;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
}

function drawSun(colour, x,y,r){
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = colour;
    ctx.fill();
}
