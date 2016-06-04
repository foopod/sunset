function resizeCanvas(e) {
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
}

function generateRandomRed(){
    var h = Math.random()*60;
    if(h > 50){
        h+=350
    }
    s = Math.random()/4 + .3;
    v = 1;
    console.log("red "+h + "," + s + "," + v);
    return hsv2rgb(h,s,v);
}

function generateRandomBlue(){
    var h = (Math.random()*60 + 210);
    s = Math.random()/4 + .3;
    v = 1;
    console.log("blue "+h + "," + s + "," + v);
    return hsv2rgb(h,s,v);
}

var hsv2rgb = function(h, s, v) {
  // adapted from http://schinckel.net/2012/01/10/hsv-to-rgb-in-javascript/
  var rgb, i, data = [];
  if (s === 0) {
    rgb = [v,v,v];
  } else {
    h = h / 60;
    i = Math.floor(h);
    data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
    switch(i) {
      case 0:
        rgb = [v, data[2], data[0]];
        break;
      case 1:
        rgb = [data[1], v, data[0]];
        break;
      case 2:
        rgb = [data[0], v, data[2]];
        break;
      case 3:
        rgb = [data[0], data[1], v];
        break;
      case 4:
        rgb = [data[2], data[0], v];
        break;
      default:
        rgb = [v, data[0], data[1]];
        break;
    }
  }
  return '#' + rgb.map(function(x){
    return ("0" + Math.round(x*255).toString(16)).slice(-2);
  }).join('');
};