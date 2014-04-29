var express = require("express");
var stylus = require('stylus');
var nib = require('nib');
var app = express();
var http = require('http');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
var server = http.createServer(app);
var port = Number(process.env.PORT || 5001);

// ┌────────────────────────────────────────────────────────────────────┐
// | app
// └────────────────────────────────────────────────────────────────────┘

function compile(str, path) {
	return stylus(str).set('filename', path).use(nib())
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(
	stylus.middleware({
		src: __dirname + '/public',
		compile: compile
	})
)
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
	var cameras;
	var s3 = new AWS.S3();
	s3.listObjects({Bucket: 'heynsa'}, function(err, data) {
		if (err) console.log(err, err.stack);
		else cameras = JSON.stringify(data.Contents);
		res.render('index', {
			cameras: cameras
		})
	})
})

app.listen(port, function() {
  console.log("Listening on " + port);
});