#!/usr/bin/env bash

if [ "$1" == "build" ]; then
  docker build -t victorchrollo14/quickmeet-backend .
fi

if [ "$1" == "run" ]; then
  docker run -p 3000:3000 --env-file .env victorchrollo14/quickmeet-backend:latest
fi

# stopping the docker container
if [ "$1" == 'stop' ]; then
  CONTAINER_ID=$(docker ps -q --filter "ancestor=quickmeet-backend")
  if [ -n "$CONTAINER_ID" ]; then
    docker stop "$CONTAINER_ID"
  else
    echo "no running container found"
  fi
fi
