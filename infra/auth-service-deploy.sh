#!/bin/bash

set -e
#General configs
NODE_ENV="prod" #change in production
PORT=3001
ENC_KEY="secretkey",
SEC_KEY="encryption" #secret, change in production(use open ssl)


#Mongodb configs
MONGOSTRING="mongodb://mongodb:27017/streaming" #secret
MONGOUSER=user
MONGOPASSWORD=password


#Consul setting
SERVICE_NAME="auth-service"
CONSUL_HOST="consul-client" #change in production
CONSUL_PORT=8500


docker run \
  --name auth\
  --rm \
  -it \
  -e NODE_ENV="${NODE_ENV}" \
  -e PORT="${PORT}" \
  -e ENC_KEY="${ENC_KEY}" \
  -e SEC_KEY="${SEC_KEY}" \
  -e MONGOSTRING="${MONGOSTRING}" \
  -e MONGOUSER="${MONGOUSER}" \
  -e MONGOPASSWORD="${MONGOPASSWORD}" \
  -e SERVICE_NAME="${SERVICE_NAME}" \
  -e CONSUL_HOST="${CONSUL_HOST}" \
  -e CONSUL_PORT="${CONSUL_PORT}" \
  -p $PORT:3001 \
  --network streaming_network \
  cplk01/auth-service:latest