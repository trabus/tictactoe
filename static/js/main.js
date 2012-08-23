$(document).ready(function(){
	var socket = io.connect('http://localhost');
	var username = "bob";
	// joining the lobby
  	socket.on('playerJoin', function (data) {
    	console.log('playerJoin',data);
    });
    	//socket.emit('joinlobby', { username: username });
  	
	$(".square").on("click", function(){
		var square = $(this).find("div.back");
		/*
		$(this).toggleClass("clicked");
		if($(this).hasClass("clicked")){
			if(square.hasClass("x")){
				square.removeClass("x").addClass("o");
			}else if(square.hasClass("o")){
				square.removeClass("o").addClass("x");
			}else{
				square.addClass("x");
			}
		}*/
		var move = Number($(this).attr("id").substr(-1,1));
		/*
		$.ajax({
			url:'game/',
			data:{id:1,move:move,player:"bob"},
			success:function(data){
				console.log(data);
				console.log(data.message);
				$("#square"+data.move).toggleClass("clicked"); 
				$("#square"+data.move).find("div.back").addClass(data.token);
			}
		});
		*/
	});
	// BS ajax test to try out the "api" 
	/*
	$.ajax({
		url:'game/',
		data:{id:1,move:1,player:"bob"},
		success:function(data){
			console.log(data); 
			$("#square"+data.move).toggleClass("clicked"); 
			$("#square"+data.move).find("div.back").addClass(data.token);
		}
	});
	*/
});
// use translate3d for x and y transitions
// remove elements and add as scrolling limit to 4 or 5