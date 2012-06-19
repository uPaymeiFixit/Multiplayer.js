/*
 * Multiplayer Engine Demo
 * @author Josh Gibbs - uPaymeiFixit@gmail.com
*/ console.log("r0611122333 at " + new Date());



Multiplayer = function( address, attached )
{

	// Socket connection
	if ( typeof io !== "undefined" )
		this.socket = io.connect( address );
	else
		this.socket = { on: function(){} };

	this.connect = function( attached )
	{
		this.me = this.me || attached;
		this.socket.emit( "firstConnect", this.me );

		console.group("We have connected with the following data:");
		console.log( this.me );
		console.groupEnd();
	};


	// logging
	this.socket.on( "connect", function()
	{
		console.log("Socket ID: " + this_temp.socket.socket.sessionid );
	});


	/***** SETUP *****/

	// Variables
	this.me = this.me || attached;
	if ( this.me ) this.connect();
	this.clients = [];
	this.started = false;

	var this_temp = this;




	/***** OTHER PLAYER CONTROL *****/

	this.update = function( attached )
	{
		this.me = attached;
	};

	// Disconnect
	this.ondisconnect = function( client ) {};

	// Connect
	this.onconnect = function( client ) {};

	this.onreceive = function( clients ){};


	/***** DATA COMMUNICATION *****/

	// RX
	this.socket.on( "RX", function( clients, addIndex, removeIndex )
	{
		if ( typeof this_temp.id === "undefined" ) return;

		// Adds new clients if they are present
		for ( var i in addIndex )
		{
			if ( i !== this_temp.id )
			{
				this_temp.onconnect( clients[addIndex[i]] );
			}
		}

		// Removes clients if needed
		for ( i in removeIndex )
		{
			this_temp.ondisconnect( this_temp.clients[removeIndex[i]] ); // Gives us a chance before the next RX to mess with the removed client
			this_temp.id = removeIndex[i] < this_temp.id ? --this_temp.id : this_temp.id; // Sets our new ID now that the previous client is gone
		}

		// Updates client information
		clients.splice(this_temp.id,1); // Removes self from the array
		this_temp.clients = clients; // Updates clients
		if ( this_temp.started ) this_temp.socket.emit( "TX", this_temp.me ); // Sends me to the client unless first time has not been established
		this_temp.onreceive( clients ); // Calls the receive function if needed
	});

// MIKE, LOOK AT THIS PROBLEM Vikram
// when used inside of a socket function, "this" refers to this.socket
// we may be able to fix this by having a variable equal to this
// this.id can stay socket level though





	this.socket.on( "firstConnect", function( clients, id )
	{
		this_temp.id = id;
		clients.splice(id,1);
		this_temp.clients = clients;

		for ( var i in clients )
			this_temp.onconnect( clients[i] );
	});





	/***** MESSAGES *****/

	// Send
	this.send = function( message )
	{
		this.socket.send( message );
	};

	// Receive
	this.onmessage = function( message, index ){};
	this.socket.on( "message", this_temp.onmessage );




	/***** OTHER ATTACHED FUNCTIONS *****/

	// Self disconnect
	this.exit = this.socket.disconnect;

	// Options
	if ( this.socket.socket )
		this.options = this.socket.socket.options;


};

//		NOTES

//	clients				server
//
//	-> firstConnect(me)	<- firstConnect(clients)
//						-> connectClient(client)
//
//	-> exit()			-> disconnectClient(client)
//
//	-> TX(me)			<- RX(clients)
//
//	-> message(message)	-> message(message,id)


// -> [c0,c1,c2,c3,c4]
// -> disconnect(2)
// -> [c0,c1,c3,c4]

// Attached optional:
//	me
//	clients[]
//	-> send( data )
//	<- receive( data )
//	-> exit()
//	<- disconnect( id ) - needs new name
//	-> broadcast( message )
//	<- message( message )
//	-> connect( id )

// Establishes a connection
// Starts a loop
// Captures data that needs to be updated or a function that updates manually with an RX callback
// disconnect callback is needed

//		RX callback
// Pro - User only emits when needed
// Con - user has to update on their own loop
// con - the user should have nothing to put in the receive callback

// RX callback sets up a non-fatal death loop: (non fatal because of TCP delay)
// receive() { send() }

//		attached object
// Pro - user never has to touch the object past setup
// Con - loop is run even if unnecessary
// Con - receive callback is needed? yes because otherwise the user would have a weird time handling the data



m = new Multiplayer('http://localhost:4000', "foo" + Math.floor( Math.random() * 10) );
m.onconnect = function( client )
{
	console.group("Connecting client data:");
	console.log( client );
	console.groupEnd();
};
m.ondisconnect = function( client )
{
	console.group("Disconnecting client data:");
	console.log( client );
	console.log("Our ID is now " + m.id);
	console.groupEnd();
};
m.onreceive = function( clients )
{
//	console.group("Receiving client data:");
//	console.log( clients );
//	console.groupEnd();
};
m.onmessage = function( message, id )
{
	console.log('We have received the message "' + message + '" from client ' + id);
}


/*

For this example the node.js server we are running socket.io off of
is located at http://upaymeifixit.dlinkddns.com:4000, but yours may be
different.

		SETUP

// Initiates a connection and sends the server "foo"
m = new Multiplayer('http://upaymeifixit.dlinkddns.com:4000', "foo");

// Functionally identical to the above code, but broken up into two functions
m = new Multiplayer('http://upaymeifixit.dlinkddns.com:4000');
m.connect("foo");


		PLAYER DATA

// Updates your data
m.me == "foo"

// Functionally identical to the above code
m.update( "foo" );

// Connected clients are stored in an array
m.clients == ["bar","baz",...]


		CALLBACKS

// Called whenever m.clients is updated
m.receive = function( clients )
{
	clients == ["bar","baz",...]
};

// Called whenever a new client is added
m.onconnect = function( client )
{
	client == "qux"
};

// Called whenever a client disconnects
m.ondisconnect = function( client )
{
	client == "bar"
};

// Called whenever you reveive a message
m.onmessage = function( message )
{
	message == "Hello!"
};


		OTHER FUNCTIONS AND DATA

// Object that stores various socket options such as security
m.options

// Broadcasts a message to all ohter clients, calls their onmessage() callback
m.send("Hello to you too!");

// Closes the socket connection
m.exit();


	TODO
• Each script must have a "random" key to log into the server
• Rooms to act as seperate sockets (for lots of users)
• Fix all of the bugs

*/