// Filename: main.js
'use strict';
require.config({
	shim: {
		socketio: {
			exports: 'io'
		},
		jqueryui: {
			deps: [
				'jquery'
			],
			exports: '$'
		},
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		}
	},
	paths: {
		jquery: 'lib/jquery',
		jqueryui: "lib/jqueryui",
		underscore: 'lib/underscore',
		backbone: 'lib/backbone',
		text: 'lib/text',
		socketio: '//heynsa-server.herokuapp.com/socket.io/socket.io.js'
	}
});
require(
	[
		'views/app',
		'collections/camset',
		'collections/streamset',
		'socketio'
	],
	function(App, CamSet, StreamSet, io){
		window.app = new App();
		window.app.cameras = new CamSet();
		window.app.streams = new StreamSet();
		$.each(cameras, window.app.loadCamera);
		var socket = io.connect('http://heynsa-server.herokuapp.com:80');
		socket.on('newStream', function (data) {
			window.app.streams.add({ id : data.id })
		})
		socket.on('closeStream', function (data) {
			window.app.streams.get(data.id).removeView(data);
		})
		socket.on('imageSaved', function (data) {
			window.app.streams.get(data.id).setImage(data.data)
		});
	}
);