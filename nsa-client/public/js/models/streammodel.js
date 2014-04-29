// Filename: streammodel.js
define(
	[
		'jquery',
		'underscore',
		'backbone'
	],
	function($, _, Backbone, CamModel){
		var StreamModel = Backbone.Model.extend({
			defaults: {id: null, width: null, height: null, image: null},
			initialize: function(){
				_.bindAll(this, 'setImage', 'removeView');
			},
			setImage: function(d){
				this.set('image', d)
			},
			removeView: function(d){
				var jsonPath = d.key.split('.')[0];
				app.cameras.add({ jsonPath: jsonPath, id : jsonPath.split('_')[0], width: jsonPath.split('_')[1], height: jsonPath.split('_')[2], thumbnailPath: jsonPath.split('_')[0]+'tn.jpg' });
				app.cameras.camDataLoad();
				this.set('image', null);
			}
		})
		return StreamModel;
	}
);


