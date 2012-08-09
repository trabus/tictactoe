var G = require('./game');

var g = new G();
var bob = g.players[0];
var dob = g.players[1];
bob.move(0);
dob.move(5);
bob.move(2);
dob.move(1);
bob.move(3);
dob.move(4);
bob.move(6);
dob.move(0);
dob.move(7);
bob.move(8);
