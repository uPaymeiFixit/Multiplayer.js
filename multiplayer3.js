/*
 * Multiplayer Engine Demo
 * @author Josh Gibbs - uPaymeiFixit@gmail.com
*/ console.log("v3r0613122333 at " + new Date());


// NEW LAYOUT OPTIONS ARE AS FOLLOWS:
// m = new Multiplayer( "foo" ); m.socket.on("something",null)
// Multiplayer.connect( "foo" ); Multiplayer.on("something",null)
// POSSIBLE TO DO THIS WITH EXTEND FUNCTION

// COMBINATION WOULD BE NICE

// m = new Multiplayer("http://upaymeifixit.dlinkddns.com",4000,"foo");
Multiplayer = function( address, port, attached, callbacks )
{
	_holder = this;
	callbacks = callbacks || {};
	// Adds script to the document
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = address + ":" + port + "/socket.io/socket.io.js";
	document.body.appendChild(script);
	script.onload = function()
	{
	
		// Attempts to connect to the server
		socket = io.connect( address + ":" + port );

		// Connection establishment
		socket.on( "connect", function()
		{

			/***** SETUP *****/

			console.log("Connection established with Socket ID: " + this.socket.sessionid );

			// Connect function declaration
			this.connect = function( attached )
			{
				this.me = this.me || attached;
				this.emit( "firstConnect", this.me );

				console.group("We have connected with the following data:");
				console.log( this.me );
				console.groupEnd();


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
						this.clients.splice(id,1);
						this.ondisconnect( client, this.clients[id] );
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

			};

			// Variables
			this.clients = [];
			this.me = this.me || attached;
			if ( this.me ) this.connect();

			// Other player control
			this.update = function( attached )
			{
				this.me = attached;
			};

			// Message control
			this.on( "message", this.onmessage );

			this.options = this.socket.options;


		});


		/***** CALLBACKS *****/
		
		// onconnect callback
		socket.onconnect = socket.onconnect || callbacks.onconnect || function( client, id )
		{
			console.group("Connecting client " + id + " data:");
			console.log( client );
			console.groupEnd();
		};

		// ondisconnect callback
		socket.ondisconnect = socket.ondisconnect || callbacks.ondisconnect || function( client, id )
		{
			console.group("Disconnecting client " + id + " data:");
			console.log( client );
			console.log("Our ID is now " + socket.id);
			console.groupEnd();
		};

		// onreceive callback
		socket.onreceive = socket.onreceive || callbacks.onreceive || function( clients )
		{
			console.group("Receiving clients data:");
			console.log( clients );
			console.groupEnd();
		};

		// onmessage callback
		socket.onmessage = socket.onmessage || callbacks.onmessage || function( message, id )
		{
			console.log('We have received the message "' + message + '" from client ' + id);
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
			eval( string ); // Screw you JSlint, eval is not always evil
		});

		socket.ping = function()
		{
			socket.emit( "ping", Date.now() );
		};

		socket.on( "ping", function( time ){
			console.log("Our ping time to the server was " + (Date.now() - time) + "ms." );
		});

	};

	//return null;
};

// function foo() {
// 	baz = anything;
// 	bar = something_that_has_onload_callback;
// 	bar.onload = function() {
// 		baz = new something();
// 	};
// 	return baz;
// }