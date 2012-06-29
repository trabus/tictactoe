var http = require('http');
var Game = require('./game');
var g = new Game();

g.addPlayer("bob","x");
g.addPlayer("dob","o");

// var b = g.getPlayer(0);
// var d = g.getPlayer(1);
/*var moves = [0,2,1,3,4,6,7,2,8,5];
for(var i = 0, len = moves.length; i<len; i++){
	if(i%2){
		b.move(moves[i]);
	}else{
		d.move(moves[i]);
	}
}*/

var getAvailableSquare = function(){
	var squares = g.board.getAvailableSquares();
	return squares[Math.floor(Math.random()*squares.length)];
}
// analizes which strategies can still win and eliminates non-winning squares from the pool
var getOptimalSquare = function(){

}
// analizes if opponent has any squares that will cause a win and blocks
var blockCheck = function(player){

}

var AI = function(player){
	// if the move fails, run again
	if(!g.over && g.board.areSquaresAvailable()){
		if(!player.move(getAvailableSquare())){
			if(!g.over){
				console.log("bad move, retrying");
				// retry move
				AI(player);
			}
		}else{
			//console.log("Board: \n",g.board.print());
			//console.log("now moving with ",g.currentPlayer().name)
			AI(g.currentPlayer());
		}
	}else{
		console.log("TIE GAME");
		console.log("APP COMPLETE");
	}
}
AI(g.currentPlayer());
/**
NOTES and TODOS

* Game management, decouple starting, ending, and add a menu for the game
* Finish game interaction methods, event handling and turn management
* add SocketIO interaction for realtime updating
* figure out a way to use templates for output
* create a lobby system for matchmaking

*/