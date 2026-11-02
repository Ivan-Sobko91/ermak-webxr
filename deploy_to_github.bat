@echo off
chcp 65001 >nul
title Публикация WebXR проекта на GitHub Pages
cls
echo ======================================================================
echo    ПУБЛИКАЦИЯ WEBXR ПРИЛОЖЕНИЯ ЕРМАК НА GITHUB PAGES
echo    Дисциплина: Моделирование виртуальной и дополненной реальности
echo    Кафедра ЦТИГ ДВГУПС
echo ======================================================================
echo.
echo Репозиторий: https://github.com/Ivan-Sobko91/ermak-webxr.git
echo.

cd /d "%~dp0"
set REPO_URL=https://github.com/Ivan-Sobko91/ermak-webxr.git

echo [1/3] Настройка удаленного репозитория origin...
git config safe.directory *
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [2/3] Добавление файлов и создание коммита...
git add .
git commit -m "Eliminate Z-fighting and texture flickering in cab area" 2>nul
git branch -M main

echo [3/3] Отправка на GitHub...
git push -u origin main
if errorlevel 1 goto :fail

:success
echo.
echo ======================================================================
echo [УСПЕХ] Файлы успешно загружены в ваш репозиторий GitHub.
echo.
echo Ваше AR-приложение доступно по адресам:
echo   https://ivan-sobko91.github.io/ermak-webxr/index.html
echo   https://ivan-sobko91.github.io/ermak-webxr/webxr_app/index.html
echo.
echo Вы можете открыть ссылку на смартфоне для запуска режима AR.
echo ======================================================================
pause
exit /b 0

:fail
echo.
echo ======================================================================
echo [ВНИМАНИЕ] Произошла ошибка при отправке git push.
echo Проверьте авторизацию в GitHub или сетевое подключение.
echo ======================================================================
pause
exit /b 1
