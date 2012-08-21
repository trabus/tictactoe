var express = require("express");

var app = express();
var game = {id:1};

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
	if(request.param("id")==game.id){
		response.send({ id: request.param("id"), move:request.param("move"), player:request.param("player") })
	}else{
		response.send({ id:"invalid", player:"none"});
	}
});

app.listen(8000);