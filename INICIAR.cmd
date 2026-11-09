@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale Node.js 22.12 ou posterior e execute novamente.
  pause
  exit /b 1
)
if not exist node_modules (
  call npm.cmd ci
  if errorlevel 1 (
    echo Nao foi possivel instalar as dependencias. Consulte o README.
    pause
    exit /b 1
  )
)
echo Forja de Herois - mantenha esta janela aberta enquanto usa o site.
call npm.cmd run dev -- --open
pause
