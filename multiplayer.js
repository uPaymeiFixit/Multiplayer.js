/*
 * Multiplayer Engine Demo
 * @author Josh Gibbs - uPaymeiFixit@gmail.com
*/
var debug={logging:true,log:function(e){if(this.logging)console.log(e);},group:function(e){if(this.logging)console.group(e);},groupEnd:function(){if(this.logging)console.groupEnd();}};

Multiplayer = function( attached, callbacks, port, address )
{
	"use strict";
	var	socket;

	if ( typeof io === "undefined" )
		throw 'error: The script "socket.io.js" was not found or configured incorrectly.';

	if ( typeof port === "object" )
		socket = port;
	else
	{
		var uri = address || ( location.protocol + "//" + location.hostname ) + ":" + ( port || 4000 );
		socket = io.connect( uri );
	}

	socket.on( "connect", function()
	{
		debug.log( "Connection established with Socket ID: " + this.socket.sessionid );
	});

	socket.connect = function( attached )
	{
		/***** DATA CONTROL *****/

		// First data received
		this.on( "firstConnect", function( clients, myid )
		{
			this.id = myid;
			this.clients = clients;

			for( var i in clients )
				if ( clients.hasOwnProperty(i) )
					this.onconnect( clients[i] );

			// Add client
			this.on( "addClient", function( client )
			{
				// Sends the client and adds it to clients array
				this.onconnect( client, this.clients.push( client ) - 1 );
			});

			// Remove client
			this.on( "removeClient", function( client, id )
			{
				if ( id >= this.id ) --id;
				this.ondisconnect( client, id );
				this.id = id < this.id ? --this.id : this.id;
			});

			// Data receiver
			this.on( "RX", function( clients )
			{
				clients.splice(this.id,1);
				this.clients = clients;
				this.emit( "TX", this.me );
				this.onreceive( clients );
			});

		});

		this.me = this.me || attached;
		this.emit( "firstConnect", this.me );

		debug.group("We have connected with the following data:");
		debug.log( this.me );
		debug.groupEnd();

	};


	// Variables
	socket.version = 5.0618121809;
	callbacks = callbacks || {};
	socket.clients = [];
	socket.me = socket.me || attached;
	if ( socket.me ) socket.connect();

	// Other player control
	socket.update = function( attached )
	{
		return socket.me = attached;
	};

	// Message control
	socket.on( "message", function( message, id )
	{
		socket.onmessage( message, id >= socket.id ? --id : id );
	});

	socket.options = socket.socket.options;



	/***** CALLBACKS *****/
	
	// onconnect callback
	socket.onconnect = socket.onconnect || callbacks.onconnect || function( client, id )
	{
		debug.group("Connecting client " + id + " data:");
		debug.log( client );
		debug.groupEnd();
	};

	// ondisconnect callback
	socket.ondisconnect = socket.ondisconnect || callbacks.ondisconnect || function( client, id )
	{
		debug.group("Disconnecting client " + id + " data:");
		debug.log( client );
		debug.log("Our ID is now " + socket.id);
		debug.groupEnd();
	};

	// onreceive callback
	socket.onreceive = socket.onreceive || callbacks.onreceive || function( clients )
	{
		debug.group("Receiving clients data:");
		debug.log( clients );
		debug.groupEnd();
	};

	// onmessage callback
	socket.onmessage = socket.onmessage || callbacks.onmessage || function( message, id )
	{
		debug.log('We have received the message "' + message + '" from client ' + id);
	};



	// These evaluation functions should be used with caution
	socket.s_eval = function( string )
	{
		socket.emit( "s_eval", string );
	};
	socket.c_eval = function( string )
	{
		socket.emit( "c_eval", string );
	};
	socket.on( "c_eval", function( string )
	{
		eval( string );
	});

	socket.ping = function(callback)
	{
		callbacks.onping = callback || null;
		socket.emit( "ping", Date.now() );
	};
	socket.ping();

	socket.on( "ping", function( time ){
		this.pingTime = Date.now() - time;
		debug.log("Our ping time to the server was " + this.pingTime + "ms." );
		if (callbacks.onping != null)
			callbacks.onping(this.pingTime);
	});

	return socket;
};

// for this to be done we would need to have the scripts seperate, so which do we do?
// do we have the user require socket.io.js?

// TODO
// Multipalyer needs to be able to use pre-established connection and only define one if m.connect is called
// Rooms and player count need established
//
// • Each script must have a "random" key to log into the server
// • Rooms to act as seperate sockets (for lots of users)