$(function(){
	var username, id, token, lobbyView, lobbyJoinView;
	var gameOver = false;
	var myTurn = false;
	var socket = io.connect();//'http://localhost');
	var Nav = Backbone.Model.extend({defaults:{username:"anon",usercount:0}});
	var Player = Backbone.Model.extend({defaults:{id:0, username:"anon", className:"player"}});
	var Session = Backbone.Model.extend();
	var Game = Backbone.Model.extend();
	// create the nav model
	var nav = new Nav();
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
		// create the nav view
	var navView = new NavView({model:nav});
	// username prompt
	var LobbyJoinView = Backbone.View.extend({
		el:$('body'),
		template: _.template($('#tmpLobbyJoin').html()),
		events:{
			'change input#username' : 'join',
			'click #joinButton': 'join'
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
			if(username !== ""){
				console.log("join clicked ",username);
				socket.emit('joinLobby',{username:username});
				$('#join').addClass('hide');
			}
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
		events: {
			'click .buttons button': 'joinGame'
		},
		attributes: function () {
			return {id: "player"+this.model.get('id')};
		},
		template: _.template($('#tmpPlayer').html()),
		initialize: function () {
			_.bindAll(this, 'render', 'joinGame');
			this.model.on('change', this.render);
		},
		render: function () {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		},
		// join the game of another user, they are hosting
		joinGame: function (evt) {
			console.log('joingame click');
			if(this.model.get('available')){
				socket.emit('joinGame',{host:false, opponent:this.model.get('username')});
			}
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
			//playerView.available();
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
		template: _.template($('#tmpBoard').html()),
		events:{
			'click .square' : 'squareClick'
		},
		initialize: function () {
			_.bindAll(this, 'render', 'squareClick');
			this.render();
		},
		render: function () {
			$(this.el).html(this.template());
			$('body').append('<div id="gameOver"></div>');
			$('#gameOver').addClass('hide');
		},
		squareClick: function (evt){
			console.log('squareclick ',evt);
			var square = $(evt.currentTarget);
			if(!gameOver && myTurn && !square.hasClass('clicked')){
				myTurn = false;
				square.addClass('clicked');
				var back = square.find("div.back");
				back.addClass(token);
				console.log(square.attr('id'));
				socket.emit('squareClick', {id:square.attr('id'), token:token});
			}
		}
	});

	var GameOverView = Backbone.View.extend({
		el:'#gameOver',
		template: _.template($('#tmpGameOver').html()),
		events:{
			'click button' : 'returnClick'
		},
		initialize: function (){
			_.bindAll(this, 'render', 'returnClick');
			this.render()
		},
		render: function () {
			console.log('gameover render');
			$(this.el).html(this.template(this.model));
			console.log(this.el);
			$(this.el).removeClass('hide');
			return this;
		},
		returnClick: function (evt) {
			$('#gameOver').detach();
			lobbyView = new LobbyView();
			socket.emit('leaveGame');
			nav.set('opponent',"");
		}
	});

	// create the lobbyView
	lobbyView = new LobbyView();
	// create the lobbyJoinView
	lobbyJoinView = new LobbyJoinView();
	// playerjoin
	socket.on('playerJoin', function (data) {
		if(data.success){
			id = data.id;
			username = data.username;
    		nav.set('username',data.username);
    		var count = nav.get('usercount');
    		nav.set('usercount',++count);
    	}else{
    		$('#join').removeClass('hide');
    	}
    });

    // playerleave
    socket.on('playerLeave', function (data) {
    	console.log('playerleave',data);
    	lobbyView.playerList.removePlayer(data);
    	var count = nav.get('usercount');
    	count = --count < 0 ? 0 : count;
    	nav.set('usercount', count);
    });

    // lobbyUpdate
    socket.on('lobbyUpdate', function (data) {
    	console.log('lobbyUpdate',data);
    	_.each(data,function (player){
    		if(player.username !== username){
    			lobbyView.playerList.addPlayer(player);
    		}
    	});
    	nav.set('usercount', Object.keys(data).length);
    });

    socket.on('statusUpdate', function (data) {
    	console.log('statusupdate',data);
    	var player = lobbyView.playerList.collection.get(data.id);
    	player.set('available', data.available);
    	player.set('status', data.status);
    });
    // joinGame
    socket.on('joinGame', function (data){
    	// leave the lobby and join the game
    	console.log('joinGame');
    	nav.set('opponent',"now playing "+data.opponent);
    	var gameView = new GameView();
    	token = 'o';
    	gameOver = false;
    });

    socket.on('joinGameConfirm', function (data) {
    	console.log('GameConfirm');
    	socket.emit('joinGame',{host:true, opponent:data.opponent});
    	nav.set('opponent',"now playing "+data.opponent);
    	var gameView = new GameView();
		token = 'x';
		myTurn = true;
		gameOver = false;
    });

    socket.on('move', function (data) {
    	console.log('move',data);
    	$('#'+data.id).addClass('clicked');
		var square = $('#'+data.id).find("div.back");
		square.addClass(data.token);
		myTurn = true;
    });

    socket.on('gameOver', function (data) {
    	console.log('gameover',data)
    	gameOver = true;
    	myTurn = false;
    	var gameOverView = new GameOverView({model:data});
    });

    // leaveGame
    socket.on('leaveGame', function (data) {
    	// leave current game and join lobby
    	console.log('leaveGame');
    	// alert opponent player left
    	nav.set('opponent',"");
    	gameOver = true;
    	var gameOverView = new GameOverView({model:{winner:username}});
    });


});