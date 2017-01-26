module.exports = function(server) {
  var ledQuery = server.where({ type: 'led' });
  server.observe([ledQuery], function(led){

    console.log('found led', led.once)

    led.on('turn-on', function() {
      console.log('!!!turning on')
    });
    led.on('turn-off', function() {
      console.log('!!!turning off')
      // api call..
    });
    
  });
}
