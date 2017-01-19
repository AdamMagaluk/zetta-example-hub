var zetta = require('zetta');
var auth = require('zetta-peer-auth');
var Config = require('./config');
var Provisioner = require('./provisioner');
var testProvisionParams = require('./test_provision_params');
var setAccessToken = require('./set_access_token');

// Example Drivers
var Led = require('zetta-led-mock-driver');
var Photocell = require('zetta-photocell-mock-driver');

var configFile = process.env.CONFIG_FILE || './zetta_config.json'
var deviceKey = process.env.DEVICE_KEY || 'abc123';

Config.load(configFile, function(err, config) {
  if (err) {
    throw err
  }

  if (!config.authorizationServer) {
    throw new Error('No authorization server defined.')
  }

  if (!config.resourceServer) {
    throw new Error('No resource server defined.')
  }

  var provisionMode = (!config.accessToken);
  var key = (!config.key) ? process.env.DEFAULT_KEY : config.key;
  var server = zetta()
      .name(config.uuid)
      .link(config.resourceServer)

  if (provisionMode) {
    console.log('Starting Server in provision mode')
    var authOptions = {
      headers: {
        'Authorization': new Buffer(key).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: config.authorizationServer,
      method: 'POST',
      body: 'grant_type=client_credentials'
    }; // request to receive an access token 
    server.use(auth(authOptions))
    server.use(Provisioner, configFile, deviceKey, key, config.uuid);
  } else if (config.runState == 'provisioning') {
    console.log('Starting Server in provisioning mode')
    server.use(setAccessToken(config.accessToken));
    server.use(testProvisionParams(configFile, config));
  } else {
    server.use(setAccessToken(config.accessToken));
    console.log('Starting Server in running mode')
  }

  // Install Mock Drivers
  server.use(Led);
  server.use(Photocell);

  server.listen(1337)
});


