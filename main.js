/*
 * Multiplayer Engine Demo
 * @author Josh Gibbs - uPaymeiFixit@gmail.com
*/ console.log("r05071906 at " + new Date());

var socket = io.connect('http://upaymeifixit.dlinkddns.com:4000');
console.log("Socket ID: " + socket.id);

//colors = ['#F0F','#F00','#0F0','#00F','#F80'];
//color = Math.floor(Math.random()*colors.length);


//message function, takes input
socket.on('message', function( msg ) {
	$("#output").append("<li style='color: #00F'>" + msg + "</li>");
});

function send( msg ) {
	socket.send( msg );
      $("#output").append("<li style='color: #F00'>" + msg + "</li>");
}

socket.on("newuser", function(){
      $("#output").append("<li style='color: #444'>A new user has connected.</li>");
});

socket.on("dis", function(){
      $("#output").append("<li style='color: #444'>A user has disconnected.</li>");
});


function r() { window.location.reload(); }