var uuid = require('uuid');
var fs = require('fs');

function defaultConfig() {
  return {
    resourceServer: process.env.RESOURCE_SERVER,
    authorizationServer: process.env.AUTHORIZATION_SERVER,
    uuid: uuid.v4(),
    key: null
  };
}
module.exports.default = defaultConfig;

function saveConfig(configFile, config, cb) {
  fs.writeFile(configFile, JSON.stringify(config, null, ' '), cb);
}
module.exports.save = saveConfig;

function loadConfig(configFile, cb) {
  fs.readFile(configFile, (err, data) => {
    if (err) {
      var config = defaultConfig();
      return saveConfig(configFile, config, function(err) {
        return cb(err, config);
      });
    }

    try {
      var json = JSON.parse(data.toString());
    } catch(err) {
      return cb(err);
    }

    var config = defaultConfig();
    Object.keys(json).forEach(k => {
      config[k] = json[k];
    });

    return saveConfig(configFile, config, function(err) {
      return cb(err, config);
    });
  });
}
module.exports.load = loadConfig;
