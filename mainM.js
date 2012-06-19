onload = function() {
	// Canvas setup, pay no attention to this
	stage = new Stage("c");
	s = new Sprite();
	stage.addChild(s);

	// Event setup, pay no attention to this either
	m = {x:0,y:0};
	addEventListener( "mousemove", function( event ) {
		m.x = event.pageX;
		m.y = event.pageY;
	});


	com = new Multiplayer( m );

	(function loop()
	{
		requestAnimationFrame( loop );
		s.graphics.clear();
		s.graphics.drawCircle( m.x, m.y, 20);
		for ( var i in com.clients )
			if ( com.clients.hasOwnProperty(i) )
				s.graphics.drawCircle( com.clients[i].x, com.clients[i].y, 20);
	}());
	
};

// https://github.com/uPaymeiFixit/Multiplayer.js
