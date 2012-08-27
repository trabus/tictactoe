var express = require('express');
var io = require('socket.io');
var Game = require('./server/game');

var app = express();
var server = require('http').createServer(app)
io = io.listen(server);

//var game = new Game(1,{bob:{name:'bob',token:'x'},dob:{name:'dob',token:'o'}});
// playerlist to contain all players connected to the lobby
var playerList = {};
var playerCount = 0;
var lobbyList = {};
var gameList = {};
var gameCount = 0;
var sockets = {};
var statuses = {
	lobby:{
		title:"in lobby", 
		available:true
	},
	game:{
		title:"in game",
		available:false
	},
	away:{
		title:"away",
		available:false
	}
};
//game.currentPlayer().startTurn();

app.use(express.logger());
app.use(express.errorHandler()); 
app.use(express.static(__dirname + '/static'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(app.router);
console.log("express server test");

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// was using jade, now just serving static html and js
app.get('/', function(req,res){
	//res.render('root',{title:"tictactoe"});
});

app.get('/lobby', function(req,res){
	res.send(playerList);
});


//app.listen(8000);
server.listen(8000);

// setup socket
io.sockets.on('connection', function (socket) {

	// joinlobby
	socket.on('joinLobby', function (data) {
    	console.log(data);
    	if(typeof(playerList[data.username]) === 'undefined'){
    		playerCount++;
    		socket.username = data.username;
    		sockets[socket.username] = socket;
    		playerList[data.username] = {id:playerCount, username:data.username, available:true, status:statuses.lobby.title};
    		lobbyList[data.username] = playerList[data.username];
    		socket.emit('playerJoin',{success:true, id:playerCount, username:data.username});
    		io.sockets.emit('lobbyUpdate',lobbyList);
    		console.log(lobbyList);
    	}else{
    		socket.emit('playerJoin',{ success:false, message:'username '+data.username+' is already taken'});
    	}
  	});
  	// leavelobby
  	socket.on('leaveLobby', function (data) {
  		delete lobbyList[data.username];
  		io.sockets.emit('lobbyUpdate',lobbyList);
  	});

  	// joingame -> user is joining another player
  	// joingame confirmation -> user is being joined by another player, confirm
  	socket.on('joinGame', function (data){
  		// set opponent
  		//console.log('joingame',data)
  		// set the response
  		var joinResponse = data.host ? 'joinGame' : 'joinGameConfirm';
  		// set the token
  		var token = data.host ? 'x' : 'o';
  		// set the opponent token
  		var opponentToken = data.host ? 'o' : 'x';
  		// reference player
  		var player = playerList[socket.username];
  		// set opponent
  		socket.opponent = data.opponent;
  		// set status
  		player.status = statuses.game.title;
  		// set player unavailable
  		player.available = false;
  		socket.broadcast.emit('statusUpdate',player);
  		sockets[socket.opponent].emit(joinResponse,{opponent:socket.username});
  		gameCount++;
  		gameList[socket.username] = new Game(gameCount, {player1:{name:socket.username,token:token},player2:{name:socket.opponent,token:opponentToken}});
  		//console.log('opponent: '+socket.opponent);
  		if(!data.host) gameList[socket.username].currentPlayer().endTurn();
  	});


  	// receive move
  	socket.on('squareClick', function (data) {
  		console.log('squareclick',data);
  		var square = Number(data.id.substr(-1,1)) -1;
  		if(gameList[socket.username].currentPlayer().move(square)){
  			gameList[socket.opponent].currentPlayer().move(square);
  			sockets[socket.opponent].emit('move',data);
  			gameList[socket.username].board.areSquaresAvailable();
  		}
  		if(gameList[socket.username].over){
  			var winner = {winner:gameList[socket.username].winner};
  			console.log(winner);
  			socket.emit('gameOver', winner);
  			sockets[socket.opponent].emit('gameOver', winner);
  		}
  	});
  	// leavegame
  	socket.on('leaveGame', function (data){
  		if(typeof(socket.opponent) !== 'undefined'){
			if(typeof(sockets[socket.opponent]) !== 'undefined') sockets[socket.opponent].emit('leaveGame');
		}
  		socket.opponent = null;
  		var player = playerList[socket.username]
  		player.status = statuses.lobby.title;
  		player.available = true;
  		socket.broadcast.emit('statusUpdate',player);
  		socket.emit('lobbyUpdate',lobbyList);
  		delete gameList[socket.username];
  	});
  	// disconnect
  	socket.on('disconnect', function () {
  		// if the player exists
  		if(playerList[socket.username]){
  			//console.log(socket.username+" left");
  			// broadcast player leaving to clean up lobby list or end any current games the player is in
  			socket.broadcast.emit('playerLeave', playerList[socket.username]);
  			// if the player has an opponent
  			if(typeof(socket.opponent) !== 'undefined'){
  				// if the socket reference for the opponent still exists, send leaveGame event
				if(typeof(sockets[socket.opponent]) !== 'undefined') sockets[socket.opponent].emit('leaveGame');
			}
			// clean up lists
  			delete playerList[socket.username];
  			delete lobbyList[socket.username];
  			delete gameList[socket.username];
  			delete sockets[socket.username];
  		}
  	});

});