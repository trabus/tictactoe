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
	// lobby
	/*
	socket.on('player:joinLobby', function (data, callback){

	})
*/
	//socket.emit('lobby', { users: lobby });
	// joinlobby
	socket.on('joinLobby', function (data) {
    	console.log(data);
    	if(typeof(playerList[data.username]) === 'undefined'){
    		playerCount++;
    		socket.username = data.username;
    		playerList[data.username] = {id:playerCount, username:data.username, status:"in lobby"};
    		lobbyList[data.username] = playerList[data.username];
    		socket.emit('playerJoin',{username:data.username});
    		io.sockets.emit('lobbyUpdate',lobbyList);
    		console.log(lobbyList);
    	}else{
    		socket.emit('playerJoin',{ message:'username '+data.username+' is already taken'});
    	}
  	});
  	// leavelobby
  	socket.on('leaveLobby', function (data) {
  		delete lobbyList[data.username];
  		io.sockets.emit('lobbyUpdate',lobbyList);
  	});
  	socket.on('disconnect', function () {
  		if(playerList[socket.username]){
  			console.log(socket.username+" left");
  			io.sockets.emit('playerLeave', playerList[socket.username]);
  			delete playerList[socket.username];
  			delete lobbyList[socket.username];
  			//io.sockets.emit('lobbyUpdate',lobbyList);
  		}
  	});
});

// test rendering square template
/*
app.get('/square',function(req, res){
	res.render('squaretest',{title:"square"});
});

// api test for ajax call
// still just a concept, need to work out details
app.get('/game', function(req, res){
	//req.id;
	if(req.param("id") == game.id && !game.over){
		var player = game.currentPlayer();
		var move = req.param("move");
		if(player.name !== req.param("player")){
			res.send({id: game.id, message:req.param("player")+" is not the current player!"});
		}else{
			if(!player.move(move-1)){
				res.send({id: game.id, message:"Move failed, space "+move+" is occupied by "+game.board.getPlayerAtSquare(move-1).name+"."})
			}else{
				//player.endTurn();
				res.send({id: game.id, message:"Move succeeded!", move:move, token:player.token, action:"move"});
			}
		}
		//response.send({ id: req.param("id"), move:req.param("move"), player:req.param("player") })
	}else{
		if(game.over){
			res.send({id: game.id, message:"Game "+game.id+" is over!",action:"reset"});
			game = new Game(1,{bob:{name:'bob',token:'x'},dob:{name:'dob',token:'o'}});
		}else{
			res.send({ id:"invalid", message:"No game by that id exists"});
		}
	}
});
*/