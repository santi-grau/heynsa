// Filename: stream.js
define(
	[
		'jquery',
		'underscore',
		'backbone',
		'jqueryui'
	],
	function($, _, Backbone,$){
		var Stream = Backbone.View.extend({
			initialize: function(){
				_.bindAll(this, 'makeNoise', 'setStream');
				this.model.on('change:image', this.addImage, this);
				this.model.once('change:width', this.setStream, this);
				this.$el.html($('<div class="frames"></div><div class="noise"><div class="date live"><span></span></div></div>'));
				setInterval(this.makeNoise,100);
			},
			makeNoise: function(){
				this.$el.find('.noise').css({ 'background-position' : Math.random()*100+'px '+Math.random()*100+'px' });
			},
			setStream: function(){
				this.$el.css({
					left: Math.floor(Math.random()*($(window).width()-this.model.get('width'))),
					top: Math.floor(Math.random()*($(window).height()-this.model.get('height'))),
					'z-index' : _.size(app.cameras) + 1
				}).draggable({ stack: ".cam", scroll: false });
			},
			addImage: function(){
				var _this = this;
				var src = this.model.get('image');
				if(src == null) this.remove();
				if(src == null) return;
				var image = new Image();
				image.src = src;
				image.onload = function() {
					_this.$el.css({ width: this.width, height: this.height });
					_this.model.set({ width: this.width, height: this.height })
					_this.$el.find('.frame').remove();
					$('<img src="'+src+'" class="frame" width="'+this.width+'" height="'+this.height+'" />').appendTo(_this.$el.find('.frames'));
					var now = new Date();
					_this.$el.find('span').html(now.toUTCString());
				}
			}
		})
		return Stream;
	}
);