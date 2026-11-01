@echo off
cd /d "%~dp0"
git remote remove origin
git remote add origin https://github.com/Ivan-Sobko91/ermak-webxr.git
git branch -M main
git push -u origin main
pause
