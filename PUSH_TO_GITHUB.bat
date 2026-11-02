@echo off
chcp 65001 >nul
cd /d "%~dp0"
git config safe.directory *
git add .
git commit -m "Eliminate Z-fighting and texture flickering in cab area"
git branch -M main
git push -u origin main
pause
