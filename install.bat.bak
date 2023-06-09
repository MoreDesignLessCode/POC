@echo off
set root_directory="."
set verdaccio_command=verdaccio

echo Starting Verdaccio globally...
start cmd /C "%verdaccio_command%"

REM Wait for Verdaccio to start (adjust the timeout value as needed)
timeout /T 10

for /F "tokens=1,2 delims=v" %%a in ('node -v') do set "node_major_version=%%b"

if "%node_major_version%" LSS "19" (
  for /D %%i in (%root_directory%\*) do (
    if exist "%%i\package.json" (
      REM Exclude specific folders from running the script
      set "skipFolder="
      if /I "%%~nxi"=="apip-ts-types-main" set skipFolder=true
      if /I "%%~nxi"=="apip-ts-middleware-main" set skipFolder=true
      if /I "%%~nxi"=="uxdl-primitives-main" set skipFolder=true
      
      if not defined skipFolder (
        echo Cleaning up %%i
        cd "%%i"
        
        REM Delete yarn.lock file if it exists
        if exist yarn.lock (
          echo Deleting yarn.lock
          del yarn.lock
        )
        
        REM Delete package-lock.json file if it exists
        if exist package-lock.json (
          echo Deleting package-lock.json
          del package-lock.json
        )
        
        echo Installing dependencies for %%i
        yarn install
        if errorlevel 1 (
          echo Error: Failed to install dependencies for %%i
        ) else (
          echo Starting application in %%i
          start cmd /C "yarn start"
        )
        cd ..
      ) else (
        echo Skipping %%~nxi
      )
    )
  )
) else (
  echo Error: Node.js version must be less than 19.
)
