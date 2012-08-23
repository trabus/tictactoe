$(function(){
	var socket = io.connect('http://localhost');
	var Nav = Backbone.Model.extend({defaults:{username:"anon",usercount:0}});
	var Lobby = Backbone.Model.extend({url:'/lobby'});
	var Player = Backbone.Model.extend({defaults:{id:0, username:"anon", className:"player"}});
	var Session = Backbone.Model.extend();
	var Game = Backbone.Model.extend();
	var PlayerList = Backbone.Collection.extend({
		model: Player
	});
	var NavView = Backbone.View.extend({
		el:$('#nav'),
		template: _.template($('#tmpNav').html()),
		initialize: function () {
			_.bindAll(this, 'render');
			this.model.on('change', this.render);
		},
		render: function () {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		}
	});
	// username prompt
	var LobbyJoinView = Backbone.View.extend({
		el:$('body'),
		template: _.template($('#tmpLobbyJoin').html()),
		events:{
			'change input#username' : 'contentChanged',
			'click input#join': 'join'
		},
		initialize: function () {
			console.log('lobbyjoinview');
			_.bindAll(this, 'render', 'contentChanged');
			this.render();
			this.inputContent = this.$('input#username');
		},
		render: function () {
			$(this.el).append(this.template());
			return this;
		},
		contentChanged: function (evt){
			console.log('input: '+this.inputContent.val());
		},
		join: function (evt){
			var username = this.inputContent.val();
			console.log("join clicked ",username);
			socket.emit('joinLobby',{username:username});
			$('#join').addClass('hide');
		}
	});
	// lobby is the main initial view for joining players
	// displays all currently connected players in a list
	var LobbyView = Backbone.View.extend({
		el:$('#main'),
		template: _.template($('#tmpLobby').html()),
		//events:{'click':''}
		initialize: function () {
      		_.bindAll(this, 'render');
      		this.render();
      		this.playerList = new PlayerListView();
      		//console.log('LobbyView',this.model.toJSON());
    	},
    	render: function () {
    		$(this.el).html(this.template());
      		return this;
    	},
	});

	// player is an indivdual entity that has joined the lobby
	// players can host or join another hosting player (or play the cpu)
	var PlayerView = Backbone.View.extend({
		tagName: 'li',
		attributes: function () {
			return {id: "player"+this.model.get('id')};
		},
		template: _.template($('#tmpPlayer').html()),
		initialize: function () {
			_.bindAll(this, 'render');
		},
		render: function () {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		},
		updateStatus: function () {
		}
	});

	var PlayerListView = Backbone.View.extend({
		el:'#content',
		template: _.template($('#tmpPlayerList').html()),
		initialize: function () {
			console.log('player list view init');
			_.bindAll(this, 'render', 'appendPlayer','removePlayer');
			this.collection = new PlayerList();
			this.collection.bind('add', this.appendPlayer);

			this.counter = 0;
			this.render();
		},
		render: function () {
			var self = this;
			console.log('this el',$(this.el));
			$(this.el).html(this.template());
			_(this.collection.models).each(function(player){ // in case collection is not empty
        		self.appendPlayer(player);
      		}, this);
		},
		appendPlayer: function (player) {
			var playerView = new PlayerView({
				model: player
			});
			$('ul', this.el).append(playerView.render().el);
		},	
		addPlayer: function (data){
      		var player = new Player();
      		player.set(data);
      		this.collection.add(player);
    	},
    	removePlayer: function (data){
    		var player = this.collection.get(data.id);
    		console.log(player);
    		this.collection.remove(player);
    		console.log(this.collection.models);
    		this.render();
    	}
	});

	// game view for when two players have started a game together
	var GameView = Backbone.View.extend({
		el: $('#main'),
		template: _.template($('#tmpBoard').html())
	});

	// create the nav model
	var nav = new Nav();
	// create the nav view
	var navView = new NavView({model:nav});
	// create the lobbyView
	var lobbyView = new LobbyView();
	// create the lobbyJoinView
	var lobbyJoinView = new LobbyJoinView();

	socket.on('playerJoin', function (data) {
    	nav.set('username',data.username);
    	var count = nav.get('usercount');
    	nav.set('usercount',++count);
    });
    socket.on('playerLeave', function (data) {
    	console.log('playerleave',data);
    	lobbyView.playerList.removePlayer(data);
    	var count = nav.get('usercount');
    	nav.set('usercount', --count);
    });
    socket.on('lobbyUpdate', function (data){
    	console.log('lobbyUpdate',data);
    	_.each(data,function (player){
    		lobbyView.playerList.addPlayer(player);
    	});
    	nav.set('usercount', Object.keys(data).length);
    });
	//var playerListView = new PlayerListView();
	//playerListView.addPlayer();
	//playerListView.addPlayer();
});