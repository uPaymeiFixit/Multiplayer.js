/*
 * Multiplayer Engine Demo - Josh Gibbs - uPaymeiFixit@gmail.com
*/

/********** SERVER_SIDE_SCRIPT **********/

( function() {

  var io = require( 'socket.io' ).listen( 4000 ),
      client = [],
      clientID = [];

  io.set('log level', 1);

  // Connection -- starts connection
  io.sockets.on( 'connection', function( socket ) {

    // Update -- updates client and sends it back
    socket.on( 'update', function( data ) {
      if ( clientID[ socket.id ] == null ) {
        console.log( 'SV: Adding client ' + ( data.id = clientID[ socket.id ] = client.length ) + ' with SID: ' + socket.id );
      };
      /*console.log ( 'SV: Receiving -> ' + JSON.stringify(*/ client[ clientID[socket.id] ] = data// ) );
      console.log( 'RX -> ' + JSON.stringify(data) )
      console.log( 'TX -> ' + JSON.stringify(client) )
      return io.sockets.emit( 'send_data', client );
    });


    // Disconnect -- removes client
    return socket.on( 'disconnect', function() {
      console.log( 'SV: Disconnecting client ' + clientID[ socket.id ] + ' with SID: ' + socket.id );
      
      client.splice( clientID[ socket.id ] );
      delete clientID[ socket.id ];

      return io.sockets.emit( 'send_data', client );
    });


  });


}).call(this);//*/