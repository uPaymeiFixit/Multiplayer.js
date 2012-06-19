/*
 * Multiplayer Engine Demo
 * @author Josh Gibbs - uPaymeiFixit@gmail.com
*/ console.log("v3r0613121918 at " + new Date());

var port = 4000,
	TXspeed = 1000/30,
	clients = [],
	cID = [],
	sID = [],
	io;

( function()
{
	io = require( "socket.io" ).listen( port );
	io.set( "log level", 1 );




	// TX Loop
	setInterval( function()
	{
		io.sockets.volatile.emit( "RX", clients );
	}, TXspeed );




	// Start connection
	io.sockets.on( "connection", function( socket )
	{

		return socket.on( "firstConnect", function( client )
		{
			socket.broadcast.emit( "addClient", client );
			socket.emit( "firstConnect", clients, cID[socket.id] = sID.push( socket.id ) - 1 );
			clients.push( client );

			console.log("Client with SID: " + socket.id + " and CID: " + cID[socket.id] + " has connected.");
			console.log("There are now " + sID.length + " clients.");


			socket.on( "TX", function( client )
			{
				clients[cID[socket.id]] = client;
			});

			socket.on( "message", function( message )
			{
				socket.broadcast.send( message, cID[socket.id] );
			});

			socket.on( "c_eval", function( string )
			{
				socket.broadcast.emit( "c_eval", string );
			});

			socket.on( "s_eval", function( string )
			{
				console.log('Evaluating: "' + string + '"');
				eval( string ); // Screw you JSlint, eval is not always evil
			});

			// TODO Clean up functions that contain only single functions
			socket.on( "ping", function( time )
			{
				socket.emit( "ping", time );
			});

			return socket.on( "disconnect", function()
			{
				socket.broadcast.emit( "removeClient", client[cID[socket.id]], cID[socket.id] );
				console.log("Client with SID: " + socket.id + " and CID: " + cID[socket.id] + " is disconnecting.");
				
				clients.splice(cID[socket.id],1);
				sID.splice(cID[socket.id],1);
				var n = cID[socket.id];
				delete cID[socket.id];
				for ( var i = n; i < sID.length; i++ )
				{
					--cID[sID[i]];
				}

				console.log("There are now " + sID.length + " clients.");
			});


		});
	});

}).call(this);