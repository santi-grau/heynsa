/*
 * server.js
*/
var port = Number(process.env.PORT || 5000);
var io = require('socket.io').listen(port);
var AWS = require('aws-sdk'); // DEFINE 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY' AND 'S3_BUCKET_NAME' CONFIG VARIABLES
var streams = {};
var s3bucket = new AWS.S3({params: {Bucket: 'heynsa'}});
/*
 * io.sockets
*/
io.sockets.on('connection', function (socket) {
	socket.on('newStream', function (data) {
		streams['s'+data.i] = new Stream(data);
		s3bucket.putObject({Key:  's' + data.i + 'tn.jpg', Body: new Buffer(data.tn), ContentEncoding : 'base64'}, function(err, data) {
			if (err) console.log("Error uploading data: ", err)
			else console.log("Successfully uploaded thumbnail for stream s" + data.i + " to bucket heynsa");
		});
	});
	socket.on('sendIm', function (data) {
		if(data.im && streams['s'+data.i]){
			streams['s'+data.i]._saveImage(data.im);
		}
	});
	socket.on('closeStream', function (data) {
		streams['s'+data.i]._close();
	});
});
/*
 * Stream object
*/
var Stream = function(data){
	io.sockets.emit('newStream', { id : data.i });
	this.id = data.i;
	this.w = data.w;
	this.h = data.h;
	this.json = [];
	this.frame = 0;
}
Stream.prototype._close = function(){
	var _this = this;
	var key = 's' + this.id + '_' + Math.floor(this.w) + '_' + Math.floor(this.h) +'_.json';
	s3bucket.putObject({Key:  key, Body: JSON.stringify(this.json) }, function(err, data) {
		if (err) console.log("Error uploading data: ", err)
		else io.sockets.emit('closeStream', { id : _this.id, key : key });
	});
}
Stream.prototype._saveImage = function(data){
	this.json[this.frame] = {
		data: 'data:image/jpeg;base64' + data,
		ts: new Date().toString()
	}
	io.sockets.emit('imageSaved', { data : 'data:image/jpeg;base64' + data, id : this.id });
	if(this.frame < 29) this.frame++
	else this.frame = 0;
}
