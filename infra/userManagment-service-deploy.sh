#!/bin/bash
source .env

set -e
#General configs
NODE_ENV="prod" #change in production
PORT=3001
JWT_KEY="development-jwt-key" #secret, change in production(use open ssl)


#Mongodb configs
MONGOSTRING="mongodb://mongodb:27017/streaming" #secret
MONGO_INITDB_ROOT_USERNAME=user
MONGO_INITDB_ROOT_PASSWORD=password


#Consul setting
CONSUL_SERVICE_NAME="auth-service"
CONSUL_HOST="consul-client" #change in production
CONSUL_PORT=8500


docker run \
  --name auth\
  --rm \
  -it \
  -e NODE_ENV="${NODE_ENV}" \
  -e PORT="${PORT}" \
  -e JWT_KEY="${JWT_KEY}" \
  -e MONGOSTRING="${MONGOSTRING}" \
  -e MONGO_INITDB_ROOT_USERNAME="${MONGO_INITDB_ROOT_USERNAME}" \
  -e MONGO_INITDB_ROOT_PASSWORD="${MONGO_INITDB_ROOT_PASSWORD}" \
  -e CONSUL_SERVICE_NAME="${CONSUL_SERVICE_NAME}" \
  -e CONSUL_HOST="${CONSUL_HOST}" \
  -e CONSUL_PORT="${CONSUL_PORT}" \
  -p $PORT:3001 \
  --network test \
  cplk01/auth-service:latest