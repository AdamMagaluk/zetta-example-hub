#!/bin/bash

export RESOURCE_SERVER=https://adammagaluk1-prod.apigee.net/v1
export AUTHORIZATION_SERVER=https://adammagaluk1-prod.apigee.net/v1/oauth/accesstoken
export DEFAULT_KEY=YiP8Zs4wpG7hYaAAQyukS9LF7ac0NZDy:VjjnIjeoUR2mUKk1

trap ctrl_c INT
function ctrl_c() {
        exit
}


while :
do
        node server.js
	sleep 1
done
