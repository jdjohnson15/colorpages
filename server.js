var fs = require("fs");
var cors = require('cors');
var express = require( "express" );
var app = express();
var http = require( "http" ).createServer( app );
var io = require( "socket.io" )( http );

http.listen(8080);

app.use(cors());

var canvas;


var processedCount = 0, totalCount = 0;

var totalCount;
fs.readFile("info.txt", 'utf8', function(err, data) {
	if (err) throw err;
  	totalCount = data;
});

app.use(express.static('public'));


/////socket stuff
io.on('connection', function(socket){
	console.log("new client: "+socket.id);

	socket.on('imageUpdate', function(data){
		console.log("client selected an image");
		var base64Data = data.replace(/^data:image\/png;base64,/, "");
		fs.writeFile("public/processed_images/cp.png", base64Data, 'base64', function(err){console.log(err);});
	});

	socket.on('disconnect', function(){
		console.log("client "+socket.id+" disconnected");
	});

});


