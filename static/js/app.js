$(function(){
	var Lobby = Backbone.Model.extend();
	var Player = Backbone.Model.extend();
	var Session = Backbone.Model.extend();
	var Game = Backbone.Model.extend();

	var GameView = Backbone.View.extend({
		el: $('body'),
		template: _.template($('#game_template').html());

	});

});