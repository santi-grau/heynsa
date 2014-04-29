// Filename: app.js
define(
	[
		'jquery',
		'underscore',
		'backbone'
	],
	function($, _, Backbone){
		var App = Backbone.View.extend({
			el: 'body',
			initialize: function(){
				_.bindAll(this, 'loadCamera');
				$(window).bind("resize", _.bind(this.resize, this));
			},
			loadCamera: function(i,j){
				if(j.Key.indexOf('tn') == -1){
					var jsonPath = j.Key.split('.')[0];
					this.cameras.add({ jsonPath: jsonPath, id : jsonPath.split('_')[0], width: jsonPath.split('_')[1], height: jsonPath.split('_')[2], thumbnailPath: jsonPath.split('_')[0]+'tn.jpg' });
				}
			},
			resize: function(){
				(this.resizeTo) && clearTimeout(this.resizeTo);
				this.resizeTo = setTimeout(this.resized, 500);
			},
			resized: function(){
				
			},
		});
		return App;
	}
);