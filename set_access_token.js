var jsonParser = require('revolt-json-parser');
var revolt = require('revolt');

module.exports = function(accessToken) {
  return function(server) {
    server.onPeerRequest(function(request) {
      request.use(function(handle) {
        handle('request', function(pipeline) {
          return pipeline.map(function(env) {
            env.request.headers['Authorization'] = 'Bearer ' + accessToken;
            return env;
          });
        });
      });
    });
  };
};
