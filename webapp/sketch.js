var ip = 'http://hotorphanage.no-ip.org';
var port = 8080;
var socket;
var img;
var ID;
var imgCount;
var timer, qrTimer;
var imageUsed = [];
var unusedIDs = [];
  
var sessionid; 
var ready = false;
var qrcode, qrcodeImg;
function Timer(bt){
  this.begin = bt;
  this.current = 0;
  this.reset = function(){
    this.begin = millis();
    this.current = 0;
  }
  this.update = update = function(){
    this.current = millis() - this.begin 
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  socket = io.connect(ip+":"+port);
  sessionid = socket.io.engine.id;
  print("your ID: "+sessionid);
  socket.emit('start', "client started");
  socket.on('startReturn', function(data){
    imgCount = data; 
    ready = true;
  });
  
  print("image count: "+imgCount);
  resetImageUsed();
  timer = new Timer(millis());
  qrTimer = new Timer(millis());
  
  
  qrcodeImg = loadImage(ip+":"+port+"/qr.jpeg");
  
  imgCount = 38;
  imageMode(CENTER);
  displayImage(1);
  background(0);
}

function draw() {

  timer.update();
  if (timer.current > 60000){
    background(0);
    displayImage(1);
    timer.reset();
  }
  qrcodeControl();
 
}
var img;
function displayImage(c){
  
  if(c){
    ID = 0;//getImageID();
    imageSent = false;
  //print("ID: "+ID);
      img = loadImage(ip+":"+port+"/images/"+ ID+".jpg", function(){
      if (img.width / img.height > windowWidth/windowHeight){
        image(img, windowWidth/2,windowHeight/2, windowWidth, img.height*(windowWidth/img.width));
      }
      else{
        image(img, windowWidth/2,windowHeight/2, img.width*(windowHeight/img.height), windowHeight); 
      }
    });
  }
  else{
    tint(255, 255 - iT);
    image(qrcodeImg, windowWidth/2, windowHeight/2);
    tint(255, iT);
    if (img.width / img.height > windowWidth/windowHeight){
        image(img, windowWidth/2,windowHeight/2, windowWidth, img.height*(windowWidth/img.width));
    }
    else{
      image(img, windowWidth/2,windowHeight/2, img.width*(windowHeight/img.height), windowHeight); 
    }
  }
}

function touchStarted(){
  qrTimer.reset();
  qrStart = true;
}


function getNumResponse(res){
  image(img, 0,0,windowWidth, windowHeight);
}

function getImageID(){
  var id;
  if (unusedIDs.length === 0)
    resetImageUsed();
  var index = floor(random(0, unusedIDs.length));
  id = unusedIDs[ index ];
  for (i = index; i < unusedIDs.length - 1; ++i){
    unusedIDs[i] = unusedIDs[i+1];
  }
  unusedIDs.pop();
  return id;
}

function resetImageUsed(){
  for (i = 0; i < imgCount; ++i){
    unusedIDs.push(i);
  }
}
var qrStart = false;
var iT = 255;
var imageSent = false;


function qrcodeControl(){
  if(qrStart){
    if (!imageSent){
      sendImageData(img);
      imageSent = true;
    }
      
    qrTimer.update();
    background(0);
    // if(qrTimer.current < 5000)
    if(iT > 0 && qrTimer.current < 2000 ){
      iT -= 32;
      if (iT < 0) iT = 0;
    }
    else if (qrTimer.current > 2000){
      iT += 32;
    }
    if (iT > 255){
      iT = 255;
      qrStart = false;
    }
    displayImage(0); 
  }
}

function sendImageData(img){

  img.loadPixels();
  var sobelData = Sobel(img.pixels, img.width, img.height);

	var sobelImageData = sobelData.toImageData();
	
  var tempCanvas = createGraphics(img.width, img.height);
  var tempImage = createImage(img.width, img.height);
  tempImage.loadPixels();
  for(i = 0; i < sobelImageData.data.length; i+=4){
    tempImage.pixels[i]   = 255 - sobelImageData.data[i];
    tempImage.pixels[i+1] = 255 - sobelImageData.data[i+1];
    tempImage.pixels[i+2] = 255 - sobelImageData.data[i+2];
    tempImage.pixels[i+3] = sobelImageData.data[i+3];
  }
  print(tempImage.pixels.length);
  tempImage.updatePixels();
  tempCanvas.image(tempImage, 0, 0);
  
  image(tempCanvas, 0, 0);
  print(tempCanvas.elt);
  var data = tempCanvas.elt.toDataURL();
  
  imageSent = true;
  socket.emit("imageUpdate", data);
}
