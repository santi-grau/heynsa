// Filename: cammodel.js
define(
	[
		'jquery',
		'underscore',
		'backbone'
	],
	function($, _, Backbone, CamModel){
		var CamModel = Backbone.Model.extend({
			defaults: { id: null, jsonPath: null, frames: 0, currentFrame: null, width: null, height: null, looped: false, thumbnailPath: null, background: null},
			initialize: function(){
				_.bindAll(this,'nextFrame','setFrames', 'setBackground');
			},
			nextFrame: function(){
				if(this.get('currentFrame') < this.get('frames').length - 1) this.set('currentFrame' , this.get('currentFrame') + 1);
				else this.set({ looped : true, currentFrame : 0 });
			},
			setFrames: function(d){
				this.set({ frames : d, currentFrame : 0 });
				this.set('background' , '#000000');
				app.cameras.camDataLoad();
			},
			setBackground: function(d){
				this.set('background' , d);
			}
		});
		return CamModel;
	}
);


