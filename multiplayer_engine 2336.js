/*
 * Multiplayer Engine Demo
 * @author Josh Gibbs - uPaymeiFixit@gmail.com
*/ console.log("r05081918 at " + new Date());

/********** SERVER_SIDE_SCRIPT **********/

var io,
	client = [], // Data for clients **client[0] = "hello"**
	cID = [], // Contains unorganized intexes as socket.id s **cID[socket.id] = 0**
	sID = [], // Contains organized intex with data as socket.id s **sID[0] = socket.id**
	removeIndex = [],
	addIndex = [];

( function()
{
	io = require( 'socket.io' ).listen( 4000 );

	io.set('log level', 1);



	setInterval( function()
	{
		io.sockets.emit( "RX", client, addIndex, removeIndex );
		addIndex = removeIndex = [];
	}, 1000/1 );

	// Connection -- starts connection
	io.sockets.on( 'connection', function( socket )
	{



		socket.on( "firstConnect", function( c_lient )
		{
			cID[socket.id] = sID.push(socket.id) - 1; // cID = sID.length; sID pushes socket.id
			//
			console.log("Client with SID: " + socket.id + " and CID: " + cID[socket.id] + " has connected.");
			console.log("There are now " + sID.length + " clients.");

			socket.emit( "firstConnect", client, ( sID.length - 1 ) );
			
			// Assigns data to new player ( if sID is even they will be a tank )
			//console.log("new player, sID%2 = " + sID.length % 2);
			client[cID[socket.id]] = c_lient;

			addIndex.push( cID[socket.id] );
		});




		// On message received
		socket.on( "TX", function( data )
		{
			client[cID[socket.id]] = data; // assigns that client data
		});


		// Message system
		socket.on( "message", function( message )
		{
			socket.broadcast.send( message, cID[socket.id] );
		});


		// Disconnect -- removes client
		return socket.on( 'disconnect', function()
		{
			
			//io.sockets.emit("disconnect", cID[socket.id] );
			removeIndex.push( cID[socket.id] );

			console.log("Client with SID: " + socket.id + " and CID: " + cID[socket.id] + " is disconnecting.");

			// Removes all of the client data
			client.splice(cID[socket.id],1);
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
}).call(this);