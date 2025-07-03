@echo off
echo Cleaning previous build...
taskkill /f /im "Validador Aiken.exe" 2>nul
timeout /t 2 /nobreak >nul
rmdir /s /q dist-electron 2>nul

echo Building portable executable...
npm run build
npx electron-builder --config electron-builder.config.cjs --win --x64 --publish=never

echo.
echo Build completed! Check dist-electron folder for the portable .exe
pause