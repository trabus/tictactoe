var express = require("express");
var Game = require("./server/game");

var app = express();
var game = new Game(1,{bob:{name:'bob',token:'x'},dob:{name:'dob',token:'o'}});
game.currentPlayer().startTurn();

app.use(express.logger());
app.use(express.errorHandler()); 
app.use(express.static(__dirname + "/static"));
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
app.get('/', function(request,response){
	//response.render('root',{title:"tictactoe"});
});
// test rendering square template

app.get('/square',function(request, response){
	response.render('squaretest',{title:"square"});
});

// api test for ajax call
// still just a concept, need to work out details
app.get('/game', function(request, response){
	//request.id;
	if(request.param("id") == game.id && !game.over){
		var player = game.currentPlayer();
		var move = request.param("move");
		if(player.name !== request.param("player")){
			response.send({id: game.id, message:request.param("player")+" is not the current player!"});
		}else{
			if(!player.move(move-1)){
				response.send({id: game.id, message:"Move failed, space "+move+" is occupied by "+game.board.getPlayerAtSquare(move-1).name+"."})
			}else{
				//player.endTurn();
				response.send({id: game.id, message:"Move succeeded!", move:move, token:player.token, action:"move"});
			}
		}
		//response.send({ id: request.param("id"), move:request.param("move"), player:request.param("player") })
	}else{
		if(game.over){
			response.send({id: game.id, message:"Game "+game.id+" is over!",action:"reset"});
			game = new Game(1,{bob:{name:'bob',token:'x'},dob:{name:'dob',token:'o'}});
		}else{
			response.send({ id:"invalid", message:"No game by that id exists"});
		}
	}
});

app.listen(8000);