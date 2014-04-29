// Filename: streamset.js
define(
	[
		'jquery',
		'underscore',
		'backbone',
		'models/streammodel',
		'views/stream'
	],
	function($, _, Backbone, StreamModel, Stream){
		var StreamSet = Backbone.Collection.extend({
			model: StreamModel,
			initialize: function(){
				this.on('add', this.newStream, this);
			},
			newStream: function(d){
				var streamView = new Stream({el: $('<div id="stream'+d.id+'" class="mod cam stream" />').appendTo(app.$el) , model : d });
			}
		})
		return StreamSet;
	}
);