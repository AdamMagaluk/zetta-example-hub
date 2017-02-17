var request = require('request');
module.exports = function(server) {
  var changeCount = 0;
  var doorQuery = server.where({ type: 'door' });
  server.observe([doorQuery], function(door){
	console.log('changeCount' + changeCount)
    console.log('found door', door.once)

    door.on('open', function() {
		changeCount++;
      console.log('!!!turning on')
	  console.log('changeCount' + changeCount)
 if(changeCount === 2){
		console.log('!!!call api')
		console.log('changeCount' + changeCount)
		changeCount=0;
		 // api call..
		 callPush();
	}
    });
    door.on('close', function() {
		changeCount++;
      console.log('!!!turning off')
	  	console.log('changeCount' + changeCount)
 if(changeCount === 2){
		console.log('!!!call api')
		console.log('changeCount' + changeCount)
		changeCount=0;
		 // api call..
		 callPush();
	}
     
    });
   
  });
}

function callPush(){
	var requestData = {"EXTERNALID" : "demouser"}
	request({
    url: 'http://54.154.5.203:9008/pushnotificationiot',
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json",
    },
    body: requestData
	})
}