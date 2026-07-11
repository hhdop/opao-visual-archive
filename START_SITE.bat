@echo off
setlocal
cd /d "%~dp0"
set "NODE_BIN=C:\Users\86183\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
set "PNPM_CMD=C:\Users\86183\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd"
set "PATH=%NODE_BIN%;%PATH%"
echo Starting Visual Archive...
echo.
echo Open this address in your browser:
echo http://127.0.0.1:5174/
echo.
"%PNPM_CMD%" run dev
pause
