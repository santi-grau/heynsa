// Filename: cam.js
define(
	[
		'jquery',
		'underscore',
		'backbone',
		'jqueryui'
	],
	function($, _, Backbone,$){
		var Cam = Backbone.View.extend({
			initialize: function(){
				_.bindAll(this, 'setFrame', 'makeNoise', 'setBackground');
				this.setStartPosition();
				var _this = this;
				
				this.model.bind('change:currentFrame' , this.loadFrame, this);
				this.model.bind('change:background' , this.setBackground);
				this.$el.css({
					width: this.model.get('width'),
					height: this.model.get('height'),
					'z-index' : _.size(app.cameras)
				}).draggable({ stack: ".cam", scroll: false });
				this.setInnerPositions();
				this.$el.html($('<div class="frames"></div><div class="noise"><div class="date"><span></span></div></div>'));
				setInterval(this.makeNoise,100);
			},
			setStartPosition: function(){
				var position = Math.floor(Math.random()*4);
				switch(position){
					case 0:
						this.$el.css({ left: -240, top: Math.floor(Math.random()*($(window).height()-240)) });
						break;
					case 1:
						this.$el.css({ left: $(window).width(), top: Math.floor(Math.random()*($(window).height()-240)) });
						break;
					case 2:
						this.$el.css({ left: Math.floor(Math.random()*($(window).width()-240)), top: -240 });
						break;
					case 3:
						this.$el.css({ left: Math.floor(Math.random()*($(window).width()-240)), top: $(window).height() });
						break;
				}
			},
			setInnerPositions : function(){
				this.$el.css({
					left: Math.floor(Math.random()*($(window).width()-this.model.get('width'))),
					top: Math.floor(Math.random()*($(window).height()-this.model.get('height')))
				})
			},
			loadFrame: function(){
				if(!this.model.get('looped')){
					var _this = this;
					var image = new Image();
					image.onload = function(){ _this.setFrame(this) };
					image.src = this.model.get('frames')[this.model.get('currentFrame')].data;
				}else{
					this.setFrame();
				}
			},
			makeNoise: function(){
				this.$el.find('.noise').css({ 'background-position' : Math.random()*100+'px '+Math.random()*100+'px' });
			},
			setFrame: function(event){
				if(event) $('<img class="frame" src="'+event.src+'" width="'+event.width+'" height="'+event.height+'" />').appendTo(this.$el.find('.frames'));
				this.$el.find('.frame.active').removeClass('active');
				this.$el.find('.frame:eq('+this.model.get('currentFrame')+')').addClass('active');
				this.$el.find('span').html(this.model.get('frames')[this.model.get('currentFrame')].ts);
				_.delay(this.model.nextFrame,1000);
			},
			setBackground: function(m){
				this.$el.css('background-image','url("'+m.get('background')+'")');
			}
		});
		return Cam;
	}
);