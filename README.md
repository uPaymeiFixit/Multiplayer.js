Multiplayer.js
==============

Simple Multiplayer API that uses Socket.IO


Player data
===========

Updates your data 

    m.me == "foo"

Functionally identical to the above code  

    m.update( "foo" );

Connected clients are stored in an array  

    m.clients == ["bar","baz",...]
    
    
    
Callbacks
=========

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
    
    
Other functions and data
========================

Object that stores various socket options such as security  

    m.options

Broadcasts a message to all ohter clients, calls their onmessage() callback 

    m.send("Hello to you too!")

Pings the server  

    m.ping()

Time it took in milliseconds for the response to get back to the client 

    m.pingTime