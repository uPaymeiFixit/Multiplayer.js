Multiplayer.js
==============

Simple Multiplayer API that uses Socket.IO


For this example the node.js server we are running socket.io off of
is located at http://gibbs.tk:4000, but yours may be
different.

### Setup ###

Initiates a connection and sends the server "foo"

    m = new Multiplayer('foo');

Functionally identical to the above code, but broken up into two functions

    m = new Multiplayer();
    m.connect("foo");

Needs rewritten
The Multiplayer function also has several optional parameters: ( ordered left to right)

@param attached : attached data that you want to send as your player data
can be accessed through com.me and changed with com.update( attached )

@param callbacks : callback object that contains functions that will be called
after specific events fire. onconnect, ondisconnect, onreceive, onmessage

@param port_or_socket : can be used as either a socket that you have already setup
using io.connect, or a port for the specific location you need to connect to. the
default is 4000

@param address : string containing the address that you want the socket to attempt
to connect to. By default it will try to connect to the host of the current page
on port 4000

m will be returned back as a SocketNamespace, with all of the properties of
the default socket.io SocketNamespace, with a few extra items for multiplayer


### Player data ###

Updates your data 

    m.me == "foo"

Functionally identical to the above code  

    m.update( "foo" );

Connected clients are stored in an array  

    m.clients == ["bar","baz",...]
    
    
    
### Callbacks ###

Called whenever m.clients is updated  

    m.receive = function( clients )
    {
    	clients == ["bar","baz",...]
    };

Called whenever a new client is added  

    m.onconnect = function( client )
    {
    	client == "qux"
    };

Called whenever a client disconnects  

    m.ondisconnect = function( client )
    {
    	client == "bar"
    };

Called whenever you reveive a message  

    m.onmessage = function( message )
    {
    	message == "Hello!"
    };
    
    
### Other functions and data ###

Object that stores various socket options such as security  

    m.options

Broadcasts a message to all ohter clients, calls their onmessage() callback 

    m.send("Hello to you too!")

Pings the server  

    m.ping()

Time it took in milliseconds for the response to get back to the client 

    m.pingTime