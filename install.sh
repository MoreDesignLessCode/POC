#!/bin/bash

root_directory="."
verdaccio_command="verdaccio"

echo "Starting Verdaccio globally..."
nohup $verdaccio_command > /dev/null 2>&1 &

node_version=$(node -v | cut -d'v' -f2)

if [ "$node_version" -lt "19" ]; then
  for i in $root_directory/*; do
    if [ -d "$i" ] && [ -e "$i/package.json" ]; then
      echo "Installing dependencies for $i"
      cd "$i"
      yarn install
      if [ $? -ne 0 ]; then
        echo "Error: Failed to install dependencies for $i"
      else
        echo "Starting application in $i"
        nohup yarn start > /dev/null 2>&1 &
      fi
      cd ..
    fi
  done
else
  echo "Error: Node.js version must be less than 19."
fi