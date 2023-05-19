@echo off
set root_directory="."

for /F "tokens=1,2 delims=v" %%a in ('node -v') do set "node_major_version=%%b"

if "%node_major_version%" LSS "19" (
  for /D %%i in (%root_directory%\*) do (
    if exist "%%i\package.json" (
      echo Installing dependencies for %%i
      cd "%%i"
      yarn install
      if errorlevel 1 (
        echo Error: Failed to install dependencies for %%i
      ) else (
        echo Starting application in %%i
        start cmd.exe /k "yarn start"
      )
      cd ..
    )
  )
) else (
  echo Error: Node.js version must be less than 19.
)