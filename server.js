var zetta = require('zetta');
var auth = require('zetta-peer-auth');
var Config = require('./config');
var Provisioner = require('./provisioner');
var testProvisionParams = require('./test_provision_params');
var setAccessToken = require('./set_access_token');

// Trigger for push notification
var trigger = require('./trigger'); 

// Example Drivers
var Light = require('zetta-light-mock-driver');
var Photocell = require('zetta-photocell-stateful-mock-driver');
var Security = require('zetta-security-mock-driver');
var Door = require('zetta-door-mock-driver');
var Window = require('zetta-window-mock-driver');
var Motion = require('zetta-motion-mock-driver');
var Thermometer = require('zetta-thermometer-mock-driver');
var Thermostat = require('zetta-thermostat-mock-driver');

var GlucoseMeter = require('zetta-glucose-meter-mock-driver');
var InsulinPump = require('zetta-insulin-pump-mock-driver');

// Style
var styleProperties = require('./style_properties');
var style = require('./style');


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
      .properties({style: styleProperties})
      .use(style, styleProperties)
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

  if (process.env.HUB_TYPE === 'medical') {
    server.use(GlucoseMeter);
    server.use(InsulinPump);
  } else {
    server.use(Light, 'Porch Light')
    server.use(Light, 'Family Room Light')
    server.use(Photocell);
    server.use(Security);
    server.use(Door);
    server.use(Window);
    server.use(Motion);
    server.use(Thermostat);
  }

  // Trigger for push notification
  server.use(trigger)

  server.listen(1337)
});


