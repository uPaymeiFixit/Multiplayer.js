Multiplayer.js
==============

Simple Multiplayer API that uses Socket.IO  
[Live Demo](http://gibbs.tk/Multiplayer.js/example) | [Socket.io Documentation](http://socket.io/#how-to-use) | [node.js](http://nodejs.org/)  

For this example the node.js server we are running socket.io off of is located at http://gibbs.tk:4000, but yours will be different.  

### Installation ###

Multiplayer.js requires that you have a socket.io server running on node.js.  
To view installation guides for these visit [nodejs.org](http://nodejs.org/) and [Socket.IO](http://socket.io/#how-to-use)

Include the necessary scripts in your HTML
```html
    <script src="http://gibbs.tk:4000/socket.io/socket.io.js"></script>
    <script src="multiplayer.js"></script>
```

### Setup ###

To start a new multiplayer system, we would use the Multiplayer constructor
```javascript
    var m = new Multiplayer( player, callbacks, port_or_socket, address )
```

When we call the Multiplayer constructor, it will connect to the Socket.IO server and return the SocketNamespace with other properties specific to Multiplayer.js attached to it. In this case, where we called Multiplayer with m, m will have all of the functions and uses of a normal SocketNamespace, which are documented at [Socket.IO](http://socket.io/#how-to-use).   

Initiates a connection and tells the other clients that you have connected with the data "foo". This data is stored in m.me.
```javascript
    var m = new Multiplayer("foo");
```
Functionally identical to the above code, but broken up into two functions
```javascript
    var m = new Multiplayer();
    m.connect("foo");
```


The callbacks parameter accepts an object that contains functions which will be called after specific events have fired. onconnect, ondisconnect, onreceive, and onmessage are all of the optional callback functions, which are further document in the __callbacks__ section.  
```javascript
    m = new Multiplayer( "foo", {
        onmessage = function( message, id ) {
            alert( "Client " + id + " says " + message )
        }
    })
```
You can appoint the callback functions at any time.
```javascript
    m.onmessage = function( message, id ) {
        alert( "Client " + id + " says " + message )
    }
```

The third parameter can be used in two ways. It can be used to attach the Multiplayer properties and callbacks to a preexisting SocketNamespace as shown below ...
```javascript
    var socket = io.connect( "http://gibbs.tk:4000" )
    var m = new Multiplayer( "foo", null, socket )
```

... or as the port that you want to use to connect to server through. If your Socket.IO server is listening on a different port than 4000, you will want to change this parameter. You can also include the fourth parameter as shown below to specify a custom URI to use to connect to the Socket.IO server. Both of these parameters may be optional depending on your situation. If left blank, the port will default to 4000, and the URI will default to the current host of the page.
```javascript
    var m = new Multiplayer( "foo", null, 4000, "http://gibbs.tk" )
```



### Player data ###

Updates your data 
```javascript
    m.me = "newfoo"
```
Functionally identical to the above code  
```javascript
    m.update( "newfoo" );
```
Connected clients are stored in an array  
```javascript
    m.clients == ["bar","baz",...]
```
    
    
### Callbacks ###

Called whenever m.clients is updated  
```javascript
    m.receive = function( clients )
    {
    	clients == ["bar","baz",...]
    };
```
Called whenever a new client is added  
```javascript
    m.onconnect = function( client )
    {
    	client == "qux"
    };
```
Called whenever a client disconnects  
```javascript
    m.ondisconnect = function( client )
    {
    	client == "bar"
    };
```
Called whenever you reveive a message  
```javascript
    m.onmessage = function( message, id )
    {
    	message == "Hello!"
        id == (an index of m.clients)
    };
```
    
### Other functions and data ###

Object that stores various socket options such as security  
```javascript
    m.options
```
Broadcasts a message to all ohter clients, calls their onmessage() callback 
```javascript
    m.send("Hello to you too!")
```
Pings the server  
```javascript
    m.ping()
```
Time it took in milliseconds for the response to get back to the client 
```javascript
    m.pingTime
```