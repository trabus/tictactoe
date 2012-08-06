var assert = require("assert");
var Board = require('../board');
var Player = require('../player');
var Game = require('../game');
describe('Board', function(){
	var g, b, p;
	beforeEach(function(){
		g = new Game();
		b = new Board(g);
		g.addPlayer("bob","x");
		p = b.game.getPlayer(1);
	});
	describe('#resetBoard()', function(){
		it('should reset the board', function(){
			b.map = [1,1,1,1,1,1,1,1,1];
			b.resetBoard();
			assert.equal(b.map.toString(),'0,0,0,0,0,0,0,0,0');
		});
	});
	describe('#setSquare()', function(){
		it('should set a square on the map', function(){
			b.setSquare(p,1);
			assert.equal(b.map.toString(),'0,1,0,0,0,0,0,0,0');
		})
	});
	describe('#checkPlayerWin()', function(){
		it('should check for player win condition', function(){
			b.setSquare(p,0);
			b.setSquare(p,1);
			assert.equal(b.checkPlayerWin(p), false);
			b.setSquare(p,2);
			assert.equal(b.checkPlayerWin(p), true);
		});
	});
	describe('#getToken()', function(){
		it('should return player token', function(){
			b.setSquare(b.game.getPlayer(1),0);
			assert.equal(b.getToken(0), "x");
		});
	});
	describe('#getPlayerSquares()', function(){
		it('should return an array of squares occupied by target player', function(){
			assert.equal(b.getPlayerSquares(p).toString(), '');
			b.setSquare(p,0);
			b.setSquare(p,2);
			b.setSquare(p,4);
			assert.equal(b.getPlayerSquares(p).toString(), '0,2,4');
		});
	});
	describe('#isSquareAvailable()', function(){
		it('should return a boolean value of the availability of the target square', function(){
			b.setSquare(p,0);
			assert.equal(b.isSquareAvailable(0), false);
			assert.equal(b.isSquareAvailable(1), true);
		});
	});
	describe('#getAvailableSquares()', function(){
		it('should return an array of all available squares', function(){
			b.setSquare(p,0);
			b.setSquare(p,5);
			b.setSquare(p,3);
			assert.equal(b.getAvailableSquares().toString(), '1,2,4,6,7,8');
		});
	});
	describe('#areSquaresAvailable()', function(){
		it('should return a boolean value of if there are any squares left', function(){
			assert.equal(b.areSquaresAvailable(), true);
			// fill up squares
			for(var i = 0, len = b.squares-1; i < len; i++){
				b.setSquare(p,i);
			}
			assert.equal(b.areSquaresAvailable(), true);
			b.setSquare(p,8);
			assert.equal(b.areSquaresAvailable(), false);
		});
	});
}); 