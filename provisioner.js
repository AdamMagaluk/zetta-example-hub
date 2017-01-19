var util = require('util');
var url = require('url');
var http = require('http');
var Device = require('zetta').Device;
var Config = require('./config');

var Provision = module.exports = function(configFile, key, credentials, id) {
  this._hubId = id;
  this._configFile = configFile;
  this._credentials = credentials;
  this.key = key;
  Device.call(this);
};
util.inherits(Provision, Device);

Provision.prototype.init = function(config) {
  // Set up the state machine 
  config
    .type('provisioner')
    .state('unprovisioned')
    .when('unprovisioned', { allow: ['set-key']})
    .when('provisioned', { allow: []})
    .map('set-key', this.provision, [{name:'key', type:'string'}]);
};

Provision.prototype._getAccessToken = function(config, ssoToken, cb) {
  var self = this;
  
  var body = 'grant_type=client_credentials&ssotoken=' + ssoToken + '&hubid=' + this._hubId;
  var parsed = url.parse(config.authorizationServer)
  var method = (parsed.protocol === 'https:') ? require('https') : require('http');

  var authOptions = {
    headers: {
      'Authorization': Buffer.from(this._credentials).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': body.length
    },
    hostname: parsed.hostname,
    port: parsed.port,
    path: parsed.path,
    protocol: parsed.protocol,
    method: 'POST'
  };

  var req = method.request(authOptions, function(res) {
    if (res.statusCode != 200) {
      return cb(new Error('expected 200 status code'));
    }
    var body = '';
    res.on('data', data => { body += data.toString()});
    res.on('end', function() {
      try {
        var json = JSON.parse(body)
      } catch(err) {
        return cb(err);
      }
      return cb(null, json.access_token);
    });
  });
  req.end(body);
};

Provision.prototype.provision = function(key, next) {
  var self = this;
  Config.load(self._configFile, function(err, config) {
    if (err) {
      return next(err);
    }

    self._getAccessToken(config, key, function(err, accessToken) {
      config.accessToken = accessToken;
      // tell the server when it restarts that it's provisioning for the first time
      config.runState = 'provisioning';
      Config.save(self._configFile, config, function(err) {
        if (err) {
          return next(err);
        }

        // Send response
        next();

        console.log('Restarting process in 5 seconds.')
        setTimeout(function() {
          // Restart process
          process.exit(3);
        }, 5000);
      });
    });
  });
};





