var http = require('http');
var send = require('send');

// test concept using send module to serve index and static files
// intercepting api calls, would later filter through something that could better handle requests

var app = http.createServer(function(req, res){
	console.log("REQUEST:"+req.url);
	var url = require('url').parse(req.url, true);
	if(url.pathname.indexOf('/') !== -1){
		var splitPath = url.pathname.split('/');
		splitPath = splitPath.splice(1);
		var root = splitPath.shift();
		console.log('split: ',splitPath,'root: '+root);
	}
	console.log(url.pathname);
	// if the first index is an api call, parse it and return JSON
	if(splitPath &&  root === "api"){
		console.log("api call");
		// start JSON
		var output = '{';
		for(var i=0,len=splitPath.length; i<len; i++){
			output+='"'+splitPath[i]+'":"'+splitPath[++i]+'",';
		};
		output = output.substr(0,output.length-1);
		output+='}';
		res.writeHead( 200, { 'content-type': 'text/html' });
		res.end( output );
	}else{
		send(req, req.url)
			.root(__dirname+'/static')
			.pipe(res);
	}
});
app.listen(8080);