var Player = function(nbrID, stgName, stgToken, ojtGame){
	this.id = nbrID;
	this.name = stgName;
	this.token = stgToken;
	this.game = ojtGame;
}

Player.prototype = {
	// start the user's  turn
	startTurn: function(){
		// loop through and available map areas for user
		for(var i = 0; i < this.game.board.squares; i++){
			if(this.game.board.map[i] === 0) {
				console.log("square enabled");
			}
		}
	},	
	// end the user's turn, callback handler
	endTurn: function(event){
		console.log("endTurn");
		this.game.changePlayer();
		// record the user's click to the game object;
	},
	move: function(position){
		if(!this.game.over){
			if(this.game.board.areSquaresAvailable()){
				console.log("<<<<<<======== Player "+this.name+" Move ==========>>>>>>>")
				if(position < this.game.board.squares){
					//console.log("position: "+position,"\n",this.game.board.map,"\n",this.game.board.print());
					if(this.game.board.setSquare(this, position)){
					console.log("position: "+position,"\n",this.game.board.map,"\n",this.game.board.print());
						if(this.game.board.checkPlayerWin(this)){
							console.log("gameOver")
							this.game.over = true;
						}else{
							this.endTurn();
						}
						return true;
					}	
				}else{
					console.log('only 9 squares, '+position+' is invalid');
					return false;
				}
			}
		}
	},	
	token: null
	// unnecessary now, mark for removal
	// updateBoard: function(ojtBoard){
	// 	this.game.board.map = ojtBoard.map;
	// }
}

module.exports = Player;