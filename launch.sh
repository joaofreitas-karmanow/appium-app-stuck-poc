#!/usr/bin/env bash

while true
do
  node index.js
  
  echo "Session finished, waiting for 10 seconds before starting new one."
  sleep 10
done