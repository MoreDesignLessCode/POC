#!/bin/bash

root_directory="."
verdaccio_command="verdaccio"

echo "Starting Verdaccio globally..."
$verdaccio_command &

# Wait for Verdaccio to start (adjust the sleep value as needed)
sleep 10

node_version=$(node -v)
node_major_version=${node_version#"v"}

if [[ $node_major_version -lt 19 ]]; then
  for i in $root_directory/*; do
    if [[ -d "$i" && -f "$i/package.json" ]]; then
      # Exclude specific folders from running the script
      skipFolder=""
      if [[ "$(basename "$i")" == "apip-ts-types-main" ]]; then
        skipFolder=true
      fi
      if [[ "$(basename "$i")" == "apip-ts-middleware-main" ]]; then
        skipFolder=true
      fi
      if [[ "$(basename "$i")" == "uxdl-primitives-main" ]]; then
        skipFolder=true
      fi
      
      if [ -z "$skipFolder" ]; then
        echo "Cleaning up $i"
        cd "$i" || exit 1
        
        echo "Installing dependencies for $i"
        yarn install
        if [ $? -ne 0 ]; then
          echo "Error: Failed to install dependencies for $i"
        else
          echo "Starting application in $i"
          yarn start &
        fi
        cd ..
      else
        echo "Skipping $(basename "$i")"
      fi
    fi
  done
else
  echo "Error: Node.js version must be less than 19."
fi
