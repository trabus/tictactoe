var Board = require('./board');
var Player = require('./player');
var Game = function(ojtPlayerData){
	this.init(ojtPlayerData);
};

Game.prototype = {
	winner: 0,
	maxPlayers: 2,
	over: false,
	init: function (ojtPlayerData) {
		var player;
		if(typeof ojtPlayerData === 'undefined') {
			//ojtPlayerData = {bob:{name:'bob',token:'x'},dob:{name:'dob',token:'o'}};
		}
		//console.log('init');
		this.players = {};
		this.playerStack = [];
		this.board = new Board(this);
		this.over = false;
		this.winner = 0;
		this.board.moves = 0;
		for(val in ojtPlayerData){
			console.log(val);
			player = ojtPlayerData[val];
			this.addPlayer(player.name,player.token);
		}
		//console.log(this.players);
	},
	turn: function () {

		var player = this.currentPlayer();
		player.startTurn();
	},
	addPlayer: function(stgName, stgToken){
		if(this.playerStack.length <= 2){
			var id = this.playerStack.length+1;
			this.players[id] = new Player(id, stgName, stgToken, this);
			this.playerStack.push(id);
			//console.log(id)
			//console.log(this.playerStack)
		}else{
			console.log("over");
		}
	},
	getPlayer: function(playerID){
		return this.players[playerID];
	},
	currentPlayer: function (){
		// player at index 0 is always current player
		//console.log("currentplayerid:"+this.playerStack[0]);
		return this.players[this.playerStack[0]];
	},
	changePlayer: function(){
		var p = this.playerStack.shift();
		console.log(p);
		this.playerStack.push(p);
		console.log(this.playerStack);
		console.log(this.players[this.playerStack[0]].name,this.players[this.playerStack[1]].name);
	}

};
module.exports = Game;