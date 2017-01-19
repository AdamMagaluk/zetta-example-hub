var Config = require('./config');

module.exports = function(configFile, config) {
  return function(runtime) {
    var handler = function(ev, msg) {
      if (msg.peer.url.indexOf(config.resourceServer.replace('http://', '').replace('https://', '')) != 1) {
        config.runState = 'provisioned';
        Config.save(configFile, config, function(err) {
          if (err) {
            throw err;
          }
          clearTimeout(timer);
          console.log('Successfully provisioned.');
          runtime.pubsub.unsubscribe('_peer/connect', handler);
        });
      }
    };

    // Timeout if not connected
    var timer = setTimeout(function() {
      console.log('Provisioning timeout reached, reverting back to provision mode.')
      delete config.runState;
      delete config.ssoToken;
      Config.save(configFile, config, function(err) {
        if (err) {
          throw err;
        }
        process.exit(4);
      });
    }, 30000)
    
    runtime.pubsub.subscribe('_peer/connect', handler);
  };
};
