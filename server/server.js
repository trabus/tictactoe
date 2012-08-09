var http = require("http");
var fs = require("fs");

var server = http.createServer(function(req,res){
	fs.readFile('./client/index.html', function(err, content){
		//console.log(content);
		res.writeHead( 200, { 'content-type': 'text/html' });
		res.end( content );
	});
	console.log("waiting");
});

server.listen(8000);


/**
Server at index listens for new clients,
asks for username (possibly login later?)
moves them to lobby
Provides choice between hosting, joining, or AI
hosting opens waiting screen and adds to joinable host que
joining goes to list of joinable hosts to click and join
AI begins local session with player

Session begins between host and opponent
initiate socket.io
initiate match - choose '2/3', '3/5', '6/10', '11/20', or 'no limit' to start

Session begins between client and AI
initiate match - no limit

Match begins, tokens(X and O) are randomly assigned to start
assign id to player AND game for authentication when sending moves -
moves are sent to specific api and processed as recieved. 
Processing a move triggers an event that sends moves to all players to update board
initiate game -
create new game instance
create players, setting player tokens
create new board instance
intitiate turn - X always goes first

Turn begins, 
Board sets up available spots for click handling
Turn timer begins, makes random move if runs out

Player clicks available spot
click handler executes-

Stop turn timer

Check for win condition or tie if no available spots left
Push move to opponent with socket.io

Turn ends
player
=====================
Game logic lies almost entirely on server
Clients use Backbone for view as a single page app
Clients contact server via s
*/