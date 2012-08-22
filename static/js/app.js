$(function(){
	var Lobby = Backbone.Model.extend({url:'/lobby'});
	var Player = Backbone.Model.extend({defaults:{id:0, username:"anon"}});
	var Session = Backbone.Model.extend();
	var Game = Backbone.Model.extend();
	var PlayerList = Backbone.Collection.extend({
		model: Player
	})

	// lobby is the main initial view for joining players
	// displays all currently connected players in a list
	var LobbyView = Backbone.View.extend({
		el:$('#main'),
		template: _.template($('#tmpLobby').html()),
		//events:{'click':''}
		initialize: function() {
      		_.bindAll(this, 'render');
      		this.model.on('change', this.render);
    	},
    	render: function() {
    		$(this.el).html(this.template(this.model.toJSON()));
      		return this;
    	},
	});

	// player is an indivdual entity that has joined the lobby
	// players can host or join another hosting player (or play the cpu)
	var PlayerView = Backbone.View.extend({
		tagName: 'li',
		template: _.template($('#tmpPlayer').html()),
		initialize: function() {
			_.bindAll(this, 'render');
		},
		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		}
	});

	var PlayerListView = Backbone.View.extend({
		el:$('.lobby div.content'),
		template: _.template($('#tmpPlayerList').html()),
		initialize: function() {
			console.log('player list view init');
			_.bindAll(this, 'render', 'appendPlayer');
			this.collection = new PlayerList();
			this.collection.bind('add', this.appendPlayer);

			this.counter = 0;
			this.render();
		},
		render: function() {
			var self = this;
			console.log('this el',$(this.el));
			$(this.el).html(this.template());
			_(this.collection.models).each(function(player){ // in case collection is not empty
        		self.appendPlayer(player);
      		}, this);
		},
		appendPlayer: function(player) {
			var playerView = new PlayerView({
				model: player
			});
			$('ul', this.el).append(playerView.render().el);
		},	
		addPlayer: function(){
      		this.counter++;
      		var player = new Player();
      		player.set({
        		id: this.counter, username: "anon"+this.counter// modify item defaults
      		});
      		this.collection.add(player);
    	}
	});

	// game view for when two players have started a game together
	var GameView = Backbone.View.extend({
		el: $('#main'),
		template: _.template($('#tmpBoard').html())
	});

	var playerListView = new PlayerListView();
	playerListView.addPlayer();
});