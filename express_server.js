var express = require("express");

var app = express.createServer();
var game = {id:1};

app.configure(function(){
	app.use(express.logger());
	app.use(express.static(__dirname + "/public"));
	app.set('views', __dirname + '/views');
  	app.set('view engine', 'jade');
  	app.use(express.bodyParser());
  	//app.use(express.methodOverride());
  	app.use(app.router)
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.get('/', function(request,response){
	response.render('root',{title:"tictactoe"});
});
app.get('/game', function(request, response){
	//request.id;
	if(request.param("id")==game.id){
		response.send({ id: request.param("id"), move:request.param("move"), player:request.param("player") })
	}else{
		response.send({ id:"invalid", you:"suck"});
	}
});

app.listen(8000);