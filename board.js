var Board = function(game){
	this.resetMap();
	this.game = game;
};

Board.prototype = {
	squares: 9,
	moves: 0,
	map: [],
	game: null,
	winPatterns: [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],
	resetMap: function(){
		this.map = [];
		for(var i = 0; i < this.squares; i++){
			this.map[i] = 0;
		}
	},
	setSquare: function(player, square){
		// make sure the square is empty
		if(this.map[square] === 0){
			this.map[square] = player.id;
			this.moves++;
			return true;
		}else{
			console.log("====== Square occupied, choose another =====");
			return false;
		}
	},
	// get array of player squares and compare to win patterns
	checkPlayerWin: function(player){
		var square, pattern, hits;
		var isWinner = false;
		var squares = this.getPlayerSquares(player);
		var squarelen = squares.length;
		var patternlen = this.winPatterns.length;
		// make sure we've got enough squares occupied to have a win
		if(squarelen >= 3){
			// loop through the win patterns
			for(var i = 0; i < patternlen; i++){
				// set the current pattern to check against
				pattern = this.winPatterns[i];
				// reset hits
				hits = 0;
				/*
				console.log("=======Checking Win Pattern=======");
				console.log("pattern: "+pattern);
				console.log("squares: "+rraSquares);
				*/
				// loop through squares
				for(var j = 0; j < squarelen; j++){
					/*
					switch(rraSquares[j]){
						case pattern[0]:
							hits++;
							break;
						case pattern[1]:
							hits++;
							break;
						case pattern[2]:
							hits++;
							break;
					}
					*/
					// trying ternary operator to see if it's any faster
					square = squares[j];
					// add up any hits on the pattern
					hits += (square === pattern[0] ? 1 : 0)+(square === pattern[1] ? 1 : 0)+(square === pattern[2] ? 1 : 0);
					//console.log("square "+j+" contents: "+rraSquares[j]+" hits: "+hits);
					if (hits >= 3) {
						console.log("=======Checking Win Pattern=======");
						console.log("pattern: "+pattern);
						console.log("squares: "+squares);
						console.log("square "+j+" contents: "+squares[j]+" hits: "+hits);
						isWinner = true;
						break;
					}
				}
				if(isWinner){
					console.log("WINNER: "+player.name);
					console.log("===================================");
					break;
				}
			}
		}else{
			/*
			console.log("=======Not Enough Moves to Check Win Pattern=======");
			console.log("Current moves: "+rraSquares);
			console.log("=================================")
			*/
		}

		return isWinner;
	},
	getToken: function(square) {
		var player = this.game.players[this.map[square]];
		var token = typeof player === "undefined" ? " " : player.token;
		//console.log("getToken: "+token);
		return token;
	},
	// loop through squares and return an array containing positions occupied by player
	getPlayerSquares: function(player){
		var squares = [];
		for(var i = 0; i < this.squares; i++){
			if(this.map[i] === player.id){
				squares.push(i);
			}
		}
		return squares;
	},
	isSquareAvailable: function(square){
		var squares = this.getAvailableSquares();
		if(squares.indexOf(square) === -1){
			return false;
		}else{
			return true;
		}
	},
	getAvailableSquares: function(){
		var squares = [];
		for(var i = 0; i < this.squares; i++){
			if(this.map[i] === 0){
				squares.push(i);
			}
		}
		return squares;
	},
	areSquaresAvailable: function(){
		if(this.getAvailableSquares().length > 0){
			return true;
		}else{
			return false;
		}
	},
	/**
		@method print - prints out the board as ascii art
		*/
	print: function(){
		// so we're going to print out a little grid using a nested loop. Xs Os and _ for empty
		var output = "\n";
		for (var i = 0; i < 3; i++) {
			output += "|";
			for (var j = 0; j < 3; j++){
				//console.log("token space"+((i*3)+j));
		// eventually output html, maybe write a different function, like getTokenAsHTML
		// or turn it into a template function
				output += this.getToken((i*3)+j)+"|";
			}
			output+= "\n";
		} 
		//console.log("print output",output);
		return output;
	}
}

module.exports = Board;