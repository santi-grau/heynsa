// Filename: camset.js
define(
	[
		'jquery',
		'underscore',
		'backbone',
		'models/cammodel',
		'views/cam'
	],
	function($, _, Backbone, CamModel, Cam){
		var CamSet = Backbone.Collection.extend({
			model: CamModel,
			initialize: function(){
				this.on('add', this.loadCamData, this);
				this.once('add', this.camDataLoad, this);
			},
			loadCamData: function(){
				var model = this.get(this.last().id);
				var camview = new Cam({el : $('<div id="'+model.get('id')+'" class="mod cam"  />').appendTo(app.$el), model: model});
				camview.model.set('view', camview);
				$.get( 'https://s3-eu-west-1.amazonaws.com/heynsa/'+model.get('thumbnailPath'), model.setBackground);
			},
			camDataLoad: function(){
				var model = this.findWhere({frames: 0});
				if(model) $.getJSON( "https://s3-eu-west-1.amazonaws.com/heynsa/"+model.get('jsonPath')+".json", model.setFrames);
			}
		});
		return CamSet;
	}
);