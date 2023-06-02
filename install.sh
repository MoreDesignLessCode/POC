#!/bin/bash

root_directory="."
verdaccio_command="verdaccio"

echo "Starting Verdaccio globally..."
"$verdaccio_command" &

# Wait for Verdaccio to start (adjust the sleep duration as needed)
sleep 10

node_version=$(node -v | awk -Fv '{print $2}')

if [[ $node_version < "19" ]]; then
  for dir in $root_directory/*; do
    if [[ -d "$dir" ]]; then
      if [[ -f "$dir/package.json" ]]; then
        # Exclude specific folders from running the script
        skipFolder=false
        if [[ "$(basename "$dir")" == "apip-ts-types-main" ]]; then skipFolder=true; fi
        if [[ "$(basename "$dir")" == "apip-ts-middleware-main" ]]; then skipFolder=true; fi
        if [[ "$(basename "$dir")" == "uxdl-primitives-main" ]]; then skipFolder=true; fi

        if [[ "$skipFolder" = false ]]; then
          echo "Cleaning up $dir"
          cd "$dir"

          # Delete yarn.lock file if it exists
          if [[ -f yarn.lock ]]; then
            echo "Deleting yarn.lock"
            rm yarn.lock
          fi

          # Delete package-lock.json file if it exists
          if [[ -f package-lock.json ]]; then
            echo "Deleting package-lock.json"
            rm package-lock.json
          fi

          echo "Installing dependencies for $dir"
          yarn install
          if [[ $? -ne 0 ]]; then
            echo "Error: Failed to install dependencies for $dir"
          else
            echo "Starting application in $dir"
            yarn start &
          fi

          cd ..
        else
          echo "Skipping $(basename "$dir")"
        fi
      fi
    fi
  done
else
  echo "Error: Node.js version must be less than 19."
fi
