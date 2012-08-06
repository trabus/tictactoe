$(document).ready(function(){
	$(".square").on("click", function(){
		var square = $(this).find("div.back");
		$(this).toggleClass("clicked");
		if($(this).hasClass("clicked")){
			if(square.hasClass("x")){
				square.removeClass("x").addClass("o");
			}else if(square.hasClass("o")){
				square.removeClass("o").addClass("x");
			}else{
				square.addClass("x");
			}
		}
	});
});