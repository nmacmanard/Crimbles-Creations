/*Space bar*/
$("input").focus(function() {
  $(this).animate({width:"400px", backgroundColor: "#FFF"}, 500);
}).blur(function(){
  $(this).animate({width: "300px", backgroundColor: "#f0f0f0"}, 500);
});
/*space bar*/
