## Running the hub

1. First install the dependancies.
`npm install`

2. Start the hub, replace the device key with any random string. Each hub would have a unique device key printed out back of the hub. Eg. 'xdgsg82' `DEVICE_KEY=<device key> ./start.sh`

## Activate the hub

1. In Browser. `http://adammagaluk1-test.apigee.net/oauth/v2/authorize?redirect_uri=http://localhost:3000/callback&client_id=l46A9mZvFm9DBFinyuzUQcmnTZHRMTcA&scope=openid%20profile%20email&response_type=code&state=123456`

Register or Login and it will redirect you to localhost:3000. Copy `code=<code>&state=123456` from the url.


Get access token. `curl -X POST -v -H 'Authorization:Basic bDQ2QTltWnZGbTlEQkZpbnl1elVRY21uVFpIUk1UY0E6azRUSVBEQ05Hb0xScFFrVQ==' -H 'Content-Type:application/x-www-form-urlencoded' --data 'grant_type=authorization_code&redirect_uri=http://localhost:3000/callback&client_id=l46A9mZvFm9DBFinyuzUQcmnTZHRMTcA&client_secret=k4TIPDCNGoLRpQkU&<copied_text>' http://adammagaluk1-test.apigee.net/oauth/v2/accesstoken?grant_type=authorization_code`

Copy `access_token` json property.

2. Activate hub. `curl -X POST -H "Content-Type:application/json" --data '{"key": "<device key>", "ssoToken": "<access_token>"}' -v -H "Authorization:Bearer <access_token>" https://adammagaluk1-prod.apigee.net/v1/hubs/activate`

## See hub in Link response

`curl -v -H "Authorization:Bearer <token>" https://adammagaluk1-prod.apigee.net/v1`
