#!/usr/bin/env bash

if [ "$1" == "build" ]; then
  docker build -t quickmeet-frontend .
fi

if [ "$1" == "run" ]; then
  docker run -p 5173:5173 --env-file .env quickmeet-frontend:latest
fi

# stopping the docker container
if [ "$1" == 'stop' ]; then
  CONTAINER_ID=$(docker ps -q --filter "ancestor=quickmeet-frontend")
  if [ -n "$CONTAINER_ID" ]; then
    docker stop "$CONTAINER_ID"
  else
    echo "no running container found"
  fi
fi
