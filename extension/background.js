var tInterval;
var socket;
var connected = false;
var established = false;
var d = new Date();
var id;
var dims = false;
var maxDimension = 240;
var init = false;

chrome.windows.onRemoved.addListener(function (tab){
	clearInterval(tInterval);
	socket.emit('closeStream', { i : id });
	chrome.browserAction.setIcon({
		path: {
			"19": "icon19x19.png",
			"38": "icon76x76.png"
		}
	});
	window.on = false;
});
chrome.browserAction.onClicked.addListener(function(tab) {
	myURL = tab.url;
	(!established) && (socket = io.connect('https://heynsa-server.herokuapp.com'));
	established = true;
	if(!window.on){
		id = d.getTime()+Math.floor(Math.random()*1000)
		captureScreen();
		tInterval = setInterval(captureScreen, 1000);
		chrome.browserAction.setIcon({
			path: {
				"19": "icon_active19x19.png",
				"38": "icon_active76x76.png"
			}
		});
	}else{
		clearInterval(tInterval);
		socket.emit('closeStream', { i : id });
		init = false;
		chrome.browserAction.setIcon({
			path: {
				"19": "icon19x19.png",
				"38": "icon76x76.png"
			}
		});
	}
	window.on = !window.on;
});
function captureScreen(){
	chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT,{
			format : 'jpeg',
			quality: 100
		}, function (data) {
		var image = new Image();
		image.onload = function() {
			var canvas = document.createElement('canvas');
			var imageAspectRatio = this.height/this.width;
			var context = canvas.getContext('2d');
			var w = maxDimension;
			var h = maxDimension* imageAspectRatio;
			if(imageAspectRatio > 1){
				h = maxDimension;
				w = maxDimension * imageAspectRatio;
			}
			canvas.width = w;
			canvas.height = h;
			if(!init){
				context.drawImage(image, 0, 0, w, h);
				var imgd = context.getImageData(0, 0, w, h);
				var pix = imgd.data;
				for (var i = 0, n = pix.length; i < n; i += 4) {
					var grayscale = pix[i] * .3 + pix[i+1] * .59 + pix[i+2] * .11;
					pix[i  ] = grayscale;
					pix[i+1] = grayscale;
					pix[i+2] = grayscale;
				}
				context.putImageData(imgd, 0, 0);
				var cropped = canvas.toDataURL('image/jpeg', 0.3);
				socket.emit('newStream', { i : id, w : w, h : h, tn : cropped });
				init = true;
			}
			context.drawImage(image, 0, 0, w, h);
			var cropped = canvas.toDataURL('image/jpeg', 0.3);
			socket.emit('sendIm', { im : cropped.substring(cropped.indexOf(',')), i : id });
			canvas.remove();
		}
		image.src = data;
	});
}